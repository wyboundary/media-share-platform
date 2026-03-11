# Vercel + Railway 部署指南

这是一份详细的 Vercel（前端）+ Railway（后端）部署指南。

## 🎯 部署架构

```
用户
 ↓
Vercel (前端) → Railway (后端) → MongoDB (Railway)
                    ↓
                阿里云 OSS
```

## 📋 准备工作清单

- [ ] GitHub 账号
- [ ] Vercel 账号
- [ ] Railway 账号
- [ ] 代码已提交到 GitHub

---

## 第一步：准备 GitHub 仓库

### 1. 初始化 Git 仓库（如果还没有）

```bash
cd /Users/liwuyang/Documents/Test/web/media-share-platform

# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"
```

### 2. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com/)
2. 点击右上角 `+` → `New repository`
3. 填写信息：
   - Repository name: `media-share-platform`
   - Description: `音视频文件分享平台`
   - 选择 `Public` 或 `Private`
4. 点击 `Create repository`

### 3. 推送代码到 GitHub

```bash
# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/media-share-platform.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 第二步：部署后端到 Railway

### 1. 注册并登录 Railway

1. 访问 [Railway.app](https://railway.app/)
2. 点击 `Login` → 使用 GitHub 账号登录
3. 授权 Railway 访问你的 GitHub 仓库

### 2. 创建新项目

1. 点击 `New Project`
2. 选择 `Deploy from GitHub repo`
3. 选择你的仓库 `media-share-platform`
4. Railway 会自动检测并开始部署

### 3. 添加 MongoDB 数据库

1. 在项目页面，点击 `+ New`
2. 选择 `Database` → `Add MongoDB`
3. Railway 会自动创建 MongoDB 实例
4. 等待 MongoDB 启动（约 1-2 分钟）

### 4. 配置后端环境变量

1. 点击你的后端服务
2. 进入 `Variables` 标签
3. 添加以下环境变量：

```env
NODE_ENV=production
PORT=5001
JWT_SECRET=请生成一个随机字符串作为密钥
MAX_FILE_SIZE=500
```

**生成 JWT_SECRET：**
```bash
# 在本地终端运行
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

4. `MONGODB_URI` 会自动配置（Railway 会自动连接到 MongoDB）
   - 如果没有自动配置，可以手动添加
   - 点击 MongoDB 服务，复制 `Connection URL`
   - 回到后端服务，添加变量：`MONGODB_URI=<复制的连接URL>`

### 5. 配置构建和启动命令

1. 在后端服务的 `Settings` 标签
2. 找到 `Build Command`：
   ```bash
   cd backend && npm install && npm run build
   ```
3. 找到 `Start Command`：
   ```bash
   cd backend && node dist/server.js
   ```

### 6. 重新部署

1. 点击 `Deploy` → `Redeploy`
2. 查看部署日志，确保没有错误
3. 部署成功后，会显示一个 URL，例如：`https://media-share-backend.up.railway.app`

### 7. 获取后端 URL

1. 点击后端服务
2. 进入 `Settings` 标签
3. 找到 `Domains` 部分
4. 复制 Railway 提供的域名（例如：`media-share-backend.up.railway.app`）
5. **记下这个 URL，前端配置需要用到**

---

## 第三步：部署前端到 Vercel

### 1. 注册并登录 Vercel

