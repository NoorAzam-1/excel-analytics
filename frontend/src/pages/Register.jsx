import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../services/api";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    useremail: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", form);
      toast.success("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="flex items-center justify-center h-full pt-18 pb-7 lg:pb-0 sm:min-h-screen bg-gray-950 text-white">
      <div className="relative z-10 w-full max-w-md p-8 sm:mt-20 bg-gray-900 sm:rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-800">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-white drop-shadow-lg">
          Create an Account
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Join us to unlock powerful analytics
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="username"
            placeholder="username"
            required
            value={form.username}
            onChange={handleChange}
            className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
          />
          <input
            type="email"
            name="useremail"
            placeholder="Email Address"
            required
            value={form.useremail}
            onChange={handleChange}
            className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
          />
          <div className="relative">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-xl appearance-none pr-10 focus:outline-none focus:border-pink-500 transition-colors"
            >
              <option value="user" className="bg-gray-800">
                User
              </option>
              <option value="admin" className="bg-gray-800">
                Admin
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.293 12.95a1 1 0 011.414 0l4-4a1 1 0 01-1.414-1.414L10 10.586 6.707 7.293a1 1 0 01-1.414 1.414l4 4z" />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-pink-700 transition transform hover:-translate-y-1 cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-500 hover:underline cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
