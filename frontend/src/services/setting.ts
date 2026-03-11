import api from './api';

export interface OSSSettings {
  ossRegion: string;
  ossAccessKeyId: string;
  ossAccessKeySecret: string;
  ossBucket: string;
  ossDomain: string;
}

export const settingService = {
  // 获取 OSS 设置
  getSettings: async (): Promise<{ success: boolean; data: { settings: OSSSettings } }> => {
    return api.get('/settings');
  },

  // 更新 OSS 设置
  updateSettings: async (settings: OSSSettings): Promise<{ success: boolean; message: string }> => {
    return api.put('/settings', settings);
  },
};
