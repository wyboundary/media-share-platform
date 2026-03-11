import { Response } from 'express';
import File from '../models/File';
import { getOSSClientForUser, getOSSSettingsForUser } from '../config/oss';
import QRCode from 'qrcode';
import { AuthRequest } from '../middlewares/auth';
import path from 'path';

// 上传文件到OSS
export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件'
      });
    }

    const file = req.file;
    const userId = req.user.id;

    // 检查文件类型
    const fileType = file.mimetype.startsWith('audio/') ? 'audio' :
                     file.mimetype.startsWith('video/') ? 'video' : null;

    if (!fileType) {
      return res.status(400).json({
        success: false,
        message: '只支持音频和视频文件'
      });
    }

    // 生成唯一文件名（保留原始文件名）
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    // 格式：原始文件名-时间戳-随机.扩展名
    const filename = `${baseName}-${timestamp}-${randomStr}${ext}`;

    // 上传到阿里云OSS（使用用户自己的配置）
    const ossClient = await getOSSClientForUser(userId);
    const ossSettings = await getOSSSettingsForUser(userId);
    const result = await ossClient.put(filename, file.buffer);

    // 构建完整的 OSS URL
    const ossUrl = `${ossSettings.domain}/${filename}`;

    // 保存文件信息到数据库
    const newFile = await File.create({
      filename: result.name,
      originalName: file.originalname,
      fileType,
      mimeType: file.mimetype,
      fileSize: file.size,
      ossUrl: ossUrl,
      ossKey: result.name,
      owner: userId,
      isPublic: true
    });

    res.status(201).json({
      success: true,
      message: '文件上传成功',
      data: {
        file: {
          id: newFile._id,
          filename: newFile.filename,
          fileType: newFile.fileType,
          fileSize: newFile.fileSize,
          url: newFile.ossUrl,
          isPublic: newFile.isPublic,
          createdAt: newFile.createdAt
        }
      }
    });
  } catch (error: any) {
    console.error('上传失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '文件上传失败'
    });
  }
};

// 获取用户的文件列表
export const getMyFiles = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const files = await File.find({ owner: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await File.countDocuments({ owner: userId });

    res.json({
      success: true,
      data: {
        files: files.map(file => ({
          id: file._id,
          filename: file.filename,
          fileType: file.fileType,
          fileSize: file.fileSize,
          url: file.ossUrl,
          isPublic: file.isPublic,
          viewCount: file.viewCount,
          scanCount: file.scanCount,
          createdAt: file.createdAt
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '获取文件列表失败'
    });
  }
};

// 获取单个文件信息
export const getFile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id).populate('owner', 'username');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 检查权限：私有文件只能所有者访问
    if (!file.isPublic && file.owner._id.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: '无权访问此文件'
      });
    }

    res.json({
      success: true,
      data: {
        file: {
          id: file._id,
          filename: file.filename,
          fileType: file.fileType,
          fileSize: file.fileSize,
          url: file.ossUrl,
          isPublic: file.isPublic,
          viewCount: file.viewCount,
          scanCount: file.scanCount,
          owner: file.owner,
          createdAt: file.createdAt
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '获取文件信息失败'
    });
  }
};

// 更新文件权限
export const updateFilePermission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 检查权限
    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权修改此文件'
      });
    }

    file.isPublic = isPublic;
    await file.save();

    res.json({
      success: true,
      message: '权限更新成功',
      data: {
        file: {
          id: file._id,
          isPublic: file.isPublic
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '更新失败'
    });
  }
};

// 重命名文件
export const renameFile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName || !newName.trim()) {
      return res.status(400).json({
        success: false,
        message: '请提供新的文件名'
      });
    }

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 检查权限
    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权修改此文件'
      });
    }

    const ossClient = await getOSSClientForUser(req.user.id);
    const ossSettings = await getOSSSettingsForUser(req.user.id);

    // 生成新的 OSS 文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.filename);
    const baseName = newName.trim();
    const newOssKey = `${baseName}-${timestamp}-${randomStr}${ext}`;

    try {
      // 复制文件到新名称
      await ossClient.copy(newOssKey, file.ossKey);

      // 删除旧文件
      await ossClient.delete(file.ossKey);

      // 更新数据库
      file.filename = newOssKey;
      file.originalName = baseName + ext;

      // 获取新的 URL
      const newUrl = `${ossSettings.domain}/${newOssKey}`;
      file.ossUrl = newUrl;
      file.ossKey = newOssKey;

      await file.save();

      res.json({
        success: true,
        message: '重命名成功',
        data: {
          file: {
            id: file._id,
            filename: file.filename,
            url: file.ossUrl
          }
        }
      });
    } catch (ossError: any) {
      console.error('OSS 操作失败:', ossError);
      return res.status(500).json({
        success: false,
        message: 'OSS 文件重命名失败'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '重命名失败'
    });
  }
};

// 删除文件
export const deleteFile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 检查权限
    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权删除此文件'
      });
    }

    // 从OSS删除文件（使用用户自己的配置）
    const ossClient = await getOSSClientForUser(req.user.id);
    await ossClient.delete(file.ossKey);

    // 从数据库删除
    await File.findByIdAndDelete(id);

    res.json({
      success: true,
      message: '文件删除成功'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '删除失败'
    });
  }
};

// 生成二维码
export const generateQRCode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 检查权限
    if (!file.isPublic && file.owner.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: '无权访问此文件'
      });
    }

    // 更新扫码次数
    file.scanCount += 1;
    await file.save();

    // 使用 OSS 直链
    const playUrl = file.ossUrl;

    // 生成二维码（Base64格式）
    const qrCode = await QRCode.toDataURL(playUrl, {
      width: 300,
      margin: 2
    });

    res.json({
      success: true,
      data: {
        qrCode,
        playUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '生成二维码失败'
    });
  }
};

// 播放文件（公开访问）
export const playFile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 检查是否公开
    if (!file.isPublic) {
      return res.status(403).json({
        success: false,
        message: '此文件为私有，无法访问'
      });
    }

    // 更新播放次数
    file.viewCount += 1;
    await file.save();

    res.json({
      success: true,
      data: {
        file: {
          id: file._id,
          filename: file.filename,
          fileType: file.fileType,
          url: file.ossUrl,
          viewCount: file.viewCount
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '获取文件失败'
    });
  }
};
