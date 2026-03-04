import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { createReport, deleteReport, getReportById, getReports, updateReport, upload } from '../controllers/ReportController.js';



const reportRoute = express.Router()

reportRoute.post("/createReport", isAuthenticated,upload.single("image"), createReport);

reportRoute.get("/getReports", isAuthenticated, getReports);

reportRoute.delete("/deleteReport/:id", isAuthenticated, deleteReport);

reportRoute.put("/updateReport/:id", isAuthenticated, upload.single("image"), updateReport);


// routes mein add karo
reportRoute.get("/getReport/:id", isAuthenticated, getReportById);





export default reportRoute;