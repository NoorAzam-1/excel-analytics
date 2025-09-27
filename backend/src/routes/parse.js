import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js ";
import { parseExcel } from "../controllers/parseController.js";

const router = express.Router();

router.get("/parse/:filename", verifyToken(), parseExcel);

export default router;
