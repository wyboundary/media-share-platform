#!/usr/bin/env node

/**
 * Railway 部署诊断脚本
 * 检查所有必需的环境变量
 */

console.log('\n🔍 Railway 环境变量检查\n');
console.log('='.repeat(60));

const requiredVars = {
  'NODE_ENV': process.env.NODE_ENV,
  'PORT': process.env.PORT,
  'MONGODB_URI': process.env.MONGODB_URI ? '已设置 ✓' : '未设置 ✗',
  'JWT_SECRET': process.env.JWT_SECRET ? '已设置 ✓' : '未设置 ✗',
  'MAX_FILE_SIZE': process.env.MAX_FILE_SIZE,
};

console.log('\n📋 环境变量状态：\n');

let allGood = true;
for (const [key, value] of Object.entries(requiredVars)) {
  const status = value ? '✓' : '✗';
  console.log(`  ${status} ${key}: ${value || '未设置'}`);
  if (!value) allGood = false;
}

console.log('\n' + '='.repeat(60));

if (allGood) {
  console.log('\n✅ 所有环境变量配置正确！\n');
  process.exit(0);
} else {
  console.log('\n❌ 有环境变量缺失，请在 Railway 中配置\n');
  process.exit(1);
}
