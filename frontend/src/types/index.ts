export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export interface FileItem {
  id: string;
  filename: string;
  fileType: 'audio' | 'video';
  fileSize: number;
  url: string;
  isPublic: boolean;
  viewCount: number;
  scanCount: number;
  createdAt: string;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  data: {
    file: FileItem;
  };
}

export interface FilesResponse {
  success: boolean;
  data: {
    files: FileItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface QRCodeResponse {
  success: boolean;
  data: {
    qrCode: string;
    playUrl: string;
  };
}
