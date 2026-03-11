# 项目结构说明

```
media-share-platform/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── config/            # 配置文件
│   │   │   ├── database.ts    # MongoDB 连接配置
│   │   │   └── oss.ts         # 阿里云 OSS 配置
│   │   ├── controllers/       # 控制器
│   │   │   ├── authController.ts    # 用户认证控制器
│   │   │   └── fileController.ts    # 文件操作控制器
│   │   ├── middlewares/       # 中间件
│   │   │   ├── auth.ts        # JWT 认证中间件
│   │   │   └── errorHandler.ts # 错误处理中间件
│   │   ├── models/            # 数据模型
│   │   │   ├── User.ts        # 用户模型
│   │   │   └── File.ts        # 文件模型
│   │   ├── routes/            # 路由
│   │   │   ├── auth.ts        # 认证路由
│   │   │   └── file.ts        # 文件路由
│   │   └── server.ts          # 服务器入口文件
│   ├── .env.example           # 环境变量示例
│   ├── .gitignore            # Git 忽略文件
│   ├── package.json          # 依赖配置
│   └── tsconfig.json         # TypeScript 配置
│
├── frontend/                  # 前端应用
│   ├── src/
│   │   ├── components/       # React 组件
│   │   │   ├── Navbar.tsx    # 导航栏组件
│   │   │   └── ProtectedRoute.tsx # 路由保护组件
│   │   ├── context/          # React Context
│   │   │   └── AuthContext.tsx # 认证上下文
│   │   ├── pages/            # 页面组件
│   │   │   ├── Home.tsx      # 首页
│   │   │   ├── Login.tsx     # 登录页
│   │   │   ├── Register.tsx  # 注册页
│   │   │   ├── Dashboard.tsx # 文件管理页
│   │   │   ├── Upload.tsx    # 上传页
│   │   │   └── Play.tsx      # 播放页
│   │   ├── services/         # API 服务
│   │   │   ├── api.ts        # Axios 实例配置
│   │   │   ├── auth.ts       # 认证服务
│   │   │   └── file.ts       # 文件服务
│   │   ├── types/            # TypeScript 类型定义
│   │   │   └── index.ts      # 公共类型
│   │   ├── utils/            # 工具函数
│   │   │   └── format.ts     # 格式化工具
│   │   ├── App.tsx           # 应用根组件
│   │   └── main.tsx          # 应用入口
│   ├── .env.example          # 环境变量示例
│   ├── index.html            # HTML 模板
│   ├── package.json          # 依赖配置
│   ├── tsconfig.json         # TypeScript 配置
│   └── vite.config.ts        # Vite 配置
│
├── docs/                     # 文档目录
│   ├── QUICK-START.md       # 快速开始指南
│   ├── OSS-CONFIG.md        # 阿里云 OSS 配置指南
│   ├── MONGODB-SETUP.md     # MongoDB 安装配置指南
│   └── PROJECT-STRUCTURE.md # 项目结构说明（本文件）
│
├── start.sh                 # 一键启动脚本
└── README.md               # 项目说明文档
```

## 核心功能模块

### 后端 (Backend)

#### 1. 用户认证模块
- **文件**: `authController.ts`, `User.ts`, `auth.ts`
- **功能**:
  - 用户注册（密码加密）
  - 用户登录（JWT token 生成）
  - 获取当前用户信息
  - JWT 认证中间件

#### 2. 文件管理模块
- **文件**: `fileController.ts`, `File.ts`, `file.ts`
- **功能**:
  - 文件上传到阿里云 OSS
  - 获取用户文件列表（分页）
  - 更新文件权限（公开/私有）
  - 删除文件（同步删除 OSS 和数据库）
  - 生成文件二维码
  - 公开访问播放（统计播放次数）

#### 3. 数据模型
- **User 模型**: 用户信息（用户名、邮箱、密码）
- **File 模型**: 文件信息（文件名、类型、大小、OSS链接、权限、统计数据）

### 前端 (Frontend)

#### 1. 认证功能
- **文件**: `Login.tsx`, `Register.tsx`, `AuthContext.tsx`, `ProtectedRoute.tsx`
- **功能**:
  - 用户登录/注册表单
  - 全局认证状态管理
  - 路由保护（未登录跳转到登录页）
  - Token 自动注入到请求头

