import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });

      setMessage(response.data.message);

      // Save token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Redirect dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);

      setMessage("Login failed");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white">
      <div className="bg-[#111] p-10 rounded-2xl border border-gray-800 w-[400px]">
        <h1 className="text-4xl font-bold text-purple-500 mb-8 text-center">
          Login
        </h1>

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
          onClick={handleLogin}
          className="w-full bg-purple-600 p-4 rounded-lg hover:bg-purple-700"
        >
          Login
        </button>

        <p className="text-green-400 mt-5 text-center">{message}</p>
      </div>
    </div>
  );
}

export default Login;
