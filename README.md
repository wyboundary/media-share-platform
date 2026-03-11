# 媒体分享平台

一个支持多用户的音视频文件分享平台，用户可以上传音视频文件到阿里云 OSS，生成分享链接和二维码，支持文件管理和访问统计。每个用户可以配置自己独立的 OSS 存储空间。

## 📋 项目概述

### 核心功能

- **用户认证**：注册、登录、JWT 身份验证
- **文件上传**：上传音频/视频文件到阿里云 OSS
- **文件管理**：查看、重命名、删除文件
- **权限控制**：公开/私有文件访问权限设置
- **链接分享**：复制 OSS 直链进行分享
- **二维码生成**：生成指向 OSS 文件的二维码
- **访问统计**：记录文件浏览次数和扫码次数
- **个性化配置**：每个用户可配置自己的 OSS 存储参数

### 技术特点

- ✅ 多用户支持，每个用户独立的 OSS 配置
- ✅ 文件名保留原始名称，自动添加时间戳和随机字符串避免冲突
- ✅ 前端显示简化文件名，OSS 实际存储完整文件名
- ✅ 支持文件重命名（同步更新 OSS 和数据库）
- ✅ 响应式设计，现代化 UI
- ✅ 实时上传进度显示

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **React** | 19.2.0 | UI 框架 |
| **TypeScript** | 5.6.2 | 类型安全 |
| **Vite** | 6.0.11 | 构建工具 |
| **React Router** | 6.30.3 | 路由管理 |
| **Axios** | 1.7.9 | HTTP 客户端 |
| **React Hot Toast** | 2.4.1 | 消息提示 |
| **Lucide React** | 0.468.0 | 图标库 |

### 后端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Node.js** | - | 运行时环境 |
| **Express** | 4.21.2 | Web 框架 |
| **TypeScript** | 5.7.3 | 类型安全 |
| **MongoDB** | - | 数据库 |
| **Mongoose** | 8.9.4 | ODM |
| **JWT** | 9.0.2 | 身份认证 |
| **bcryptjs** | 2.4.3 | 密码加密 |
| **ali-oss** | 6.21.0 | 阿里云 OSS SDK |
| **multer** | 1.4.5-lts.1 | 文件上传中间件 |
| **qrcode** | 1.5.4 | 二维码生成 |

## 📁 项目结构

```
media-share-platform/
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── components/      # 组件
│   │   │   ├── Navbar.tsx          # 导航栏
│   │   │   └── ProtectedRoute.tsx  # 路由保护
│   │   ├── context/         # 上下文
│   │   │   └── AuthContext.tsx     # 认证上下文
│   │   ├── pages/           # 页面
│   │   │   ├── Home.tsx            # 首页
│   │   │   ├── Login.tsx           # 登录页
│   │   │   ├── Register.tsx        # 注册页
│   │   │   ├── Dashboard.tsx       # 文件列表
│   │   │   ├── Upload.tsx          # 上传页面
│   │   │   ├── Settings.tsx        # 设置页面
│   │   │   └── Play.tsx            # 播放页面
│   │   ├── services/        # API 服务
│   │   │   ├── api.ts              # Axios 配置
│   │   │   ├── auth.ts             # 认证服务
│   │   │   ├── file.ts             # 文件服务
│   │   │   └── setting.ts          # 设置服务
│   │   ├── types/           # 类型定义
│   │   │   └── index.ts
│   │   ├── utils/           # 工具函数
│   │   │   └── format.ts
│   │   ├── App.tsx          # 应用入口
│   │   └── main.tsx         # 主文件
│   ├── .env                 # 环境变量
│   └── package.json
│
└── backend/                 # 后端项目
    ├── src/
    │   ├── config/          # 配置
    │   │   ├── database.ts         # 数据库配置
    │   │   └── oss.ts              # OSS 配置
    │   ├── controllers/     # 控制器
    │   │   ├── authController.ts   # 认证控制器
    │   │   ├── fileController.ts   # 文件控制器
    │   │   └── settingController.ts # 设置控制器
    │   ├── middlewares/     # 中间件
    │   │   ├── auth.ts             # 认证中间件
    │   │   └── errorHandler.ts     # 错误处理
    │   ├── models/          # 数据模型
    │   │   ├── User.ts             # 用户模型
    │   │   ├── File.ts             # 文件模型
    │   │   └── Setting.ts          # 设置模型
    │   ├── routes/          # 路由
    │   │   ├── auth.ts             # 认证路由
    │   │   ├── file.ts             # 文件路由
    │   │   └── setting.ts          # 设置路由
    │   └── server.ts        # 服务器入口
    ├── .env                 # 环境变量
    └── package.json
```

