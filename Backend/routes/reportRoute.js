import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { createReport, getReportById, getReports, upload } from '../controllers/ReportController.js';



const reportRoute = express.Router()

reportRoute.post("/createReport", isAuthenticated,upload.single("image"), createReport);

reportRoute.get("/getReports", isAuthenticated, getReports);


// routes mein add karo
reportRoute.get("/getReport/:id", isAuthenticated, getReportById);





export default reportRoute;