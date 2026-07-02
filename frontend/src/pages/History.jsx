import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/history`);

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-10">
      <h1 className="text-5xl font-bold text-purple-500 mb-10">
        Analysis History
      </h1>

      <div className="space-y-6">
        {history.map((item) => (
          <div
            key={item._id}
            className="bg-[#111] border border-gray-800 p-6 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              {item.candidateName}
            </h2>

            <pre className="whitespace-pre-wrap text-gray-300">
              {item.analysis}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
