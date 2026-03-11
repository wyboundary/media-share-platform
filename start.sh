#!/bin/bash

echo "🚀 启动音视频分享平台..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 MongoDB
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  警告：未找到 MongoDB，请确保 MongoDB 已安装并运行"
fi

# 检查后端环境变量
if [ ! -f "backend/.env" ]; then
    echo "❌ 未找到 backend/.env 文件"
    echo "📝 请先复制 backend/.env.example 并配置环境变量"
    exit 1
fi

# 检查前端环境变量
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  未找到 frontend/.env 文件，使用默认配置"
    cp frontend/.env.example frontend/.env
fi

# 安装后端依赖
if [ ! -d "backend/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd backend && npm install && cd ..
fi

# 安装前端依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 安装前端依赖..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✅ 准备完成！"
echo ""
echo "🔧 启动后端服务 (http://localhost:5000)..."
cd backend && npm run dev &
BACKEND_PID=$!

echo "🎨 启动前端服务 (http://localhost:5173)..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ 服务已启动！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 前端地址: http://localhost:5173"
echo "🔌 后端地址: http://localhost:5000"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 等待用户中断
wait
