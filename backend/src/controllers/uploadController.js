import UploadHistory from "../models/UploadHistory.js";
export const uploadExcel = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Invalid file format" });

  try {
    const existing = await UploadHistory.findOne({
      fileName: req.file.originalname,
      user: req.user?.id,
    });

    if (existing) {
      return res.status(400).json({ error: "You have already uploaded this file." });
    }

    const history = new UploadHistory({
      fileName: req.file.originalname,
      uploadDate: new Date(),
      user: req.user?.id,
      selectedAxes: { x: "-", y: "-" },
      chartType: "-",
      chartDownloadUrl: "",
    });

    await history.save();

    res.json({
      filename: req.file.filename,
      historyId: history._id,
      message: "File uploaded & saved to history",
    });
  } catch (err) {
    console.error("Error saving upload history:", err);
    res.status(500).json({ error: "Failed to save upload history" });
  }
};



export const updateChartHistory = async (req, res) => {
  try {
    const { fileName, xAxis, yAxis, chartType, chartDownloadUrl } = req.body;

    if (!fileName || !xAxis || !yAxis || !chartType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated = await UploadHistory.findOneAndUpdate(
      { fileName, user: req.user.id },
      {
        selectedAxes: { x: xAxis, y: yAxis },
        chartType,
        chartDownloadUrl,
        uploadDate: new Date(),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Chart info updated in history" ,updated});
  } catch (err) {
    console.error("Error updating chart history:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const uploadAvatar = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = req.file.filename;

    await User.findByIdAndUpdate(req.user.id, {
      avatar: `/uploads/avatars/${fileName}`,
    });

    res.json({ message: "Avatar updated", avatarUrl: `/uploads/avatars/${fileName}` });
  } catch (err) {
    res.status(500).json({ error: "Avatar upload failed" });
  }
};