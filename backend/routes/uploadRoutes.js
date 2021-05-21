import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleWare.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname)).toLowerCase();
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images Only');
  }
}

export const upload = multer({
  storage,
  filefilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', protect, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