#### 2. 文件上传
- **文件**: `Upload.tsx`
- **功能**:
  - 点击上传
  - 拖拽上传
  - 文件类型验证
  - 上传进度显示

#### 3. 文件管理
- **文件**: `Dashboard.tsx`
- **功能**:
  - 文件列表展示
  - 文件权限切换（公开/私有）
  - 复制分享链接
  - 生成二维码
  - 删除文件
  - 访问统计展示

#### 4. 文件播放
- **文件**: `Play.tsx`
- **功能**:
  - 音频播放器
  - 视频播放器
  - 播放次数统计
  - 公开访问（无需登录）

#### 5. UI 组件
- **Navbar**: 导航栏（登录状态、用户信息、登出）
- **Home**: 首页介绍
- **ProtectedRoute**: 路由保护

## 技术实现细节

### 认证流程
1. 用户注册/登录
2. 后端验证并生成 JWT token
3. 前端保存 token 到 localStorage
4. 每次请求自动在 header 添加 token
5. 后端中间件验证 token 有效性

### 文件上传流程
1. 用户选择文件
2. 前端验证文件类型和大小
3. 使用 FormData 发送到后端
4. 后端使用 multer 接收文件（内存存储）
5. 生成唯一文件名
6. 上传到阿里云 OSS
7. 保存文件信息到 MongoDB
8. 返回文件信息给前端

### 二维码生成流程
1. 前端请求生成二维码
2. 后端生成播放页面 URL
3. 使用 qrcode 库生成二维码（Base64）
4. 更新扫码次数
5. 返回二维码数据给前端
6. 前端显示二维码图片

### 文件播放流程
1. 用户扫码或点击链接访问播放页面
2. 前端根据文件 ID 请求文件信息
3. 后端检查文件是否公开
4. 更新播放次数
5. 返回文件 URL
6. 前端使用 HTML5 video/audio 播放

## 数据库设计

### users 集合
```javascript
{
  _id: ObjectId,
  username: String,      // 用户名（唯一）
  email: String,         // 邮箱（唯一）
  password: String,      // 加密后的密码
  createdAt: Date        // 创建时间
}
```

### files 集合
```javascript
{
  _id: ObjectId,
  filename: String,      // 存储文件名
  originalName: String,  // 原始文件名
  fileType: String,      // 文件类型（audio/video）
  mimeType: String,      // MIME 类型
  fileSize: Number,      // 文件大小（字节）
  ossUrl: String,        // OSS 访问链接
  ossKey: String,        // OSS 对象键
  owner: ObjectId,       // 所有者 ID（关联 users）
  isPublic: Boolean,     // 是否公开
  viewCount: Number,     // 播放次数
  scanCount: Number,     // 扫码次数
  createdAt: Date,       // 创建时间
  updatedAt: Date        // 更新时间
}
```

## API 接口

### 认证接口
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户（需认证）

### 文件接口
- `POST /api/files/upload` - 上传文件（需认证）
- `GET /api/files/my-files` - 获取我的文件（需认证）
- `GET /api/files/:id` - 获取文件详情（需认证）
- `PUT /api/files/:id/permission` - 更新权限（需认证）
- `DELETE /api/files/:id` - 删除文件（需认证）
- `GET /api/files/:id/qrcode` - 生成二维码（需认证）
- `GET /api/files/play/:id` - 播放文件（公开访问）

## 开发建议

### 添加新功能
1. **后端**：在相应的 controller 添加方法 → 在 routes 添加路由 → 测试
2. **前端**：在 services 添加 API 调用 → 创建/修改页面组件 → 测试

### 调试技巧
- 后端日志：在 controller 中添加 `console.log`
- 前端调试：使用浏览器开发者工具
- API 测试：使用 Postman 或 Thunder Client

### 常见扩展
- 添加文件分享功能（生成分享码）
- 添加评论功能
- 添加文件夹/分类管理
- 添加批量操作
- 添加管理员后台
- 集成 CDN 加速
- 添加水印功能
