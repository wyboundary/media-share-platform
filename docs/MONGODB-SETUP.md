# MongoDB 安装和配置指南

## 安装 MongoDB

### macOS

```bash
# 使用 Homebrew 安装
brew tap mongodb/brew
brew install mongodb-community

# 启动 MongoDB 服务
brew services start mongodb-community

# 验证安装
mongosh
```

### Windows

1. 下载 [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. 运行安装程序
3. 选择"Complete"安装
4. 安装为 Windows 服务（推荐）
5. 验证：打开命令提示符，运行 `mongosh`

### Linux (Ubuntu/Debian)

```bash
# 导入公钥
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# 添加源
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 更新并安装
sudo apt-get update
sudo apt-get install -y mongodb-org

# 启动服务
sudo systemctl start mongod
sudo systemctl enable mongod

# 验证
mongosh
```

## 配置数据库

### 1. 连接到 MongoDB

```bash
mongosh
```

### 2. 创建数据库和用户（可选，推荐用于生产环境）

```javascript
// 切换到 admin 数据库
use admin

// 创建管理员用户
db.createUser({
  user: "admin",
  pwd: "your-secure-password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

// 切换到应用数据库
use media-share

// 创建应用用户
db.createUser({
  user: "media_user",
  pwd: "your-app-password",
  roles: [ { role: "readWrite", db: "media-share" } ]
})
```

### 3. 更新环境变量

如果启用了认证，更新 `backend/.env`：

```env
# 无认证（开发环境）
MONGODB_URI=mongodb://localhost:27017/media-share

# 有认证（生产环境推荐）
MONGODB_URI=mongodb://media_user:your-app-password@localhost:27017/media-share
```

## 使用 MongoDB Atlas（云数据库）

如果不想本地安装 MongoDB，可以使用免费的云服务：

1. 注册 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费集群（M0 Sandbox）
3. 配置网络访问：允许所有IP（0.0.0.0/0）或特定IP
4. 创建数据库用户
5. 获取连接字符串，格式如：
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/media-share?retryWrites=true&w=majority
   ```
6. 更新 `backend/.env` 中的 `MONGODB_URI`

## 验证连接

启动后端服务后，应该看到：

```
✅ MongoDB 已连接: localhost
🚀 服务器运行在 http://localhost:5000
```

## 常用命令

```bash
# 查看所有数据库
show dbs

# 切换数据库
use media-share

# 查看集合
show collections

# 查看用户集合
db.users.find()

# 查看文件集合
db.files.find()

# 删除集合
db.users.drop()
db.files.drop()
```

## 备份和恢复

### 备份

```bash
mongodump --db media-share --out /path/to/backup
```

### 恢复

```bash
mongorestore --db media-share /path/to/backup/media-share
```

## 生产环境建议

1. **启用认证**：创建用户并使用用户名密码连接
2. **配置副本集**：提高可用性
3. **定期备份**：设置自动备份计划
4. **监控**：使用 MongoDB Atlas 或其他监控工具
5. **索引优化**：为常用查询字段创建索引
