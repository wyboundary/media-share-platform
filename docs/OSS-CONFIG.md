# 阿里云OSS配置指南

## 1. 创建OSS Bucket

1. 登录[阿里云控制台](https://oss.console.aliyun.com/)
2. 点击"创建 Bucket"
3. 填写配置：
   - **Bucket 名称**：全局唯一，如 `my-media-share`
   - **地域**：选择离您用户最近的地域，如 `华东1（杭州）`
   - **存储类型**：标准存储
   - **读写权限**：公共读（允许匿名用户读取文件）
   - **版本控制**：关闭（可选）
   - **服务器端加密**：无（可选）

## 2. 获取访问密钥

1. 点击右上角头像 → AccessKey 管理
2. 建议创建 RAM 用户并授予 OSS 权限（更安全）
3. 记录 `AccessKey ID` 和 `AccessKey Secret`

### 推荐：使用 RAM 用户（更安全）

1. 进入 [RAM 控制台](https://ram.console.aliyun.com/)
2. 创建用户 → 勾选"编程访问"
3. 保存 AccessKey
4. 为用户授权：`AliyunOSSFullAccess` 或自定义 OSS 权限策略

## 3. 配置跨域（CORS）

为了允许前端直接访问 OSS 文件，需要配置 CORS：

1. 进入 Bucket → 权限管理 → 跨域设置
2. 创建规则：
   ```
   来源：* （或指定您的域名，如 https://yourdomain.com）
   允许 Methods：GET, POST, PUT, DELETE, HEAD
   允许 Headers：*
   暴露 Headers：ETag, x-oss-request-id
   缓存时间：600
   ```

## 4. 获取 OSS 域名

在 Bucket 概览页面可以看到：
- **外网访问域名**：如 `https://my-media-share.oss-cn-hangzhou.aliyuncs.com`
- 也可以绑定自定义域名（需要备案）

## 5. 填写环境变量

将获取的信息填入后端 `.env` 文件：

```env
OSS_REGION=oss-cn-hangzhou
OSS_ACCESS_KEY_ID=LTAI5xxxxxxxxxx
OSS_ACCESS_KEY_SECRET=xxxxxxxxxxxxxx
OSS_BUCKET=my-media-share
OSS_DOMAIN=https://my-media-share.oss-cn-hangzhou.aliyuncs.com
```

## 6. 安全建议

### 生产环境建议

1. **使用 RAM 用户**：不要使用主账号 AccessKey
2. **最小权限原则**：只授予必要的 OSS 权限
3. **配置防盗链**：
   - Bucket → 权限管理 → 防盗链
   - 添加白名单域名
4. **启用访问日志**：便于追踪和审计
5. **设置生命周期规则**：自动删除过期文件，节省费用

### RAM 权限策略示例

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "oss:PutObject",
        "oss:GetObject",
        "oss:DeleteObject",
        "oss:ListObjects"
      ],
      "Resource": [
        "acs:oss:*:*:my-media-share/*"
      ]
    }
  ]
}
```

## 7. 费用说明

阿里云 OSS 按量计费，主要费用包括：
- **存储费用**：根据存储量计费
- **流量费用**：外网下行流量（播放时产生）
- **请求费用**：API 请求次数

建议：
- 新用户有免费额度
- 使用 CDN 可以降低流量费用
- 设置生命周期规则自动删除旧文件

## 8. 常见问题

### Q: 上传文件时报错"AccessDenied"
A: 检查 AccessKey 是否正确，RAM 用户是否有 OSS 权限

### Q: 前端无法访问 OSS 文件
A: 检查 Bucket 是否设置为"公共读"，CORS 是否配置正确

### Q: 如何绑定自定义域名？
A: Bucket → 传输管理 → 域名管理 → 绑定自定义域名（需要域名备案）

## 9. 测试配置

配置完成后，可以通过以下方式测试：

1. 启动后端服务
2. 使用 Postman 或浏览器访问 `/api/health` 检查服务状态
3. 上传一个测试文件
4. 访问返回的 OSS URL 确认文件可以访问

---

**重要提示**：请妥善保管 AccessKey，不要将其提交到代码仓库！
