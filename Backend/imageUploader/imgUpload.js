// import { Report } from "../models/ReportModel.js";
// import { uploadToCloudinary } from "../middleware/uploadMiddleware.js"; // ✅ import karo

// // Create Report
// export const createReport = async (req, res) => {
//     try {
//         const {
//             name, relation,
//             hospital, dr, date, price, note,
//             systolic, diastolic, temp, sugar,
//             height, weight
//         } = req.body;

//         // ✅ Agar image upload hui hai toh Cloudinary pe bhejo
//         let imageUrl = "";
//         if (req.file) {
//             const result = await uploadToCloudinary(req.file.buffer);
//             imageUrl = result.secure_url;
//         }

//         const report = await Report.create({
//             name,
//             relation: relation || "Self",
//             user: req.user._id,
//             hospital, dr, date, price, note,
//             systolic, diastolic, temp, sugar,
//             height, weight,
//             imageUrl  // ✅ cloudinary URL save
//         });

//         res.status(201).json({
//             success: true,
//             message: "Report Created Successfully",
//             data: report
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Get All Reports
// export const getReports = async (req, res) => {
//     try {
//         const { name, relation } = req.query;
//         const filter = { user: req.user._id };

//         if (name) filter.name = { $regex: name, $options: "i" };
//         if (relation) filter.relation = { $regex: relation, $options: "i" };

//         const reports = await Report.find(filter).sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             total: reports.length,
//             data: reports
//         });

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Get Single Report by ID
// export const getReportById = async (req, res) => {
//     try {
//         const report = await Report.findOne({
//             _id: req.params.id,
//             user: req.user._id
//         });

//         if (!report) return res.status(404).json({ success: false, message: "Report not found" });

//         res.status(200).json({ success: true, data: report });

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };