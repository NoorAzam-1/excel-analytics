import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserUploads,
  getUploadsByUserId,
  downloadFile,
  getStats,
  getHistoryById,
  deleteHistoryById,
  getAllUploads,
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/", verifyToken(["user", "admin"]), getUserUploads);
router.get("/user/:userId?", verifyToken(["user", "admin"]), getUploadsByUserId);
router.get("/download/:filename", verifyToken(["user", "admin"]), downloadFile);
router.get("/stats", verifyToken(["user", "admin"]), getStats);
router.get("/details/:id", verifyToken(["user", "admin"]), getHistoryById);
router.delete("/:id", verifyToken(["user", "admin"]), deleteHistoryById);
router.get("/all",verifyToken(["admin"]) , getAllUploads);
export default router;
