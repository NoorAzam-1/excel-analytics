import mongoose from "mongoose";
import UploadHistory from "../models/UploadHistory.js";
import User from "../models/User.js";

export const getStats = async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({ status: "active" });
    const blockedUsers = await User.countDocuments({ status: "blocked" });
    const userCount = await User.countDocuments();
    const historyCount = await UploadHistory.countDocuments();

    const chartTypesAgg = await UploadHistory.aggregate([
      { $group: { _id: "$chartType", count: { $sum: 1 } } },
    ]);

    const chartTypes = {};
    chartTypesAgg.forEach((item) => {
      chartTypes[item._id || "Unknown"] = item.count;
    });

    const mostUsedChart =
      chartTypesAgg.length > 0
        ? chartTypesAgg.reduce((max, curr) =>
            curr.count > max.count ? curr : max
          )._id || "Unknown"
        : "N/A";

    res.json({
           totalUsers: userCount,
      activeUsers,
      blockedUsers,
      totalUploads: historyCount,
      mostUsedChart,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const toggleBlockUser = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "blocked"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();
    res.status(200).json({
      message: `User ${status} successfully`,
      user: { ...user.toObject(), password: undefined },
    });

  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const switchRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    await User.findByIdAndUpdate(userId, { role });
    res.json({ message: `Role updated to ${role}` });
  } catch (err) {
    res.status(500).json({ error: "Role switch failed" });
  }
};
