import { useEffect, useState } from "react"

function Home() {

  const [message, setMessage] = useState("")

  useEffect(() => {

    fetch("http://localhost:5000/api/message")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message)
      })

  }, [])

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-700 rounded-full blur-[150px] opacity-20"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-800 relative z-10">

        <h1 className="text-3xl font-bold text-purple-500">
          MeruBot
        </h1>

        <div className="hidden md:flex gap-8 text-lg text-gray-300">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>

        <button className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700 transition">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-28 px-6 relative z-10">

        <p className="text-purple-400 font-semibold uppercase tracking-widest">
          AI Powered Recruitment Platform
        </p>

        <h1 className="text-6xl md:text-7xl font-bold leading-tight max-w-5xl mt-6">
          AI Conducts Better Interviews.
          <span className="text-purple-500"> Better Hires.</span>
        </h1>

        <p className="text-gray-400 text-xl mt-8 max-w-3xl leading-relaxed">
          MeruBot automates interviews using AI,
          helping companies hire faster,
          reduce bias, and scale recruitment effortlessly.
        </p>

        {/* Backend Message */}
        <p className="text-green-400 mt-6 text-lg">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-6 mt-10 flex-wrap justify-center">

          <button className="bg-purple-600 px-8 py-4 rounded-xl text-lg hover:bg-purple-700 transition shadow-lg shadow-purple-700/30">
            Start Hiring
          </button>

          <button className="border border-gray-700 px-8 py-4 rounded-xl text-lg hover:bg-gray-900 transition">
            Watch Demo
          </button>

        </div>

      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-8 px-10 mt-32 pb-20 relative z-10">

        <div className="bg-[#111] border border-gray-800 p-8 rounded-2xl hover:border-purple-500 transition">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            AI Interviews
          </h2>

          <p className="text-gray-400">
            Conduct smart AI-powered interviews
            with dynamic questions and evaluation.
          </p>
        </div>

        <div className="bg-[#111] border border-gray-800 p-8 rounded-2xl hover:border-purple-500 transition">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Resume Analysis
          </h2>

          <p className="text-gray-400">
            Automatically analyze resumes,
            skills, and candidate-job matching.
          </p>
        </div>

        <div className="bg-[#111] border border-gray-800 p-8 rounded-2xl hover:border-purple-500 transition">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Hiring Reports
          </h2>

          <p className="text-gray-400">
            Generate detailed AI reports,
            candidate scores, and recommendations.
          </p>
        </div>

      </section>

    </div>
  )
}

export default Home