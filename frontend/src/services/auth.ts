import api from './api';
import type { AuthResponse, User } from '../types/index';

export const authService = {
  // 注册
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    return api.post('/auth/register', { username, email, password });
  },

  // 登录
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // 获取当前用户
  getCurrentUser: async (): Promise<{ success: boolean; data: { user: User } }> => {
    return api.get('/auth/me');
  },

  // 获取本地存储的用户信息
  getLocalUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