1. 访问 [Vercel.com](https://vercel.com/)
2. 点击 `Sign Up` → 使用 GitHub 账号登录
3. 授权 Vercel 访问你的 GitHub 仓库

### 2. 创建新项目

1. 点击 `Add New...` → `Project`
2. 导入你的 GitHub 仓库 `media-share-platform`
3. 点击 `Import`

### 3. 配置项目

在项目配置页面：

**Framework Preset**: 选择 `Vite`

**Root Directory**: 设置为 `frontend`
- 点击 `Edit` → 选择 `frontend` 文件夹

**Build and Output Settings**:
- Build Command: `npm run build`（默认）
- Output Directory: `dist`（默认）
- Install Command: `npm install`（默认）

### 4. 配置环境变量

在 `Environment Variables` 部分添加：

```
Name: VITE_API_URL
Value: https://你的Railway后端URL/api
```

**示例**：
```
VITE_API_URL=https://media-share-backend.up.railway.app/api
```

**注意**：
- URL 后面要加 `/api`
- 使用 `https://` 而不是 `http://`

### 5. 部署

1. 点击 `Deploy`
2. 等待部署完成（约 2-3 分钟）
3. 部署成功后，Vercel 会提供一个 URL，例如：
   - `https://media-share-platform.vercel.app`
   - `https://media-share-platform-xxx.vercel.app`

### 6. 配置自定义域名（可选）

1. 在项目的 `Settings` → `Domains`
2. 添加你的域名
3. 按照提示配置 DNS 记录

---

## 第四步：验证部署

### 1. 测试后端

访问后端健康检查接口：
```
https://你的Railway后端URL/api/health
```

应该返回：
```json
{
  "status": "ok",
  "message": "服务运行正常"
}
```

### 2. 测试前端

1. 访问 Vercel 提供的前端 URL
2. 尝试注册一个新账号
3. 登录后进入设置页面
4. 配置你的 OSS 参数：
   - Region: `oss-cn-beijing`
   - Access Key ID: 你的 Access Key ID
   - Access Key Secret: 你的 Access Key Secret
   - Bucket: `multi-media-weiwei`
   - OSS Domain: `https://multi-media-weiwei.oss-cn-beijing.aliyuncs.com`
5. 尝试上传一个文件

### 3. 测试完整流程

- ✅ 注册账号
- ✅ 登录
- ✅ 配置 OSS 设置
- ✅ 上传文件
- ✅ 查看文件列表
- ✅ 生成二维码
- ✅ 复制链接
- ✅ 重命名文件
- ✅ 删除文件

---

## 🔧 后续维护

### 更新代码

1. 本地修改代码
2. 提交到 GitHub：
   ```bash
   git add .
   git commit -m "描述你的修改"
   git push
   ```
3. Vercel 和 Railway 会自动检测并重新部署

### 查看日志

**Railway 后端日志**：
1. 进入 Railway 项目
2. 点击后端服务
3. 查看 `Deployments` → 点击最新部署 → 查看日志

**Vercel 前端日志**：
1. 进入 Vercel 项目
2. 点击 `Deployments`
3. 点击最新部署 → 查看构建日志

### 修改环境变量

**Railway**：
1. 点击服务 → `Variables` 标签
2. 修改或添加变量
3. 点击 `Deploy` → `Redeploy`

**Vercel**：
1. 项目 `Settings` → `Environment Variables`
2. 修改变量
3. 触发重新部署（推送代码或手动重新部署）

---

## 💰 成本说明

### Railway

**免费套餐**：
- ✅ $5 免费额度/月
- ✅ 500 小时运行时间/月
- ✅ 足够个人项目使用

**付费套餐**（如果免费额度用完）：
- Developer Plan: $5/月
- 更多资源和功能

### Vercel

**免费套餐**：
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 自动 HTTPS
- ✅ 全球 CDN

**付费套餐**（个人项目通常不需要）：
- Pro Plan: $20/月
- 更多带宽和功能

### MongoDB（Railway 提供）

- ✅ Railway 的 MongoDB 包含在免费额度内
- 数据库大小限制：约 5GB

### 总成本

- **免费使用**：$0/月（在免费额度内）
- **超出免费额度**：约 $5-10/月

---

## 🐛 常见问题

### 1. Railway 部署失败

**检查**：
- 查看部署日志，找到错误信息
- 确保 `package.json` 中有 `build` 脚本
- 确保环境变量配置正确

**解决**：
```bash
# 确保 backend/package.json 中有
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 2. 前端访问后端 CORS 错误

**原因**：后端没有配置 CORS

**解决**：确保后端 `server.ts` 中有：
```typescript
import cors from 'cors';
app.use(cors());
```

### 3. MongoDB 连接失败

**检查**：
- Railway 的 MongoDB 是否已启动
- `MONGODB_URI` 环境变量是否正确

**解决**：
1. 点击 MongoDB 服务
2. 复制 `MONGO_URL` 变量
3. 在后端服务中添加 `MONGODB_URI=<复制的URL>`

### 4. 文件上传失败

**原因**：用户未配置 OSS 设置

**解决**：
1. 登录后进入"设置"页面
2. 填写完整的 OSS 配置信息
3. 点击"保存设置"

### 5. Railway 免费额度用完

**解决方案**：
1. 升级到 Developer Plan ($5/月)
2. 或者迁移到其他方案（阿里云 ECS）

---

## 📞 需要帮助？

如果遇到问题：

1. **查看日志**：Railway 和 Vercel 的部署日志
2. **检查环境变量**：确保所有变量都配置正确
3. **测试接口**：使用 Postman 或浏览器测试后端 API
4. **联系我**：提供错误截图和日志

---

## 🎉 部署成功！

恭喜！你的媒体分享平台已经成功部署到云端了！

**你的网站地址**：
- 前端：`https://your-project.vercel.app`
- 后端：`https://your-project.up.railway.app`

现在你可以：
- ✅ 随时随地访问你的网站
- ✅ 分享给朋友使用
- ✅ 自动部署更新（推送代码即可）

享受你的媒体分享平台吧！🚀
