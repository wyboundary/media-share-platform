import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Setting from '../models/Setting';

// 获取用户的 OSS 设置
export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await Setting.findOne({ userId: req.user!._id });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: '未找到 OSS 配置，请先配置',
      });
    }

    // 不返回敏感信息的完整内容，AccessKeySecret 只显示部分
    res.json({
      success: true,
      data: {
        settings: {
          ossRegion: settings.ossRegion,
          ossAccessKeyId: settings.ossAccessKeyId,
          ossAccessKeySecret: settings.ossAccessKeySecret.substring(0, 8) + '***',
          ossBucket: settings.ossBucket,
          ossDomain: settings.ossDomain,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '获取设置失败',
    });
  }
};

// 更新或创建用户的 OSS 设置
export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { ossRegion, ossAccessKeyId, ossAccessKeySecret, ossBucket, ossDomain } = req.body;

    // 验证必填字段
    if (!ossRegion || !ossAccessKeyId || !ossAccessKeySecret || !ossBucket || !ossDomain) {
      return res.status(400).json({
        success: false,
        message: '所有字段都是必填的',
      });
    }

    // 查找或创建设置
    let settings = await Setting.findOne({ userId: req.user!._id });

    if (settings) {
      // 更新现有设置
      settings.ossRegion = ossRegion;
      settings.ossAccessKeyId = ossAccessKeyId;
      settings.ossAccessKeySecret = ossAccessKeySecret;
      settings.ossBucket = ossBucket;
      settings.ossDomain = ossDomain;
      await settings.save();
    } else {
      // 创建新设置
      settings = await Setting.create({
        userId: req.user!._id,
        ossRegion,
        ossAccessKeyId,
        ossAccessKeySecret,
        ossBucket,
        ossDomain,
      });
    }

    res.json({
      success: true,
      message: 'OSS 配置已保存',
      data: {
        settings: {
          ossRegion: settings.ossRegion,
          ossAccessKeyId: settings.ossAccessKeyId,
          ossAccessKeySecret: settings.ossAccessKeySecret.substring(0, 8) + '***',
          ossBucket: settings.ossBucket,
          ossDomain: settings.ossDomain,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '保存设置失败',
    });
  }
};
