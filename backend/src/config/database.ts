import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`✅ MongoDB 已连接: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB 连接错误: ${error}`);
    process.exit(1);
  }
};
