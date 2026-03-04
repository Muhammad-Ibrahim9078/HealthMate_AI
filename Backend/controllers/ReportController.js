import { Report } from "../models/ReportModel.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

cloudinary.config({
    cloud_name: "df92wfbox",
    api_key: "586129174562144",
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    },
});

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "reports" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};









// ✅ Create Report
export const createReport = async (req, res) => {
    try {
        const {
            name, relation, hospital, dr, date, price, note,
            systolic, diastolic, temp, sugar, height, weight
        } = req.body;

        const imageBuffer = req.file ? req.file.buffer : null;
        const imageMimeType = req.file ? req.file.mimetype : null;

        let imageUrl = "";
        if (imageBuffer) {
            const result = await uploadToCloudinary(imageBuffer);
            imageUrl = result.secure_url;
        }

        let analysis = "";
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const textPart = {
                text: `
You are a medical assistant. Carefully analyze the attached medical report image and the patient vitals below.
Read all text, numbers, and test results visible in the image.
Then give a clear health summary in 4-5 lines in simple English.

Patient: ${name} (${relation || "Self"})
Hospital: ${hospital || "N/A"}
Doctor: ${dr || "N/A"}
Notes: ${note || "N/A"}
${systolic ? `Blood Pressure: ${systolic}/${diastolic} mmHg` : ""}
${temp ? `Temperature: ${temp}°F` : ""}
${sugar ? `Blood Sugar: ${sugar} mg/dL` : ""}
${height ? `Height: ${height} cm` : ""}
${weight ? `Weight: ${weight} kg` : ""}

Include findings from both the image and the vitals above. Keep it simple and clear.
                `.trim()
            };

            let result;
            if (imageBuffer) {
                const imagePart = { inlineData: { mimeType: imageMimeType, data: imageBuffer.toString("base64") } };
                result = await model.generateContent({ contents: [{ role: "user", parts: [imagePart, textPart] }] });
            } else {
                result = await model.generateContent({ contents: [{ role: "user", parts: [textPart] }] });
            }
            analysis = result.response.text();
            console.log("✅ Gemini analysis done:", analysis.slice(0, 100));
        } catch (geminiError) {
            console.log("❌ Gemini error:", geminiError.message);
        }

        const report = await Report.create({
            name, relation: relation || "Self", user: req.user._id,
            hospital, dr, date, price, note,
            systolic, diastolic, temp, sugar, height, weight,
            imageUrl, analysis,
        });

        res.status(201).json({ success: true, message: "Report Created Successfully", data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};






// ✅ Get All Reports
export const getReports = async (req, res) => {
    try {
        const { name, relation } = req.query;
        const filter = { user: req.user._id };
        if (name) filter.name = { $regex: name, $options: "i" };
        if (relation) filter.relation = { $regex: relation, $options: "i" };
        const reports = await Report.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, total: reports.length, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};







// ✅ Get Single Report by ID
export const getReportById = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};









// ✅ Update Report
export const updateReport = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });

        const {
            hospital, dr, date, price, note,
            systolic, diastolic, temp, sugar, height, weight
        } = req.body;

        // ✅ Nai image aayi toh purani delete karo aur nai upload karo
        let imageUrl = report.imageUrl;
        let imageBuffer = null;
        let imageMimeType = null;

        if (req.file) {
            if (report.imageUrl) {
                try {
                    const urlParts = report.imageUrl.split("/");
                    const fileName = urlParts[urlParts.length - 1].split(".")[0];
                    await cloudinary.uploader.destroy(`reports/${fileName}`);
                } catch (e) {
                    console.log("⚠️ Old image delete error:", e.message);
                }
            }
            imageBuffer = req.file.buffer;
            imageMimeType = req.file.mimetype;
            const result = await uploadToCloudinary(imageBuffer);
            imageUrl = result.secure_url;
        }

        // ✅ Nai Gemini analysis generate karo
        let analysis = report.analysis; // purani analysis default
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const textPart = {
                text: `
You are a medical assistant. Carefully analyze the patient vitals and medical report image if available.
Then give a clear health summary in 4-5 lines in simple English.

Patient: ${report.name} (${report.relation || "Self"})
Hospital: ${hospital || "N/A"}
Doctor: ${dr || "N/A"}
Notes: ${note || "N/A"}
${systolic ? `Blood Pressure: ${systolic}/${diastolic} mmHg` : ""}
${temp ? `Temperature: ${temp}°F` : ""}
${sugar ? `Blood Sugar: ${sugar} mg/dL` : ""}
${height ? `Height: ${height} cm` : ""}
${weight ? `Weight: ${weight} kg` : ""}

Include findings from both the image and the vitals above. Keep it simple and clear.
                `.trim()
            };

            let result;
            if (imageBuffer) {
                // ✅ Nai image aayi — image + text dono bhejo
                const imagePart = { inlineData: { mimeType: imageMimeType, data: imageBuffer.toString("base64") } };
                result = await model.generateContent({ contents: [{ role: "user", parts: [imagePart, textPart] }] });
            } else {
                // ✅ Sirf text — purani image ya koi image nahi
                result = await model.generateContent({ contents: [{ role: "user", parts: [textPart] }] });
            }

            analysis = result.response.text();
            console.log("✅ Gemini re-analysis done:", analysis.slice(0, 100));

        } catch (geminiError) {
            console.log("❌ Gemini error:", geminiError.message);
            // fail ho toh purani analysis rehti hai
        }

        const updated = await Report.findByIdAndUpdate(
            req.params.id,
            { hospital, dr, date, price, note, systolic, diastolic, temp, sugar, height, weight, imageUrl, analysis },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Report updated successfully", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};










// ✅ Delete Report
export const deleteReport = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });

        if (report.imageUrl) {
            try {
                const urlParts = report.imageUrl.split("/");
                const fileName = urlParts[urlParts.length - 1].split(".")[0];
                await cloudinary.uploader.destroy(`reports/${fileName}`);
                console.log("✅ Cloudinary image deleted");
            } catch (cloudErr) {
                console.log("⚠️ Cloudinary delete error:", cloudErr.message);
            }
        }

        await Report.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Report deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};







