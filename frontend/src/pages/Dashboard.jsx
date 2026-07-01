import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");

  const [resume, setResume] = useState(null);

  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [questions, setQuestions] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [jobMatch, setJobMatch] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [candidates, setCandidates] = useState([]);

  // Protect Route
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

    fetchCandidates();
    fetchHistory();
  }, []);

  // Fetch Candidates
  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/candidates");

      setCandidates(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //  delete candidate
  const handleDeleteCandidate = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/candidate/${id}`);

      fetchCandidates();
    } catch (error) {
      console.log(error);
    }
  };

  // candidate status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/candidate-status/${id}`, {
        status,
      });

      fetchCandidates();
    } catch (error) {
      console.log(error);
    }
  };

  //  fetch history
  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/history");

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Add Candidate
  const handleAddCandidate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/candidate", {
        name,
        email,
        role,
        experience,
      });

      setMessage(response.data.message);

      fetchCandidates();

      setName("");
      setEmail("");
      setRole("");
      setExperience("");
    } catch (error) {
      console.log(error);

      setMessage("Failed to add candidate");
    }
  };

  // Upload Resume
  const handleResumeUpload = async () => {
    try {
      if (!resume) {
        setMessage("Please select a PDF file");

        return;
      }

      const formData = new FormData();

      formData.append("resume", resume);

      const response = await axios.post(
        "http://localhost:5000/api/upload-resume",
        formData,
      );

      setMessage(response.data.message);
    } catch (error) {
      console.log(error);

      setMessage("Resume upload failed");
    }
  };

  // Analyze Resume With AI
  const handleAnalyzeResume = async () => {
    try {
      if (!resume) {
        setMessage("Please select a resume");

        return;
      }

      const formData = new FormData();

      formData.append("resume", resume);

      setMessage("Analyzing resume with AI...");

      const response = await axios.post(
        "http://localhost:5000/api/analyze-resume",
        formData,
      );

      setAnalysis(response.data.analysis);

      setMessage("AI analysis completed");
      fetchHistory();
    } catch (error) {
      console.log(error);

      setMessage("AI analysis failed");
    }
  };

  // download analysis
  const downloadAnalysis = () => {
    window.open("http://localhost:5000/api/download-analysis", "_blank");
  };

  // Matching resume
  const handleJobMatch = async () => {
    try {
      if (!resume) {
        setMessage("Please upload a resume");

        return;
      }

      const formData = new FormData();

      formData.append("resume", resume);

      formData.append("jobDescription", jobDescription);

      setMessage("Matching resume...");

      const response = await axios.post(
        "http://localhost:5000/api/job-match",
        formData,
      );

      setJobMatch(response.data.match);

      setMessage("Job match completed");

      fetchHistory();
    } catch (error) {
      console.log(error);

      setMessage("Job match failed");
    }
  };

  // Generate Interview Questions
  const handleGenerateQuestions = async () => {
    try {
      if (!resume) {
        setMessage("Please select a resume");

        return;
      }

      const formData = new FormData();

      formData.append("resume", resume);

      setMessage("Generating interview questions...");

      const response = await axios.post(
        "http://localhost:5000/api/interview-questions",
        formData,
      );

      setQuestions(response.data.questions);

      setMessage("Interview questions generated");
      fetchHistory();
    } catch (error) {
      console.log(error);

      setMessage("Question generation failed");
    }
  };

  // evlauate answer
  const evaluateAnswer = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/evaluate-answer",
        {
          question: questions,
          answer,
        },
      );

      setFeedback(response.data.feedback);
    } catch (error) {
      console.log(error);
    }
  };

  // download report
  const downloadReport = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/download-report",
        {
          candidateName: name || "Candidate",
          analysis,
        },
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "MeruBot_Report.pdf");

      document.body.appendChild(link);

      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  // Send Interview Email
  const sendInterviewEmail = async (email, name) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/send-interview-email",
        {
          email,
          name,
        },
      );

      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  // save notes
  const saveNotes = async (id, notes) => {
    try {
      await axios.put(
        `http://localhost:5000/api/candidate/${id}/notes`,

        { notes },
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Schedule Interview
  const scheduleInterview = async (id, interviewDate, interviewTime) => {
    try {
      await axios.put(
        `http://localhost:5000/api/candidate/${id}/interview`,

        {
          interviewDate,

          interviewTime,
        },
      );

      alert("Interview Scheduled Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // export excel
  const exportExcel = () => {
    window.open(
      "http://localhost:5000/api/export-excel",

      "_blank",
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="bg-black min-h-screen text-white p-10">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold">Recruiter Dashboard</h1>

        <div className="flex gap-4">
          <button
            onClick={exportExcel}
            className="bg-green-600 px-6 py-3 rounded-xl hover:bg-green-700"
          >
            Export Excel
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-6 py-3 rounded-xl hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Candidate Form */}
      <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-purple-400">
          Add Candidate
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          <input
            type="text"
            placeholder="Candidate Name"
            className="p-4 rounded-lg bg-black border border-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Candidate Email"
            className="p-4 rounded-lg bg-black border border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Job Role"
            className="p-4 rounded-lg bg-black border border-gray-700"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <input
            type="text"
            placeholder="Experience"
            className="p-4 rounded-lg bg-black border border-gray-700"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />

          {/* Resume Upload */}
          <input
            type="file"
            className="p-4 rounded-lg bg-black border border-gray-700"
            onChange={(e) => setResume(e.target.files[0])}
          />
          <textarea
            placeholder="Paste Job Description Here..."
            className="p-4 rounded-lg bg-black border border-gray-700 w-full mt-4"
            rows="6"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6 flex-wrap">
          <button
            onClick={handleAddCandidate}
            className="bg-purple-600 px-8 py-4 rounded-xl hover:bg-purple-700"
          >
            Add Candidate
          </button>

          <button
            onClick={handleResumeUpload}
            className="bg-green-600 px-8 py-4 rounded-xl hover:bg-green-700"
          >
            Upload Resume
          </button>

          <button
            onClick={handleAnalyzeResume}
            className="bg-blue-600 px-8 py-4 rounded-xl hover:bg-blue-700"
          >
            Analyze Resume AI
          </button>

          <button
            onClick={downloadAnalysis}
            className="bg-purple-700 px-8 py-4 rounded-xl hover:bg-purple-800"
          >
            Download Analysis PDF
          </button>

          <button
            onClick={handleJobMatch}
            className="bg-yellow-600 px-8 py-4 rounded-xl hover:bg-yellow-700"
          >
            Match Resume
          </button>

          <button
            onClick={handleGenerateQuestions}
            className="bg-yellow-600 px-8 py-4 rounded-xl hover:bg-yellow-700"
          >
            Generate Interview Questions
          </button>
        </div>

        <p className="text-green-400 mt-4">{message}</p>
      </div>

      {/* AI Analysis Result */}
      {analysis && (
        <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-400">
            AI Resume Analysis
          </h2>

          <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {analysis}
          </pre>
          <button
            onClick={downloadReport}
            className="bg-purple-600 px-6 py-3 rounded-xl mt-6"
          >
            Download PDF Report
          </button>
        </div>
      )}

      {/* Interview Questions */}
      {questions && (
        <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">
            Interview Questions
          </h2>

          <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {questions}
          </pre>

          <textarea
            placeholder="Type your answer here..."
            className="p-4 rounded-lg bg-black border border-gray-700 w-full mt-4"
            rows="5"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            onClick={evaluateAnswer}
            className="bg-green-600 px-6 py-3 rounded-xl mt-4"
          >
            Evaluate Answer
          </button>

          {feedback && (
            <div className="bg-black p-6 rounded-xl mt-6">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                AI Feedback
              </h2>

              <pre className="whitespace-pre-wrap">{feedback}</pre>
            </div>
          )}
        </div>
      )}

      {/* Analysis History */}

      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-8 text-green-400">
          Analysis History
        </h2>

        <div className="grid gap-6">
          {history.map((item) => (
            <div
              key={item._id}
              className="bg-[#111] p-6 rounded-2xl border border-gray-800"
            >
              <p className="text-gray-400 mb-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>

              {item.analysis && (
                <>
                  <h3 className="text-blue-400 font-bold mb-2">
                    Resume Analysis
                  </h3>

                  <pre className="whitespace-pre-wrap">{item.analysis}</pre>
                </>
              )}

              {item.questions && (
                <>
                  <h3 className="text-yellow-400 font-bold mt-4 mb-2">
                    Interview Questions
                  </h3>

                  <pre className="whitespace-pre-wrap">{item.questions}</pre>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* job match */}
      {jobMatch && (
        <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-green-400">
            Job Match Analysis
          </h2>

          <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {jobMatch}
          </pre>
        </div>
      )}

      {/* Candidate List */}
      {/* Candidate List */}
      <div>
        <h2 className="text-4xl font-bold mb-8 text-purple-400">Candidates</h2>

        {/* Search + Filter */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 rounded-lg bg-black border border-gray-700"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-4 rounded-lg bg-black border border-gray-700"
          >
            <option value="All">All</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {candidates
            .filter((candidate) => {
              const matchesSearch = candidate.name
                .toLowerCase()
                .includes(search.toLowerCase());

              const matchesStatus =
                filterStatus === "All" || candidate.status === filterStatus;

              return matchesSearch && matchesStatus;
            })
            .map((candidate) => (
              <div
                key={candidate._id}
                className="bg-[#111] border border-gray-800 p-6 rounded-2xl"
              >
                <h3 className="text-2xl font-bold mb-3">{candidate.name}</h3>

                <p className="text-gray-400 mb-2">{candidate.email}</p>

                <p className="text-purple-400 mb-2">{candidate.role}</p>

                <p className="text-gray-500">{candidate.experience}</p>

                <textarea
                  placeholder="Recruiter Notes..."
                  defaultValue={candidate.notes}
                  onBlur={(e) => saveNotes(candidate._id, e.target.value)}
                  className="mt-3 p-3 rounded-lg bg-black border border-gray-700 w-full"
                  rows="4"
                />

                <input
                  type="date"
                  defaultValue={candidate.interviewDate}
                  id={`date-${candidate._id}`}
                  className="mt-3 p-2 rounded bg-black border border-gray-700 w-full"
                />

                <input
                  type="time"
                  defaultValue={candidate.interviewTime}
                  id={`time-${candidate._id}`}
                  className="mt-3 p-2 rounded bg-black border border-gray-700 w-full"
                />

                <button
                  onClick={() =>
                    scheduleInterview(
                      candidate._id,
                      document.getElementById(`date-${candidate._id}`).value,
                      document.getElementById(`time-${candidate._id}`).value,
                    )
                  }
                  className="mt-3 bg-blue-600 px-4 py-2 rounded-lg w-full hover:bg-blue-700"
                >
                  Schedule Interview
                </button>

                <select
                  value={candidate.status}
                  onChange={(e) =>
                    handleStatusChange(candidate._id, e.target.value)
                  }
                  className="mt-3 p-2 rounded bg-black border border-gray-700 w-full"
                >
                  <option>Applied</option>
                  <option>Shortlisted</option>
                  <option>Interview Scheduled</option>
                  <option>Selected</option>
                  <option>Rejected</option>
                </select>

                <button
                  onClick={() =>
                    sendInterviewEmail(candidate.email, candidate.name)
                  }
                  className="mt-3 bg-green-600 px-4 py-2 rounded-lg w-full hover:bg-green-700"
                >
                  Send Interview Email
                </button>

                <button
                  onClick={() => navigate(`/candidate/${candidate._id}`)}
                  className="mt-3 bg-purple-600 px-4 py-2 rounded-lg w-full hover:bg-purple-700"
                >
                  View Profile
                </button>

                <button
                  onClick={() => handleDeleteCandidate(candidate._id)}
                  className="mt-3 bg-red-600 px-4 py-2 rounded-lg w-full hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
