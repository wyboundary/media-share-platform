# 快速开始指南

## 5分钟快速启动

### 1️⃣ 安装 MongoDB

如果还没有安装 MongoDB，请先安装：

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:** 下载并安装 [MongoDB Community Server](https://www.mongodb.com/try/download/community)

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update && sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

或使用 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)（云数据库，免费）

### 2️⃣ 配置阿里云 OSS

1. 登录[阿里云控制台](https://oss.console.aliyun.com/)
2. 创建 OSS Bucket（选择"公共读"权限）
3. 获取 AccessKey（建议创建 RAM 用户）
4. 记录以下信息：
   - Region（如：`oss-cn-hangzhou`）
   - AccessKey ID
   - AccessKey Secret
   - Bucket 名称

详细配置见：[docs/OSS-CONFIG.md](docs/OSS-CONFIG.md)

### 3️⃣ 配置环境变量

```bash
# 复制环境变量示例文件
cp backend/.env.example backend/.env

# 编辑 backend/.env，填入您的配置
nano backend/.env  # 或使用其他编辑器
```

**必须配置的项：**
```env
MONGODB_URI=mongodb://localhost:27017/media-share
JWT_SECRET=随机生成一个复杂的密钥
OSS_REGION=您的OSS地域
OSS_ACCESS_KEY_ID=您的AccessKey ID
OSS_ACCESS_KEY_SECRET=您的AccessKey Secret
OSS_BUCKET=您的Bucket名称
OSS_DOMAIN=https://your-bucket-name.oss-cn-hangzhou.aliyuncs.com
```

### 4️⃣ 一键启动

```bash
# 给启动脚本执行权限（首次运行）
chmod +x start.sh

# 启动服务
./start.sh
```

启动脚本会自动：
- 安装所有依赖
- 启动后端服务（端口 5000）
- 启动前端服务（端口 5173）

### 5️⃣ 访问应用

打开浏览器访问：**http://localhost:5173**

🎉 完成！现在可以注册账号并开始使用了。

---

## 手动启动（可选）

如果不想使用启动脚本，可以手动启动：

### 启动后端

```bash
cd backend
npm install
npm run dev
```

### 启动前端

```bash
cd frontend
npm install
npm run dev
```

---

## 常见问题

### ❌ MongoDB 连接失败

**解决方案：**
1. 确认 MongoDB 服务已启动：`brew services list`（macOS）或 `sudo systemctl status mongod`（Linux）
2. 检查 `.env` 中的 `MONGODB_URI` 是否正确
3. 如果使用 MongoDB Atlas，确保已配置网络访问权限

### ❌ 阿里云 OSS 上传失败

**解决方案：**
1. 检查 OSS 配置信息是否正确填写
2. 确认 Bucket 权限设置为"公共读"
3. 确认 RAM 用户有 OSS 操作权限
4. 查看后端日志获取详细错误信息

### ❌ 端口被占用

**解决方案：**
```bash
# 查看占用端口的进程
lsof -i :5000  # 后端端口
lsof -i :5173  # 前端端口

# 杀死进程
kill -9 <PID>
```

或修改端口：
- 后端：编辑 `backend/.env` 中的 `PORT`
- 前端：编辑 `frontend/vite.config.ts`

### 📱 无法扫码访问

**解决方案：**
1. 确保手机和电脑在同一局域网
2. 前端访问地址改为电脑的局域网 IP（如 `http://192.168.1.100:5173`）
3. 后端 `.env` 添加：`FRONTEND_URL=http://192.168.1.100:5173`
4. 文件需要设置为"公开"才能被访问

---

## 下一步

- 📖 查看完整文档：[README.md](../README.md)
- 🔧 详细配置指南：[docs/OSS-CONFIG.md](docs/OSS-CONFIG.md)
- 🗄️ MongoDB 配置：[docs/MONGODB-SETUP.md](docs/MONGODB-SETUP.md)

---

**提示：** 首次启动可能需要几分钟安装依赖，请耐心等待。
