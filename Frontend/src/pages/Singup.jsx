import axios from "axios";
import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword)
      return toast.error("All fields are required");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/user/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (res.data.success) {
        toast.success("Signup Successful 🎉");
        navigate("/verify");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-violet-50 via-white to-purple-50">

      {/* Left Section */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2">
        <h1 className="text-4xl font-bold text-slate-800">Create your account</h1>
        <p className="text-slate-500 mt-3">
          One place for reports, vitals, and AI insights.{" "}
          <span className="text-violet-500 font-medium">Bilkul asaan.</span>
        </p>
        <ul className="mt-6 space-y-3 text-slate-600">
          <li>✔ Upload PDFs & photos of reports</li>
          <li>✔ Track manual vitals with reminders</li>
          <li>✔ Privacy-first encrypted storage</li>
        </ul>
        <div className="mt-8 bg-white p-4 rounded-xl shadow-sm text-sm border border-violet-100">
          <span className="text-violet-500 font-semibold">We respect your privacy</span>
          <p className="text-slate-400 mt-1">HealthMate shares nothing without permission.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex justify-center items-center w-full lg:w-1/2 px-6 py-10">
        <form onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-violet-100">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Sign up</h2>

          {/* Name */}
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3.5 text-violet-400" />
            <input type="text" name="username" value={formData.username}
              onChange={handleChange} placeholder="Full Name"
              className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none text-sm" />
          </div>

          {/* Email */}
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-violet-400" />
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="Email address"
              className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none text-sm" />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <FaLock className="absolute left-3 top-3.5 text-violet-400" />
            <input type={showPassword ? "text" : "password"} name="password"
              value={formData.password} onChange={handleChange} placeholder="Password"
              className="w-full pl-10 pr-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none text-sm" />
            <span onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 cursor-pointer text-violet-400">
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <FaLock className="absolute left-3 top-3.5 text-violet-400" />
            <input type={showConfirm ? "text" : "password"} name="confirmPassword"
              value={formData.confirmPassword} onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none text-sm" />
            <span onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3.5 cursor-pointer text-violet-400">
              {showConfirm ? <HiEyeOff /> : <HiEye />}
            </span>
          </div>

          {/* Terms */}
          <div className="flex items-center mb-6 text-sm text-slate-600">
            <input type="checkbox" className="mr-2 accent-violet-500" required />
            I agree to the{" "}
            <span className="text-violet-500 ml-1 cursor-pointer">Terms & Privacy</span>
          </div>

          {/* Button */}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold bg-linear-to-r from-violet-500 to-purple-500 hover:opacity-90 transition">
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}
              className="text-violet-500 cursor-pointer font-medium">
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;