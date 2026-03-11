import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middlewares/auth';

// 生成 JWT Token
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  // @ts-ignore - JWT types issue with expiresIn
  return jwt.sign({ id }, secret, {
    expiresIn: '7d'
  });
};

// 注册用户
export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供完整的注册信息'
      });
    }

    // 创建用户
    const user = await User.create({
      username,
      email,
      password
    });

    // 生成 token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || '注册失败'
    });
  }
};

// 用户登录
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供邮箱和密码'
      });
    }

    // 查找用户（包含密码字段）
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 验证密码
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 生成 token
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || '登录失败'
    });
  }
};

// 获取当前用户信息
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: {
        user: {
          id: user?._id,
          username: user?.username,
          email: user?.email,
          createdAt: user?.createdAt
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || '获取用户信息失败'
    });
  }
};
