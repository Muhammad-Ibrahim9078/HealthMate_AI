import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";

const VerifyOtp = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // OTP validation
    if (otp.length !== 6) {
      setError("Please enter valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      // API call to verify OTP
      const response = await axios.post(
        `https://sage-speculoos-e806f3.netlify.app/user/verify-otp/${email}`,
        { otp, email } // Sending OTP in request body
      );

      console.log("OTP Verification Response:", response.data);

      // Check if verification successful
      if (response.data.success || response.status === 200) {
        // Navigate to change password page with email
        navigate(`/change-password/${email}`);
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 400) {
          setError("Invalid OTP. Please check and try again.");
        } else if (error.response.status === 404) {
          setError("User not found. Please try again.");
        } else {
          setError(error.response.data.message || "OTP verification failed. Please try again.");
        }
      } else if (error.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection.");
      } else {
        // Something else happened
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        
        {/* Heading */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3 text-indigo-600 text-4xl">
            <FaLock />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            <FaEnvelope className="text-indigo-500" />
            {decodeURIComponent(email)} {/* Decoding email if it's URL encoded */}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center tracking-widest text-lg"
              placeholder="------"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;