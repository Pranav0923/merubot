import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Rankings from "./pages/Rankings";
import Analytics from "./pages/Analytics";
import CandidateProfile from "./pages/CandidateProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/history" element={<History />} />

        <Route path="/rankings" element={<Rankings />} />

        <Route path="/analytics" element={<Analytics />} />

        <Route path="/candidate/:id" element={<CandidateProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
