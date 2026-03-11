# 云端部署方案

本文档提供多种云端部署方案，你可以根据预算、技术水平和需求选择合适的方案。

## 📊 方案对比

| 方案 | 难度 | 成本 | 优点 | 适用场景 |
|------|------|------|------|----------|
| 阿里云 ECS | ⭐⭐⭐ | ¥50-200/月 | 完全控制，性能稳定 | 生产环境，需要完全控制 |
| Vercel + Railway | ⭐⭐ | $0-20/月 | 部署简单，自动 CI/CD | 个人项目，快速上线 |
| Docker + 云服务器 | ⭐⭐⭐⭐ | ¥50-200/月 | 容器化，易于迁移 | 需要容器化部署 |
| Serverless | ⭐⭐ | 按量付费 | 无需管理服务器 | 流量不大的项目 |

---

## 方案一：阿里云 ECS（推荐）

### 💡 适合场景
- 生产环境部署
- 需要完全控制服务器
- 与阿里云 OSS 在同一个生态，网络速度快

### 📝 部署步骤

#### 1. 购买阿里云 ECS 服务器

1. 登录[阿里云控制台](https://ecs.console.aliyun.com/)
2. 购买 ECS 实例
   - **配置推荐**：
     - CPU: 2核
     - 内存: 4GB
     - 系统盘: 40GB
     - 带宽: 3-5Mbps
     - 操作系统: Ubuntu 22.04 LTS
   - **地域**：选择与 OSS 相同的地域（如华北2北京）
   - **安全组**：开放 22（SSH）、80（HTTP）、443（HTTPS）、5001（后端API）端口

#### 2. 连接到服务器

```bash
# 使用 SSH 连接
ssh root@your-server-ip
```

#### 3. 安装必要软件

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node --version
npm --version

# 安装 MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# 启动 MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2（进程管理器）
sudo npm install -g pm2

# 安装 Git
sudo apt install -y git
```

#### 4. 部署后端

```bash
# 创建项目目录
mkdir -p /var/www/media-share
cd /var/www/media-share

# 克隆代码（或使用 FTP/SCP 上传）
git clone <your-repo-url> .
# 或者本地上传：scp -r ./media-share-platform root@your-server-ip:/var/www/media-share

# 进入后端目录
cd backend

# 安装依赖
npm install

# 创建生产环境配置
cat > .env << EOF
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://localhost:27017/media-share
JWT_SECRET=$(openssl rand -base64 32)
MAX_FILE_SIZE=500
EOF

# 构建
npm run build

# 使用 PM2 启动
pm2 start dist/server.js --name media-share-backend
pm2 save
pm2 startup
```

#### 5. 部署前端

```bash
# 进入前端目录
cd /var/www/media-share/frontend

# 安装依赖
npm install

# 创建生产环境配置
cat > .env << EOF
VITE_API_URL=https://your-domain.com/api
EOF

# 构建
npm run build

# 移动构建文件到 Nginx 目录
sudo cp -r dist /var/www/html/media-share
```

#### 6. 配置 Nginx

```bash
# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/media-share
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

    # 前端
    location / {
        root /var/www/html/media-share;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/media-share /etc/nginx/sites-enabled/

# 删除默认配置
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 7. 配置 SSL 证书（HTTPS）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取免费 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

#### 8. 配置防火墙

```bash
# 启用 UFW 防火墙
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 📊 维护命令

```bash
# 查看后端日志
pm2 logs media-share-backend

# 重启后端
pm2 restart media-share-backend

# 查看后端状态
pm2 status

# 更新代码
cd /var/www/media-share
git pull
cd backend && npm install && npm run build
pm2 restart media-share-backend
cd ../frontend && npm install && npm run build
sudo cp -r dist/* /var/www/html/media-share/
```

### 💰 成本估算

- ECS 服务器（2核4G）：约 ¥100-150/月
- 公网带宽（5Mbps）：约 ¥30-50/月
- OSS 存储：按实际使用量计费
- **总计**：约 ¥130-200/月

---

## 方案二：Vercel（前端）+ Railway（后端）

### 💡 适合场景
- 个人项目
- 快速上线
- 不想管理服务器

### 📝 部署步骤

#### 1. 部署后端到 Railway

1. 注册 [Railway](https://railway.app/)
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择你的仓库，Railway 会自动检测并部署
4. 添加 MongoDB 服务：
   - 点击 "+ New" → "Database" → "Add MongoDB"
5. 配置环境变量：
   ```
   PORT=5001
   MONGODB_URI=<Railway 提供的连接字符串>
   JWT_SECRET=<随机字符串>
   MAX_FILE_SIZE=500
   ```
6. 获取后端 URL：`https://your-app.railway.app`

#### 2. 部署前端到 Vercel

1. 注册 [Vercel](https://vercel.com/)
2. 点击 "New Project" → "Import Git Repository"
3. 选择你的仓库
4. 配置：
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 添加环境变量：
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```
6. 点击 "Deploy"

### 💰 成本估算

- Railway：$5-20/月（免费套餐 500 小时/月）
- Vercel：免费
- MongoDB Atlas：免费套餐 512MB
- **总计**：$0-20/月

---

## 方案三：Docker 容器化部署

### 💡 适合场景
- 需要容器化
- 易于迁移
- 团队协作

### 📝 部署步骤

#### 1. 创建 Dockerfile

**后端 Dockerfile**

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5001

CMD ["node", "dist/server.js"]
```

**前端 Dockerfile**

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

**前端 nginx.conf**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: media-share-mongodb
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: media-share

  backend:
    build: ./backend
    container_name: media-share-backend
    restart: always
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - PORT=5001
      - MONGODB_URI=mongodb://mongodb:27017/media-share
      - JWT_SECRET=${JWT_SECRET}
      - MAX_FILE_SIZE=500
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: media-share-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### 3. 部署到云服务器

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo apt install docker-compose -y

# 上传代码到服务器
scp -r ./media-share-platform root@your-server-ip:/var/www/

# 启动服务
cd /var/www/media-share-platform
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 更新服务
docker-compose pull
docker-compose up -d --build
```

---

## 方案四：腾讯云 Serverless

### 💡 适合场景
- 流量不大
- 按量付费
- 无需管理服务器

### 📝 部署步骤

1. 注册[腾讯云 Serverless](https://cloud.tencent.com/product/scf)
2. 安装 Serverless CLI：
   ```bash
   npm install -g serverless
   ```
3. 配置 `serverless.yml`
4. 部署：
   ```bash
   serverless deploy
   ```

---

## 🔧 域名配置

### 购买域名

1. 在[阿里云](https://wanwang.aliyun.com/)或其他域名服务商购买域名
2. 域名价格：约 ¥50-100/年

### DNS 解析配置

1. 登录域名管理控制台
2. 添加 A 记录：
   - 主机记录：`@`（或 `www`）
   - 记录类型：A
   - 记录值：你的服务器 IP 地址
   - TTL：600

### 备案（如果是国内服务器）

- 阿里云 ECS 需要进行 ICP 备案
- 备案时间：约 15-20 天
- 备案期间可以使用 IP 地址访问

---

## 📊 方案推荐

### 个人学习/测试项目
👉 **Vercel + Railway**
- 成本低（可能免费）
- 部署简单
- 无需运维

### 小型生产项目
👉 **阿里云 ECS（1核2G）+ Docker**
- 成本适中（¥60-100/月）
- 完全控制
- 易于维护

### 中大型生产项目
👉 **阿里云 ECS（2核4G）+ PM2 + Nginx**
- 性能稳定
- 可扩展
- 专业运维

---

## 🛡️ 安全建议

1. **使用强密码**
   - 服务器 SSH 密码
   - MongoDB 密码
   - JWT Secret

2. **配置防火墙**
   - 只开放必要端口
   - 使用安全组规则

3. **启用 HTTPS**
   - 使用 Let's Encrypt 免费证书
   - 强制 HTTPS 访问

4. **定期备份**
   - 数据库定期备份
   - 代码定期提交到 Git

5. **监控告警**
   - 使用 PM2 监控进程
   - 配置云监控告警

---

## 📞 需要帮助？

选择好部署方案后，我可以帮你：
1. 生成具体的部署脚本
2. 配置文件的详细说明
3. 解决部署过程中的问题

你想选择哪个方案？我可以提供更详细的部署指导！
