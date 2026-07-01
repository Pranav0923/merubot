import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Signup() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSignup = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/signup",
        {
          name,
          email,
          password
        }
      )

      setMessage(response.data.message)

      // Redirect to login
      if (response.data.message === "User registered successfully") {

        setTimeout(() => {

          navigate("/login")

        }, 1500)

      }

    } catch (error) {

      console.log(error)

      setMessage("Signup failed")

    }

  }

  return (

    <div className="bg-black min-h-screen flex items-center justify-center text-white">

      <div className="bg-[#111] p-10 rounded-2xl border border-gray-800 w-[400px]">

        <h1 className="text-4xl font-bold text-purple-500 mb-8 text-center">
          Signup
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-4 mb-5 rounded-lg bg-black border border-gray-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 mb-5 rounded-lg bg-black border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 mb-5 rounded-lg bg-black border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-purple-600 p-4 rounded-lg hover:bg-purple-700"
        >
          Create Account
        </button>

        <p className="text-green-400 mt-5 text-center">
          {message}
        </p>

      </div>

    </div>

  )

}

export default Signup