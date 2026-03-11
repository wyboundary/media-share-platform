import express from 'express';
import multer from 'multer';
import {
  uploadFile,
  getMyFiles,
  getFile,
  updateFilePermission,
  deleteFile,
  generateQRCode,
  playFile,
  renameFile
} from '../controllers/fileController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// 配置 multer（内存存储）
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE || '500')) * 1024 * 1024 // MB to bytes
  },
  fileFilter: (req, file, cb) => {
    // 只允许音视频文件
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('只支持音频和视频文件'));
    }
  }
});

// 受保护的路由（需要登录）
router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/my-files', protect, getMyFiles);
router.get('/:id', protect, getFile);
router.put('/:id/permission', protect, updateFilePermission);
router.put('/:id/rename', protect, renameFile);
router.delete('/:id', protect, deleteFile);
router.get('/:id/qrcode', protect, generateQRCode);

// 公开路由（无需登录）
router.get('/play/:id', playFile);

export default router;
