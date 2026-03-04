import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiX, FiEye, FiZap } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [analysisModal, setAnalysisModal] = useState(null);
  const [aiModal, setAiModal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const single = await axios.get(`http://localhost:8000/data/getReport/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentReport = single.data.data;
        setReport(currentReport);

        const res = await axios.get(
          `http://localhost:8000/data/getReports?name=${currentReport.name}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data.data;
        setAllReports(data);

        setVitals(data.map((r) => ({
          date: new Date(r.date).toLocaleDateString(),
          systolic: Number(r.systolic) || 0,
          diastolic: Number(r.diastolic) || 0,
          sugar: Number(r.sugar) || 0,
        })));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const openModal = (r) => { setSelectedReport(r); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelectedReport(null); };

  if (!report) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 flex items-center justify-center">
      <div className="text-violet-400 font-medium">Loading...</div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-slate-50 to-violet-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{report.name}</h1>
          <p className="text-violet-400 font-medium">{report.relation}</p>
        </div>
        <button onClick={() => navigate("/home")}
          className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition">
          ← Back
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100">
        <h2 className="mb-4 font-semibold text-slate-700">Vitals Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={vitals}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="systolic" stroke="#8b5cf6" strokeWidth={2} />
            <Line type="monotone" dataKey="diastolic" stroke="#a855f7" strokeWidth={2} />
            <Line type="monotone" dataKey="sugar" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reports Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100">
        <h2 className="mb-4 font-semibold text-slate-700">Reports</h2>
        <table className="w-full text-sm">
          <thead className="text-left border-b bg-violet-50">
            <tr>
              <th className="py-3 px-3 text-violet-600 font-semibold">Hospital</th>
              <th className="px-3 text-violet-600 font-semibold">Doctor</th>
              <th className="px-3 text-violet-600 font-semibold">Date</th>
              <th className="px-3 text-violet-600 font-semibold">Price</th>
              <th className="px-3 text-violet-600 font-semibold">Image</th>
              <th className="px-3 text-violet-600 font-semibold">Actions</th>
              <th className="px-3 text-violet-600 font-semibold pr-5">Ai Res</th>
            </tr>
          </thead>
          <tbody>
            {allReports.map((r) => (
              <tr key={r._id} className="border-b hover:bg-violet-50/50 transition">
                <td className="py-3 px-3 text-slate-700">{r.hospital}</td>
                <td className="px-3 text-slate-600">{r.dr}</td>
                <td className="px-3 text-slate-600">{new Date(r.date).toLocaleDateString()}</td>
                <td className="px-3 text-slate-600">Rs {r.price}</td>

                <td className="px-3">
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt=""
                      onClick={() => setLightboxImg(r.imageUrl)}
                      className="w-9 h-9 rounded-lg object-cover cursor-pointer hover:scale-110 transition border-2 border-violet-100" />
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>

                <td className="px-3">
                  <button onClick={() => openModal(r)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-50 text-violet-500 hover:bg-violet-100 transition">
                    <FiEye size={15} />
                  </button>
                </td>

                <td className="px-3 pr-5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setAiModal(r)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-50 text-violet-500 hover:bg-violet-100 transition">
                      <FaRobot size={15} />
                    </button>
                    {r.analysis && (
                      <button onClick={() => setAnalysisModal(r)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-500 hover:bg-purple-100 transition"
                        title="AI Analysis">
                        <FiZap size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Detail Modal */}
      {modalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-violet-50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Report Details</h2>
                <p className="text-sm text-violet-400">
                  {new Date(selectedReport.date).toLocaleDateString("en-PK", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              </div>
              <button onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-violet-50 transition">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 bg-violet-50 rounded-2xl p-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedReport.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{selectedReport.name}</p>
                  <p className="text-sm text-violet-400">{selectedReport.relation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Hospital</p>
                  <p className="font-medium text-slate-800 text-sm">{selectedReport.hospital}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Doctor</p>
                  <p className="font-medium text-slate-800 text-sm">{selectedReport.dr}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Price</p>
                  <p className="font-medium text-slate-800 text-sm">Rs {selectedReport.price || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Date</p>
                  <p className="font-medium text-slate-800 text-sm">{new Date(selectedReport.date).toLocaleDateString()}</p>
                </div>
              </div>

              {(selectedReport.systolic || selectedReport.temp || selectedReport.sugar || selectedReport.height || selectedReport.weight) && (
                <div>
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Vitals</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedReport.systolic && (
                      <div className="bg-violet-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">BP</p>
                        <p className="font-semibold text-violet-600 text-sm">{selectedReport.systolic}/{selectedReport.diastolic}</p>
                      </div>
                    )}
                    {selectedReport.temp && (
                      <div className="bg-orange-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">Temp</p>
                        <p className="font-semibold text-orange-500 text-sm">{selectedReport.temp}°F</p>
                      </div>
                    )}
                    {selectedReport.sugar && (
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">Sugar</p>
                        <p className="font-semibold text-green-600 text-sm">{selectedReport.sugar}</p>
                      </div>
                    )}
                    {selectedReport.height && (
                      <div className="bg-purple-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">Height</p>
                        <p className="font-semibold text-purple-600 text-sm">{selectedReport.height} cm</p>
                      </div>
                    )}
                    {selectedReport.weight && (
                      <div className="bg-indigo-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">Weight</p>
                        <p className="font-semibold text-indigo-600 text-sm">{selectedReport.weight} kg</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedReport.note && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Notes</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedReport.note}</p>
                </div>
              )}

              {selectedReport.imageUrl && (
                <div>
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Report Image</p>
                  <img src={selectedReport.imageUrl} alt=""
                    onClick={() => setLightboxImg(selectedReport.imageUrl)}
                    className="w-full h-52 object-cover rounded-2xl cursor-pointer hover:opacity-90 transition border border-violet-100" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Res Modal */}
      {aiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative">
            <div className="flex justify-between items-center p-6 border-b border-violet-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                  <FaRobot size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">AI Response</h2>
                  <p className="text-xs text-violet-400">{aiModal.hospital} — {new Date(aiModal.date).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => setAiModal(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-violet-50 transition">
                <FiX size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 border border-violet-100">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {aiModal.analysis || "No analysis available."}
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                ⚠️ AI response is for reference only. Consult your doctor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {analysisModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative">
            <div className="flex justify-between items-center p-6 border-b border-violet-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                  <FiZap size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">AI Analysis</h2>
                  <p className="text-xs text-violet-400">{analysisModal.hospital} — {new Date(analysisModal.date).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => setAnalysisModal(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-violet-50 transition">
                <FiX size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 border border-violet-100">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {analysisModal.analysis}
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                ⚠️ AI analysis is for reference only. Consult your doctor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[60] p-4"
          onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt=""
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" />
          <button onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition">
            <FiX size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;