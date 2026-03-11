#!/usr/bin/env node

/**
 * 生成随机的 JWT Secret
 * 用于 Railway 环境变量配置
 */

const crypto = require('crypto');

console.log('\n🔑 JWT Secret 生成器\n');
console.log('='.repeat(60));

// 生成 32 字节的随机字符串
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n你的 JWT_SECRET：');
console.log('\x1b[32m%s\x1b[0m', secret);
console.log('\n='.repeat(60));
console.log('\n📋 复制上面的字符串');
console.log('💡 在 Railway 后端服务的 Variables 中添加：');
console.log('   变量名: JWT_SECRET');
console.log('   变量值: (上面生成的字符串)');
console.log('\n');
