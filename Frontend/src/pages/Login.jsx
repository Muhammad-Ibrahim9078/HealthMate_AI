import axios from "axios";
import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getData } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = getData();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error("All fields are required");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/user/login", formData);
      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.accessToken);
        setUser(res.data.user);
        toast.success("Login Successful 🎉");
        navigate("/home");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-violet-50 via-white to-purple-50">

      {/* Left Info Section */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2">
        <h1 className="text-4xl font-bold text-slate-800">Welcome back 👋</h1>
        <p className="text-slate-500 mt-3">
          Login to manage your reports, vitals and AI insights easily.
        </p>
        <ul className="mt-6 space-y-3 text-slate-600">
          <li>✔ Access your health timeline</li>
          <li>✔ View AI report explanations</li>
          <li>✔ Secure & private dashboard</li>
        </ul>
        <div className="mt-8 bg-white p-4 rounded-xl shadow-sm text-sm text-slate-600 border border-violet-100">
          <span className="text-violet-500 font-semibold">Your data is safe</span>
          <p className="text-slate-400 mt-1">Encrypted storage with full privacy control.</p>
        </div>
      </div>

      {/* Right Login Card */}
      <div className="flex justify-center items-center w-full lg:w-1/2 px-6 py-10">
        <form onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-violet-100">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Sign in</h2>

          {/* Email */}
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-violet-400" />
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="Email address"
              className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none text-sm" />
          </div>

          {/* Password */}
          <div className="mb-2 relative">
            <FaLock className="absolute left-3 top-3.5 text-violet-400" />
            <input type={showPassword ? "text" : "password"} name="password"
              value={formData.password} onChange={handleChange} placeholder="Password"
              className="w-full pl-10 pr-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none text-sm" />
            <span onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 cursor-pointer text-violet-400">
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <span onClick={() => navigate("/forgot-password")}
              className="text-violet-500 text-sm cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>

          {/* Button */}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 transition">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}
              className="text-violet-500 cursor-pointer font-medium">
              Create account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;