## 🗄️ 数据模型

### User（用户）

```typescript
{
  username: string;        // 用户名（唯一）
  email: string;          // 邮箱（唯一）
  password: string;       // 密码（加密）
  createdAt: Date;        // 创建时间
  updatedAt: Date;        // 更新时间
}
```

### File（文件）

```typescript
{
  filename: string;       // OSS 文件名（原名-时间戳-随机字符串.扩展名）
  originalName: string;   // 原始文件名
  fileType: string;       // 文件类型（audio/video）
  mimeType: string;       // MIME 类型
  fileSize: number;       // 文件大小（字节）
  ossUrl: string;         // OSS 访问 URL
  ossKey: string;         // OSS 存储键
  owner: ObjectId;        // 所有者（关联 User）
  isPublic: boolean;      // 是否公开（默认 true）
  viewCount: number;      // 浏览次数（默认 0）
  scanCount: number;      // 扫码次数（默认 0）
  createdAt: Date;        // 创建时间
  updatedAt: Date;        // 更新时间
}
```

### Setting（设置）

```typescript
{
  userId: ObjectId;           // 用户 ID（唯一）
  ossRegion: string;          // OSS 区域（如 oss-cn-beijing）
  ossAccessKeyId: string;     // OSS Access Key ID
  ossAccessKeySecret: string; // OSS Access Key Secret
  ossBucket: string;          // OSS Bucket 名称
  ossDomain: string;          // OSS 域名
  createdAt: Date;            // 创建时间
  updatedAt: Date;            // 更新时间
}
```

## 🔌 API 接口

### 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |
| GET | `/api/auth/me` | 获取当前用户信息 | ✅ |

### 文件接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/files/upload` | 上传文件 | ✅ |
| GET | `/api/files/my-files` | 获取我的文件列表 | ✅ |
| GET | `/api/files/:id` | 获取文件信息 | ✅ |
| PUT | `/api/files/:id/permission` | 更新文件权限 | ✅ |
| PUT | `/api/files/:id/rename` | 重命名文件 | ✅ |
| DELETE | `/api/files/:id` | 删除文件 | ✅ |
| GET | `/api/files/:id/qrcode` | 生成二维码 | ✅ |
| GET | `/api/files/play/:id` | 播放文件（公开访问） | ❌ |

### 设置接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/settings` | 获取 OSS 设置 | ✅ |
| PUT | `/api/settings` | 更新 OSS 设置 | ✅ |

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- MongoDB >= 4.4
- 阿里云 OSS 账号

### 后端配置

1. **进入后端目录**

```bash
cd backend
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

创建 `.env` 文件：

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/media-share
JWT_SECRET=your-jwt-secret-key

# 文件上传限制（MB）
MAX_FILE_SIZE=500
```

4. **启动服务**

```bash
npm run dev
```

后端服务将运行在 `http://localhost:5001`

### 前端配置

1. **进入前端目录**

```bash
cd frontend
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

创建 `.env` 文件：

```env
VITE_API_URL=http://localhost:5001/api
```

4. **启动服务**

```bash
npm run dev
```

前端服务将运行在 `http://localhost:5173`

## 📖 使用流程

### 1. 注册账号

访问网站并注册新账号：
- 输入用户名
- 输入邮箱
- 设置密码

### 2. 配置 OSS

登录后，点击导航栏的"设置"：
- 填写 OSS Region（如 `oss-cn-beijing`）
- 填写 Access Key ID
- 填写 Access Key Secret
- 填写 Bucket 名称
- 填写 OSS 域名（完整 URL，包含 https://）
- 点击"保存设置"

**OSS 配置示例：**
```
Region: oss-cn-beijing（你的OSS区域）
Access Key ID: 你的AccessKeyId
Access Key Secret: 你的AccessKeySecret
Bucket: your-bucket-name（你的Bucket名称）
OSS Domain: https://your-bucket.oss-cn-beijing.aliyuncs.com（你的OSS域名）
```

### 3. 上传文件

