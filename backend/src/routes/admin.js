import express from "express";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";
import {
  getStats,
  getUsers,
  deleteUser,
  toggleBlockUser,
  switchRole,
} from "../controllers/adminController.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/stats", verifyToken(["admin"]), getStats);
router.get("/users", verifyToken(["admin"]), getUsers);
router.delete("/users/:id", verifyToken(["admin"]), deleteUser);
router.patch("/users/:id/block", verifyToken(["admin"]), toggleBlockUser);
router.get("/admin-only-route", verifyToken(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin Only Area!" });
});
router.patch("/role/:userId", verifyToken(["admin"]), switchRole);

router.put("/settings", verifyToken(["admin"]), async (req, res) => {
  const userId = req.user.id;

  try {
    const { username, useremail } = req.body;

    if (!username || !useremail) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: username, email: useremail },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Admin settings updated", user: updatedUser });
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});



export default router;
