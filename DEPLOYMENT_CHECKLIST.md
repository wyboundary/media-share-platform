# 🚀 快速部署检查清单

按照这个清单一步步操作，10分钟内完成部署！

## ✅ 准备阶段（5分钟）

### 1. 注册账号
- [ ] GitHub 账号：https://github.com/
- [ ] Railway 账号：https://railway.app/（用 GitHub 登录）
- [ ] Vercel 账号：https://vercel.com/（用 GitHub 登录）

### 2. 推送代码到 GitHub

```bash
cd /Users/liwuyang/Documents/Test/web/media-share-platform

# 初始化 git（如果还没有）
git init
git add .
git commit -m "Initial commit: 媒体分享平台"

# 在 GitHub 创建仓库后，推送代码
git remote add origin https://github.com/你的用户名/media-share-platform.git
git branch -M main
git push -u origin main
```

---

## ✅ 部署后端到 Railway（3分钟）

### 3. 创建 Railway 项目
- [ ] 访问 https://railway.app/
- [ ] 点击 `New Project`
- [ ] 选择 `Deploy from GitHub repo`
- [ ] 选择你的仓库

### 4. 添加 MongoDB
- [ ] 点击 `+ New` → `Database` → `Add MongoDB`
- [ ] 等待 MongoDB 启动

### 5. 配置后端环境变量

点击后端服务 → `Variables`，添加：

```env
NODE_ENV=production
PORT=5001
MAX_FILE_SIZE=500
```

生成 JWT_SECRET：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

复制输出结果，添加为：
```env
JWT_SECRET=你生成的随机字符串
```

### 6. 配置构建命令

点击后端服务 → `Settings`：

- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && node dist/server.js`

### 7. 获取后端 URL
- [ ] 在 Settings → Domains，复制 URL
- [ ] 记下来，例如：`https://xxx.up.railway.app`

---

## ✅ 部署前端到 Vercel（2分钟）

### 8. 创建 Vercel 项目
- [ ] 访问 https://vercel.com/
- [ ] 点击 `Add New...` → `Project`
- [ ] 选择你的 GitHub 仓库
- [ ] 点击 `Import`

### 9. 配置项目

- **Framework Preset**: `Vite`
- **Root Directory**: 点击 `Edit` → 选择 `frontend`
- **Build Command**: `npm run build`（默认）
- **Output Directory**: `dist`（默认）

### 10. 配置环境变量

在 `Environment Variables` 添加：

```
VITE_API_URL=https://你的Railway后端URL/api
```

**示例**：
```
VITE_API_URL=https://media-share-backend.up.railway.app/api
```

⚠️ **注意**：URL 后面要加 `/api`

### 11. 部署
- [ ] 点击 `Deploy`
- [ ] 等待 2-3 分钟
- [ ] 复制 Vercel 提供的 URL

---

## ✅ 测试验证（3分钟）

### 12. 测试后端

访问：`https://你的Railway后端URL/api/health`

应该看到：
```json
{
  "status": "ok",
  "message": "服务运行正常"
}
```

### 13. 测试前端

- [ ] 访问 Vercel 提供的 URL
- [ ] 注册一个账号
- [ ] 登录成功

### 14. 配置 OSS

登录后点击"设置"，填写你自己的 OSS 配置信息：

```
Region: 你的OSS区域（如 oss-cn-beijing）
Access Key ID: 你的AccessKeyId
Access Key Secret: 你的AccessKeySecret
Bucket: 你的Bucket名称
OSS Domain: 你的OSS域名（如 https://your-bucket.oss-cn-beijing.aliyuncs.com）
```

- [ ] 点击"保存设置"

### 15. 测试上传

- [ ] 点击"上传"
- [ ] 选择一个音视频文件
- [ ] 上传成功
- [ ] 查看文件列表
- [ ] 复制链接测试
- [ ] 生成二维码测试

---

## 🎉 部署完成！

### 你的网站地址

- **前端**：`https://xxx.vercel.app`
- **后端**：`https://xxx.up.railway.app`

### 后续更新代码

```bash
# 本地修改代码后
git add .
git commit -m "你的修改说明"
git push

# Vercel 和 Railway 会自动检测并重新部署
```

---

## 🐛 遇到问题？

### Railway 部署失败

1. 查看 `Deployments` 日志
2. 检查构建命令是否正确
3. 确保 MongoDB 已启动

### 前端无法连接后端

1. 检查 `VITE_API_URL` 是否正确
2. 确保 URL 后面有 `/api`
3. 确保使用 `https://` 而不是 `http://`

### 文件上传失败

1. 确保已在设置页面配置 OSS
2. 检查 OSS 配置是否正确
3. 确认文件类型是音频或视频

### 查看日志

- **Railway**：项目 → 服务 → Deployments → 最新部署
- **Vercel**：项目 → Deployments → 最新部署

---

## 💰 成本

- **Railway**：$0-5/月（免费额度内）
- **Vercel**：$0/月（免费）
- **总计**：$0-5/月

---

## 📞 需要帮助

详细部署指南：查看 `VERCEL_RAILWAY_DEPLOYMENT.md`

祝你部署顺利！🚀
