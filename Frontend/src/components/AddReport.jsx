import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiUpload, FiX } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingNames, setExistingNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "", relation: "", hospital: "", dr: "", date: "",
    price: "", note: "", systolic: "", diastolic: "",
    temp: "", sugar: "", height: "", weight: "",
  });

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("https://ib-healthmate.vercel.app/data/getReports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const seen = new Set();
        const unique = [];
        res.data.data.forEach((r) => {
          const key = r.name?.toLowerCase();
          if (key && !seen.has(key)) {
            seen.add(key);
            unique.push({ name: r.name, relation: r.relation });
          }
        });
        setExistingNames(unique);
      } catch (err) { console.log(err); }
    };
    fetchExisting();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "name") {
      setSuggestions(
        value.trim() === "" ? [] :
        existingNames.filter((m) => m.name.toLowerCase().startsWith(value.toLowerCase()))
      );
    }
  };

  const selectSuggestion = (member) => {
    setFormData({ ...formData, name: member.name, relation: member.relation });
    setSuggestions([]);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile({ file, preview: URL.createObjectURL(file) });
  };

  const removeImage = () => setImageFile(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Member name required");
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const payload = new FormData();
      Object.keys(formData).forEach((key) => payload.append(key, formData[key]));
      if (imageFile) payload.append("image", imageFile.file);
      await axios.post("https://ib-healthmate.vercel.app/data/createReport", payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Report</h1>
          <p className="text-sm text-violet-400 font-medium">Fill in the details below</p>
        </div>
        <button onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 bg-white px-4 py-2 rounded-xl shadow-sm border border-violet-100 transition">
          <FiX size={16} /> Cancel
        </button>
      </div>

      {/* Full width card */}
      <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name + Relation */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="text-sm font-medium text-slate-700">
                Member Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="name" required autoComplete="off"
                value={formData.name} onChange={handleChange}
                className="input" placeholder="e.g., Ahmed" />
              {suggestions.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 bg-white border border-violet-100 rounded-xl shadow-lg mt-1 overflow-hidden">
                  {suggestions.map((m, i) => (
                    <div key={i} onClick={() => selectSuggestion(m)}
                      className="flex justify-between items-center px-4 py-2.5 hover:bg-violet-50 cursor-pointer text-sm">
                      <span className="font-medium text-slate-800">{m.name}</span>
                      <span className="text-xs text-slate-400 bg-violet-50 px-2 py-0.5 rounded-full">
                        {m.relation || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Relation</label>
              <input type="text" name="relation" value={formData.relation}
                onChange={handleChange} className="input" placeholder="e.g., Father, Self" />
            </div>
          </div>

          {/* Hospital / Doctor */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-slate-700">Hospital / Lab <span className="text-red-500">*</span></label>
              <input type="text" name="hospital" required value={formData.hospital}
                onChange={handleChange} className="input" placeholder="e.g., Aga Khan" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Doctor <span className="text-red-500">*</span></label>
              <input type="text" name="dr" required value={formData.dr}
                onChange={handleChange} className="input" placeholder="e.g., Dr. Ahmed" />
            </div>
          </div>

          {/* Date / Price */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="text-sm font-medium text-slate-700">Date</label>
              <input type="date" name="date" value={formData.date}
                onChange={handleChange} className="input pr-10" />
              <FiCalendar className="absolute right-3 top-10 text-violet-400" />
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-slate-700">Price (Rs)</label>
              <input type="number" name="price" value={formData.price}
                onChange={handleChange} className="input pl-8" placeholder="e.g., 3500" />
              <FaRupeeSign className="absolute left-3 top-10 text-violet-400" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-slate-700">Additional Notes <span className="text-red-500">*</span></label>
            <textarea rows="4" name="note" required value={formData.note}
              onChange={handleChange} className="input resize-none"
              placeholder="Symptoms, instructions, etc."></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Report Image</label>
            {!imageFile ? (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-violet-200 rounded-2xl cursor-pointer hover:bg-violet-50 transition">
                <FiUpload size={24} className="text-violet-400 mb-2" />
                <span className="text-sm text-violet-500 font-medium">Click to upload image</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG — Max 5MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden h-52 group">
                <img src={imageFile.preview} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                <button type="button" onClick={removeImage}
                  className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">
                  <FiX size={14} />
                </button>
                <label className="absolute bottom-3 right-3 bg-white text-gray-700 text-xs px-3 py-1.5 rounded-xl cursor-pointer opacity-0 group-hover:opacity-100 transition shadow font-medium">
                  Change
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </label>
              </div>
            )}
          </div>

          {/* Optional Vitals */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Optional: Vitals</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input name="systolic" type="number" value={formData.systolic} onChange={handleChange} placeholder="BP Systolic" className="input" />
              <input name="diastolic" type="number" value={formData.diastolic} onChange={handleChange} placeholder="BP Diastolic" className="input" />
              <input name="temp" type="number" value={formData.temp} onChange={handleChange} placeholder="Temp (°F)" className="input" />
              <input name="sugar" type="number" value={formData.sugar} onChange={handleChange} placeholder="Fasting Sugar" className="input" />
              <input name="height" type="number" value={formData.height} onChange={handleChange} placeholder="Height (cm)" className="input" />
              <input name="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" className="input" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate("/home")}
              className="px-6 py-2.5 rounded-xl border border-violet-200 text-slate-600 hover:bg-violet-50 transition text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-7 py-2.5 rounded-xl shadow-lg hover:scale-105 transition disabled:opacity-50 text-sm font-medium">
              {loading ? "Saving..." : "Save Report"}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        .input { width: 100%; margin-top: 6px; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 12px; outline: none; transition: 0.2s; font-size: 14px; }
        .input:focus { border-color: #8b5cf6; box-shadow: 0 0 0 2px rgba(139,92,246,0.2); }
      `}</style>
    </div>
  );
};

export default AddReport;
