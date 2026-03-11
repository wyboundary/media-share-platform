import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import fileRoutes from './routes/file';
import settingRoutes from './routes/setting';
import { errorHandler } from './middlewares/errorHandler';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/settings', settingRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' });
});

// 错误处理中间件
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});

export default app;

// OSS 测试接口
app.get('/api/test-oss', async (req, res) => {
  try {
    const getOSSClient = require('./config/oss').default;
    const client = getOSSClient();
    
    // 列出 bucket 中的文件（测试连接）
    const result = await client.list({ 'max-keys': 1 });
    
    res.json({
      success: true,
      message: 'OSS 连接成功',
      region: process.env.OSS_REGION,
      bucket: process.env.OSS_BUCKET,
      files: result.objects?.length || 0
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      region: process.env.OSS_REGION,
      bucket: process.env.OSS_BUCKET
    });
  }
});
