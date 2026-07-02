import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

function Analytics() {
  const [stats, setStats] = useState({});

  const data = [
    {
      name: "Applied",
      value: stats.applied || 0,
    },
    {
      name: "Shortlisted",
      value: stats.shortlisted || 0,
    },
    {
      name: "Interview",
      value: stats.interviewScheduled || 0,
    },
    {
      name: "Selected",
      value: stats.selected || 0,
    },
    {
      name: "Rejected",
      value: stats.rejected || 0,
    },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const response = await axios.get(`${API_URL}/api/stats`);

    setStats(response.data);
  };

  return (
    <div className="bg-black min-h-screen text-white p-10">
      <h1 className="text-5xl font-bold text-purple-400 mb-10">
        Analytics Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#111] p-6 rounded-xl">
          <h2>Total Candidates</h2>
          <p className="text-4xl">{stats.totalCandidates}</p>
        </div>

        <div className="bg-[#111] p-6 rounded-xl">
          <h2>Applied</h2>
          <p className="text-4xl">{stats.applied}</p>
        </div>

        <div className="bg-[#111] p-6 rounded-xl">
          <h2>Shortlisted</h2>
          <p className="text-4xl">{stats.shortlisted}</p>
        </div>

        <div className="bg-[#111] p-6 rounded-xl">
          <h2>Interview Scheduled</h2>
          <p className="text-4xl">{stats.interviewScheduled}</p>
        </div>

        <div className="bg-[#111] p-6 rounded-xl">
          <h2>Selected</h2>
          <p className="text-4xl">{stats.selected}</p>
        </div>

        <div className="bg-[#111] p-6 rounded-xl">
          <h2>Rejected</h2>
          <p className="text-4xl">{stats.rejected}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="mt-12 flex justify-center">
        <PieChart width={500} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label
          >
            <Cell fill="#8b5cf6" />
            <Cell fill="#22c55e" />
            <Cell fill="#3b82f6" />
            <Cell fill="#f59e0b" />
            <Cell fill="#ef4444" />
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}

export default Analytics;
