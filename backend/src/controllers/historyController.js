import UploadHistory from "../models/UploadHistory.js";
import path from "path";
import mongoose from "mongoose";

export const getUserUploads = async (req, res) => {
  try {
    const uploads = await UploadHistory.find({ user: req.user.id })
      .populate("user", "username useremail")
      .sort({ uploadDate: -1 });

    res.json(uploads);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

export const getUploadsByUserId = async (req, res) => {
  try {
    const targetUserId = req.params.userId || req.user.id;

    if (req.user.role !== "admin" && targetUserId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const uploads = await UploadHistory.find({ user: targetUserId }).sort({
      uploadDate: -1,
    });

    res.json(uploads);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

export const downloadFile = (req, res) => {
  const filePath = path.join("uploads", req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(404).json({ error: "File not found" });
    }
  });
};

export const getStats = async (req, res) => {
  try {
    const stats = await UploadHistory.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: "$chartType", count: { $sum: 1 } } },
    ]);

    res.json({ chartStats: stats });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const history = await UploadHistory.findById(req.params.id).populate(
      "user",
      "username useremail"
    );

    if (!history) {
      return res.status(404).json({ error: "History not found" });
    }

    if (req.user.role !== "admin" && history.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteHistoryById = async (req, res) => {
  try {
    const history = await UploadHistory.findById(req.params.id);

    if (!history) {
      return res.status(404).json({ error: "Upload not found" });
    }

    if (req.user.role !== "admin" && history.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await UploadHistory.findByIdAndDelete(req.params.id);
    res.json({ message: "Upload history deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllUploads = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const uploads = await UploadHistory.find()
      .populate("user", "username useremail")
      .sort({ uploadDate: -1 });

    res.json(uploads);
  } catch (err) {
    console.error("Error fetching all uploads:", err);
    res.status(500).json({ error: "Failed to fetch all uploads" });
  }
};