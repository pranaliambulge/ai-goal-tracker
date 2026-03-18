import ollama
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, datetime, os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Secret key
app.config["SECRET_KEY"] = os.getenv("JWT_SECRET", "secret123")

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsAllowInvalidCertificates=True
)

db = client["daily_tracker"]
users = db["users"]
goals = db["goals"]
progress = db["daily_progress"]


@app.route("/")
def home():
    return "Daily Tracker API Running"


# REGISTER
@app.route("/auth/register", methods=["POST"])
def register():

    data = request.json

    if users.find_one({"email": data["email"]}):
        return jsonify({"message": "User already exists"}), 400

    users.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": generate_password_hash(data["password"])
    })

    return jsonify({"message": "Registered successfully"})


# LOGIN
@app.route("/auth/login", methods=["POST"])
def login():

    data = request.json

    user = users.find_one({"email": data["email"]})

    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({
        "user_id": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({"token": token})


# CREATE GOAL
@app.route("/goals", methods=["POST"])
def create_goal():

    token = request.headers.get("Authorization")
    decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])

    data = request.json

    goal = {
        "user_id": decoded["user_id"],
        "goal_type": data["goal_type"],
        "target": data["target"],
        "duration": data["duration"],
        "start_date": str(datetime.datetime.utcnow())
    }

    goals.insert_one(goal)

    return jsonify({"message": "Goal created successfully"})


# AI PLAN GENERATOR (LOCAL AI)
@app.route("/plan", methods=["POST"])
def generate_plan():

    data = request.json

    goal = data["goal"]
    target = data["target"]
    duration = data["duration"]

    prompt = f"""
Create a simple structured plan.

Goal: {goal}
Target: {target}
Duration: {duration} days

Provide:
1. Weekly roadmap
2. Daily tasks
3. Tips to stay consistent
"""

    response = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )

    plan = response["message"]["content"]

    return jsonify({"plan": plan})


# ADD PROGRESS
@app.route("/progress", methods=["POST"])
def add_progress():

    token = request.headers.get("Authorization")
    decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])

    data = request.json

    score = 0

    if data.get("task_completed"):
        score += 5

    if data.get("goal_progress"):
        score += 3

    progress.insert_one({
        "user_id": decoded["user_id"],
        "date": str(datetime.datetime.utcnow()),
        "task_completed": data.get("task_completed"),
        "goal_progress": data.get("goal_progress"),
        "score": score
    })

    return jsonify({"message": "Progress saved", "score": score})


# GET PROGRESS
@app.route("/progress", methods=["GET"])
def get_progress():

    token = request.headers.get("Authorization")
    decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])

    user_progress = list(progress.find(
        {"user_id": decoded["user_id"]},
        {"_id": 0}
    ))

    return jsonify(user_progress)


if __name__ == "__main__":
    app.run(debug=True)