点击"上传"按钮：
- 选择音频或视频文件
- 查看上传进度
- 上传完成后自动跳转到文件列表

### 4. 管理文件

在文件列表页面可以：
- **查看文件**：显示文件名、大小、上传时间、浏览次数
- **复制链接**：获取 OSS 直链
- **生成二维码**：扫码直接访问文件
- **重命名**：修改文件名（同步更新 OSS）
- **切换权限**：设置为公开或私有
- **删除文件**：从 OSS 和数据库中删除

## 🔐 安全特性

- ✅ **密码加密**：使用 bcryptjs 加密存储
- ✅ **JWT 认证**：7 天有效期
- ✅ **路由保护**：受保护的路由需要认证
- ✅ **权限验证**：文件操作需验证所有权
- ✅ **文件类型限制**：仅支持音视频文件
- ✅ **文件大小限制**：默认 500MB（可配置）
- ✅ **OSS 密钥保护**：前端仅显示部分密钥

## 🎯 核心功能实现

### 文件命名规则

上传文件时，系统自动生成文件名：

```
格式：原始文件名-时间戳-随机字符串.扩展名
示例：音频04-1773225349455-yfkxs2.m4a
```

前端显示时会自动提取并显示简化版本：

```
显示：音频04.m4a
实际：音频04-1773225349455-yfkxs2.m4a
```

### 文件重命名

重命名操作会：
1. 在 OSS 中复制文件到新名称
2. 删除 OSS 中的旧文件
3. 更新数据库中的文件记录
4. 保留时间戳和随机字符串，仅更新基础名称

### OSS 客户端管理

使用懒加载模式，根据用户配置动态创建 OSS 客户端：

```typescript
export const getOSSClientForUser = async (userId: string): Promise<OSS> => {
  const settings = await Setting.findOne({ userId });

  if (!settings) {
    throw new Error('未找到 OSS 配置，请先在设置页面配置 OSS 参数');
  }

  return new OSS({
    region: settings.ossRegion,
    accessKeyId: settings.ossAccessKeyId,
    accessKeySecret: settings.ossAccessKeySecret,
    bucket: settings.ossBucket,
  });
};
```

## 🔧 阿里云 OSS 配置建议

### 1. Bucket 权限设置

- **读写权限**：推荐设置为"公共读"，这样生成的链接可以直接访问
- **访问控制**：可以在 Bucket 策略中进一步细化权限

### 2. 跨域设置（CORS）

在 OSS 控制台配置 CORS 规则：

```
来源（AllowedOrigin）：* 或您的前端域名
允许方法（AllowedMethod）：GET, POST, PUT, DELETE, HEAD
允许Headers（AllowedHeader）：*
暴露Headers（ExposeHeader）：ETag
缓存时间（MaxAgeSeconds）：0
```

### 3. 防盗链（可选）

- 可以配置 Referer 白名单，防止资源被盗链
- 生产环境建议开启

### 4. 生命周期管理（可选）

- 自动删除超过指定天数的文件
- 节省存储成本

## 🐛 常见问题

### 1. 端口被占用

如果 5001 端口被占用：

```bash
# 查找占用端口的进程
lsof -ti:5001

# 停止进程
kill -9 <PID>
```

### 2. OSS 连接失败

检查以下配置：
- Region 是否正确（如 `oss-cn-beijing`）
- Access Key 是否有效
- Bucket 是否存在且有访问权限
- 域名格式是否正确（需包含 `https://`）

### 3. 文件上传失败

可能原因：
- 未配置 OSS 设置（首次使用需要在设置页面配置）
- 文件类型不支持（仅支持音视频文件）
- 文件大小超出限制（默认 500MB）
- OSS 配置错误

### 4. 前端页面空白

清除 Vite 缓存：

```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### 5. MongoDB 连接失败

确保 MongoDB 服务已启动：

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

## 📝 待优化功能

- [ ] 批量上传文件
- [ ] 文件预览播放
- [ ] 文件夹管理
- [ ] 分享链接有效期设置
- [ ] 文件标签和分类
- [ ] 搜索和过滤功能
- [ ] 用户头像上传
- [ ] 文件下载统计
- [ ] CDN 加速支持
- [ ] 多语言支持
- [ ] 移动端适配优化

## 📄 License

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请通过以下方式联系：
- 提交 Issue
- 发送邮件

---

**开发时间：** 2026-03-11
**最后更新：** 2026-03-11
