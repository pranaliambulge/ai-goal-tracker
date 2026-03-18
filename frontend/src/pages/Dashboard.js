import { useState } from "react";
import axios from "axios";

function Dashboard() {

  const [goalType, setGoalType] = useState("");
  const [target, setTarget] = useState("");
  const [duration, setDuration] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const [taskCompleted, setTaskCompleted] = useState("");
  const [goalProgress, setGoalProgress] = useState("");
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");

  // CREATE GOAL + PLAN
  const createGoal = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/goals",
        { goal_type: goalType, target, duration },
        { headers: { Authorization: token } }
      );

      generatePlan();

    } catch (err) {
      alert(err.response?.data?.message || "Error creating goal");
    }
  };

  // AI PLAN
  const generatePlan = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:5000/plan",
        { goal: goalType, target, duration }
      );

      setPlan(res.data.plan);
      setLoading(false);

    } catch {
      setLoading(false);
      alert("Error generating AI plan");
    }
  };

  // SAVE DAILY ACTIVITY
  const addProgress = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/progress",
        {
          task_completed: taskCompleted,
          goal_progress: goalProgress
        },
        { headers: { Authorization: token } }
      );

      alert("Progress saved!");
      setTaskCompleted("");
      setGoalProgress("");

    } catch {
      alert("Error saving progress");
    }
  };

  // GET HISTORY
  const getHistory = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/progress",
        { headers: { Authorization: token } }
      );

      setHistory(res.data);

    } catch {
      alert("Error fetching history");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center p-10">

      {/* Header */}
      <div className="text-white text-center mb-8">
        <h1 className="text-4xl font-bold">AI Universal Goal Tracker</h1>
        <p className="text-lg opacity-90">
          Create any goal and AI will generate a roadmap for you
        </p>
      </div>

      {/* GOAL CARD */}
      <div className="bg-white rounded-xl shadow-xl p-8 w-96 mb-6">

        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Create Your Goal
        </h2>

        <input
          className="w-full border p-2 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Goal (Example: Learn Dance)"
          onChange={(e) => setGoalType(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Target"
          onChange={(e) => setTarget(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Duration (days)"
          onChange={(e) => setDuration(e.target.value)}
        />

        <button
          onClick={createGoal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          Generate AI Plan
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-white text-xl mb-6">
          AI is generating your plan...
        </div>
      )}

      {/* AI PLAN */}
      {plan && !loading && (
        <div className="bg-white rounded-xl shadow-xl p-8 w-[650px] mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            AI Generated Plan
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-line text-gray-700">
            {plan}
          </div>
        </div>
      )}

      {/* DAILY ACTIVITY */}
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 mb-6">

        <h2 className="text-xl font-semibold mb-3">
          Daily Activity
        </h2>

        <input
          className="w-full border p-2 mb-2 rounded"
          placeholder="What did you complete today?"
          value={taskCompleted}
          onChange={(e) => setTaskCompleted(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Progress (e.g. 50%)"
          value={goalProgress}
          onChange={(e) => setGoalProgress(e.target.value)}
        />

        <button
          onClick={addProgress}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Save Activity
        </button>

      </div>

      {/* HISTORY BUTTON */}
      <button
        onClick={getHistory}
        className="bg-yellow-500 text-white px-6 py-2 rounded mb-4"
      >
        Show My History
      </button>

      {/* HISTORY */}
      {history.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow w-[650px]">

          <h2 className="text-xl font-semibold mb-4">
            Your Activities
          </h2>

          {history.map((item, index) => (
            <div key={index} className="border-b py-2">
              <p><strong>Task:</strong> {item.task_completed}</p>
              <p><strong>Progress:</strong> {item.goal_progress}</p>
              <p className="text-sm text-gray-500">{item.date}</p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Dashboard;