import { useState } from "react";
import axios from "axios";

function Dashboard() {

  const [goalType, setGoalType] = useState("");
  const [target, setTarget] = useState("");
  const [duration, setDuration] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const createGoal = async () => {

    try {

      await axios.post(
        "http://127.0.0.1:5000/goals",
        {
          goal_type: goalType,
          target: target,
          duration: duration
        },
        {
          headers: { Authorization: token }
        }
      );

      generatePlan();

    } catch (err) {

      alert(err.response?.data?.message || "Error creating goal");

    }

  };


  const generatePlan = async () => {

    try {

      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:5000/plan",
        {
          goal: goalType,
          target: target,
          duration: duration
        }
      );

      setPlan(res.data.plan);
      setLoading(false);

    } catch (err) {

      setLoading(false);
      alert("Error generating AI plan");

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


      {/* Goal Card */}
      <div className="bg-white rounded-xl shadow-xl p-8 w-96 mb-6">

        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Create Your Goal
        </h2>

        <input
          className="w-full border p-2 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Goal (Example: Learn Dance / Learn Python)"
          onChange={(e) => setGoalType(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Target (Example: Perform routine)"
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


      {/* Loading */}
      {loading && (
        <div className="text-white text-xl mt-4">
          AI is generating your plan...
        </div>
      )}


      {/* AI Plan */}
      {plan && !loading && (

        <div className="bg-white rounded-xl shadow-xl p-8 w-[650px]">

          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            AI Generated Plan
          </h2>

          <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-line text-gray-700">
            {plan}
          </div>

        </div>

      )}

    </div>

  );

}

export default Dashboard;