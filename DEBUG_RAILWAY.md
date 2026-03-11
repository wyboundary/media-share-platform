# Railway 后端检查步骤

## 1. 检查 Railway 后端状态

1. 登录 https://railway.app/
2. 进入你的项目
3. 点击后端服务
4. 查看状态是否为 "Active"（绿色）
5. 查看最近的部署日志，确认看到：
   ```
   🚀 服务器运行在 http://localhost:8080
   ✅ MongoDB 已连接
   ```

## 2. 获取后端 URL

在后端服务页面：
- 方法 A：顶部会显示一个公开 URL
- 方法 B：Settings → Networking → Domains

应该类似：`https://xxx.up.railway.app`

## 3. 测试后端 API

在浏览器中访问：
```
https://你的Railway后端URL/api/health
```

**应该返回**：
```json
{
  "status": "ok",
  "message": "服务运行正常"
}
```

如果返回错误或无法访问，说明后端有问题。
