import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../services/api";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      localStorage.setItem(
        "user",
        JSON.stringify({ role: data.role, username: data.username })
      );

      navigate(data.role === "admin" ? "/dashboard" : "/dashboard");
      toast.success("Loggin successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-800">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-white drop-shadow-lg">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Sign in to your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-pink-700 transition transform hover:-translate-y-1"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-pink-500 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
