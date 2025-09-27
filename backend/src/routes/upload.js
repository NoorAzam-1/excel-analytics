import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../middleware/authMiddleware.js';
import { updateChartHistory, uploadAvatar, uploadExcel } from '../controllers/uploadController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.xls', '.xlsx'];
  const ext = path.extname(file.originalname);
  cb(null, allowed.includes(ext));
};

const upload = multer({ storage, fileFilter 
 });

router.post('/excel', verifyToken(['user', 'admin']), upload.single('file'), uploadExcel);
router.post('/updateChartHistory', verifyToken(), updateChartHistory);
router.post("/avatar", verifyToken(["user", "admin"]), upload.single("avatar"), uploadAvatar);
export default router;
