import React, { useEffect, useRef, useState } from "react";
import {
  FaUserCircle,
  FaUser,
  FaStickyNote,
  FaSignOutAlt,
} from "react-icons/fa";
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

  // ✅ click outside close
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
        "http://localhost:8000/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
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

  // 🔹 loading skeleton
  if (!user) {
    return (
      <nav className="w-full bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between">
          <h1 className="text-xl font-bold text-emerald-600">NotesApp</h1>
          <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">📘</span>
          <h1 className="text-xl font-bold text-emerald-600">NotesApp</h1>
        </div>
        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          {/* icon */}
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="cursor-pointer"
          >
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="user"
                className="w-9 h-9 rounded-full object-cover border"
              />
            ) : (
              <FaUserCircle size={34} className="text-emerald-600" />
            )}
          </div>
          <p className="font-bold">Profile</p>

          {/* dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
              {/* header */}
              <div className="px-4 py-3 border-b bg-gray-50">
                <p className="text-sm font-semibold">
                  {user?.fullName || user?.username || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* items */}
              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FaUser size={14} />
                Profile
              </button>

              <button
                onClick={() => {
                  navigate("/notes");
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FaStickyNote size={14} />
                My Notes
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t"
              >
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