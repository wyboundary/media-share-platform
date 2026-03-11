import api from './api';
import type { UploadResponse, FilesResponse, FileItem, QRCodeResponse } from '../types/index';

export const fileService = {
  // 上传文件
  uploadFile: async (file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  // 获取我的文件列表
  getMyFiles: async (page: number = 1, limit: number = 10): Promise<FilesResponse> => {
    return api.get(`/files/my-files?page=${page}&limit=${limit}`);
  },

  // 获取单个文件信息
  getFile: async (id: string): Promise<{ success: boolean; data: { file: FileItem } }> => {
    return api.get(`/files/${id}`);
  },

  // 更新文件权限
  updatePermission: async (id: string, isPublic: boolean): Promise<{ success: boolean }> => {
    return api.put(`/files/${id}/permission`, { isPublic });
  },

  // 删除文件
  deleteFile: async (id: string): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/files/${id}`);
  },

  // 重命名文件
  renameFile: async (id: string, newName: string): Promise<{ success: boolean; message: string; data: { file: { id: string; filename: string; url: string } } }> => {
    return api.put(`/files/${id}/rename`, { newName });
  },

  // 生成二维码
  generateQRCode: async (id: string): Promise<QRCodeResponse> => {
    return api.get(`/files/${id}/qrcode`);
  },

  // 播放文件（公开访问）
  playFile: async (id: string): Promise<{ success: boolean; data: { file: FileItem } }> => {
    return api.get(`/files/play/${id}`);
  },
};
