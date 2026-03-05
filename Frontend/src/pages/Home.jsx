import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("https://ib-healthmate.vercel.app/data/getReports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const grouped = {};
        res.data.data.forEach((report) => {
          const key = `${report.name?.toLowerCase()}_${report.relation?.toLowerCase()}`;
          if (!grouped[key]) {
            grouped[key] = {
              name: report.name,
              relation: report.relation,
              latestReportId: report._id,
              latestDate: report.updatedAt,
              totalReports: 1
            };
          } else {
            grouped[key].totalReports += 1;
            if (new Date(report.updatedAt) > new Date(grouped[key].latestDate)) {
              grouped[key].latestDate = report.updatedAt;
              grouped[key].latestReportId = report._id;
            }
          }
        });

        setMembers(Object.values(grouped));
      } catch (error) {
        console.log("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 p-8">

      <Navbar />

      {/* Header */}
      <div className="flex justify-between items-center mt-5  mb-8">
        <div>
          {/* <h1 className="text-2xl font-bold text-slate-800">HealthMate</h1>
          <p className="text-sm text-violet-400 font-medium">Sehat ka Smart Dost</p> */}
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          onClick={() => navigate("/add-report")}
        >
          <FiPlus /> Add Report
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-violet-100 p-5 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {member.name?.charAt(0) || "?"}
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>Last activity</p>
                <p className="font-medium text-slate-700">
                  {new Date(member.latestDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-slate-800">{member.name}</h2>
            <p className="text-sm text-slate-500">{member.relation || "-"}</p>

            <p className="text-xs text-violet-500 font-medium mt-1 mb-4">
              {member.totalReports} Report{member.totalReports > 1 ? "s" : ""}
            </p>

            {/* Buttons */}
            <div className="flex gap-2 flex-wrap items-center">
              {/* <button className="flex items-center gap-1 px-3 py-1 text-sm border rounded-lg text-violet-500 border-violet-200 hover:bg-violet-50 transition">
                <FiEdit size={14} /> Edit
              </button>
              <button className="flex items-center gap-1 px-3 py-1 text-sm border rounded-lg text-red-400 border-red-200 hover:bg-red-50 transition">
                <FiTrash2 size={14} /> Delete
              </button> */}
              <button
                onClick={() => navigate(`/dashboard/${member.latestReportId}`)}
                className="mt-4 text-violet-600 font-medium flex items-center gap-1 hover:text-orange-600 transition"
              >
                <FiEye /> Open
              </button>
            </div>
          </div>
        ))}

        {/* Add Report Card */}
        <div
          className="border-2 border-dashed border-violet-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:bg-violet-50 cursor-pointer transition"
          onClick={() => navigate("/add-report")}
        >
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-500 mb-3">
            <FiPlus size={20} />
          </div>
          <p className="text-violet-600 font-medium">Add Report</p>
          <p className="text-xs text-gray-400">Create a new report</p>
        </div>
      </div>
    </div>
  );
};

export default Home;