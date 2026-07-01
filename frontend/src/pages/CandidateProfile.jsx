import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    fetchCandidate();
  }, []);

  const fetchCandidate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/candidate/${id}`,
      );

      setCandidate(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!candidate) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700 mb-8"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-5xl font-bold text-purple-400 mb-8">
        Candidate Profile
      </h1>

      <div className="bg-[#111] p-8 rounded-xl space-y-4">
        <p>
          <strong>Name:</strong> {candidate.name}
        </p>

        <p>
          <strong>Email:</strong> {candidate.email}
        </p>

        <p>
          <strong>Role:</strong> {candidate.role}
        </p>

        <p>
          <strong>Experience:</strong> {candidate.experience}
        </p>

        <p>
          <strong>Status:</strong> {candidate.status}
        </p>

        <p>
          <strong>Interview Date:</strong>{" "}
          {candidate.interviewDate || "Not Scheduled"}
        </p>

        <p>
          <strong>Interview Time:</strong>{" "}
          {candidate.interviewTime || "Not Scheduled"}
        </p>

        <p>
          <strong>Notes:</strong>
        </p>

        <div className="bg-black p-4 rounded-lg border border-gray-700">
          {candidate.notes || "No notes"}
        </div>

        <p className="mt-6">
          <strong>Resume:</strong>
        </p>

        {candidate.resume ? (
          <a
            href={`http://localhost:5000/uploads/${candidate.resume}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-2 bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            📄 View Resume
          </a>
        ) : (
          <p className="text-gray-400 mt-2">No Resume Uploaded</p>
        )}
      </div>
    </div>
  );
}

export default CandidateProfile;
