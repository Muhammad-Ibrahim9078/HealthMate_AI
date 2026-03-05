import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getData } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = getData();
  const dropdownRef = useRef(null);
  const accessToken = localStorage.getItem("accessToken");

  // ✅ localStorage se user restore karo agar context mein nahi
  const savedUser = user || JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "https://ib-healthmate.vercel.app/user/logout",
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        setUser(null);
        localStorage.clear();
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // ✅ Sirf tab skeleton dikhao jab token bhi nahi aur user bhi nahi
  if (!savedUser && !accessToken) {
    return (
      <nav className="w-full bg-white border-b border-violet-100 shadow-sm">
        <div className="mx-auto px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-violet-500 p-2 rounded-full text-white">
              <FaHeart size={14} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">HealthMate</h1>
          </div>
          <div className="w-9 h-9 bg-violet-100 rounded-full animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white border-b border-violet-100 shadow-sm">
      <div className="mx-auto px-8 py-3 flex items-center justify-between">

        {/* Logo */}
        <div onClick={() => navigate("/home")}
          className="flex items-center gap-2 cursor-pointer">
          <div className="bg-linear-to-r from-violet-500 to-purple-500 p-2 rounded-full text-white">
            <FaHeart size={14} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">HealthMate</h1>
            <p className="text-xs text-violet-400 -mt-1">Sehat ka Smart Dost</p>
          </div>
        </div>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>

          <button onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 px-3 py-2 rounded-xl transition">
            {savedUser?.profilePic ? (
              <img src={savedUser.profilePic} alt="user"
                className="w-8 h-8 rounded-full object-cover border-2 border-violet-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {savedUser?.username?.charAt(0)?.toUpperCase() || savedUser?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">
                {savedUser?.fullName || savedUser?.username || "User"}
              </p>
              <p className="text-xs text-violet-400 mt-0.5">{savedUser?.email}</p>
            </div>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-violet-100 z-50 overflow-hidden">

              <div className="px-4 py-4 bg-linear-to-r from-violet-50 to-purple-50 border-b border-violet-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {savedUser?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {savedUser?.fullName || savedUser?.username || "User"}
                    </p>
                    <p className="text-xs text-violet-400">{savedUser?.email}</p>
                  </div>
                </div>
              </div>

              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition">
                <FaSignOutAlt size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;