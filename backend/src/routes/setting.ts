import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// 受保护的路由（需要登录）
router.get('/', protect, getSettings);
router.put('/', protect, updateSettings);

export default router;
