import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileService } from '../services/file';
import type { FileItem } from '../types/index';
import { formatFileSize, formatDate, copyToClipboard } from '../utils/format';
import toast from 'react-hot-toast';
import {
  Trash2,
  Copy,
  QrCode,
  Lock,
  Unlock,
  Eye,
  Video,
  Music,
  Edit,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [renamingFile, setRenamingFile] = useState<FileItem | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const navigate = useNavigate();

  // 提取显示用的文件名（移除时间戳和随机字符串）
  const getDisplayFileName = (filename: string): string => {
    const lastDashIndex = filename.lastIndexOf('-');
    const secondLastDashIndex = filename.lastIndexOf('-', lastDashIndex - 1);

    if (secondLastDashIndex > 0) {
      const baseName = filename.substring(0, secondLastDashIndex);
      const ext = filename.substring(filename.lastIndexOf('.'));
      return baseName + ext;
    }

    return filename;
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fileService.getMyFiles();
      setFiles(response.data.files);
    } catch (error: any) {
      toast.error('获取文件列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个文件吗？')) return;

    try {
      await fileService.deleteFile(id);
      toast.success('删除成功');
      setFiles(files.filter((f) => f.id !== id));
    } catch (error: any) {
      toast.error('删除失败');
    }
  };

  const handleTogglePermission = async (file: FileItem) => {
    try {
      await fileService.updatePermission(file.id, !file.isPublic);
      toast.success(`已设置为${!file.isPublic ? '公开' : '私有'}`);
      setFiles(
        files.map((f) =>
          f.id === file.id ? { ...f, isPublic: !f.isPublic } : f
        )
      );
    } catch (error: any) {
      toast.error('更新失败');
    }
  };

  const handleCopyLink = async (file: FileItem) => {
    const success = await copyToClipboard(file.url);
    if (success) {
      toast.success('OSS 文件链接已复制');
    } else {
      toast.error('复制失败');
    }
  };

  const handleShowQRCode = async (file: FileItem) => {
    try {
      const response = await fileService.generateQRCode(file.id);
      setQrCode(response.data.qrCode);
      setSelectedFile(file);
    } catch (error: any) {
      toast.error('生成二维码失败');
    }
  };

  const handleStartRename = (file: FileItem) => {
    // 提取文件名（不含时间戳和随机字符串）
    const filename = file.filename;
    const lastDashIndex = filename.lastIndexOf('-');
    const secondLastDashIndex = filename.lastIndexOf('-', lastDashIndex - 1);
    let baseName = filename;

    if (secondLastDashIndex > 0) {
      baseName = filename.substring(0, secondLastDashIndex);
    }

    setRenamingFile(file);
    setNewFileName(baseName);
  };

  const handleRename = async () => {
    if (!renamingFile || !newFileName.trim()) {
      toast.error('请输入新的文件名');
      return;
    }

    try {
      const response = await fileService.renameFile(renamingFile.id, newFileName.trim());
      toast.success('重命名成功');

      // 更新文件列表
      setFiles(files.map(f =>
        f.id === renamingFile.id
          ? { ...f, filename: response.data.file.filename, url: response.data.file.url }
          : f
      ));

      setRenamingFile(null);
      setNewFileName('');
    } catch (error: any) {
      toast.error(error.message || '重命名失败');
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>我的文件</h1>
        <button onClick={() => navigate('/upload')} style={styles.uploadBtn}>
          上传新文件
        </button>
      </div>

      {files.length === 0 ? (
        <div style={styles.empty}>
          <p>还没有上传任何文件</p>
          <button onClick={() => navigate('/upload')} style={styles.uploadBtn}>
            立即上传
          </button>
        </div>
      ) : (
        <div style={styles.fileList}>
          {files.map((file) => (
            <div key={file.id} style={styles.fileCard}>
              <div style={styles.fileIcon}>
                {file.fileType === 'video' ? (
                  <Video size={32} color="#2563eb" />
                ) : (
                  <Music size={32} color="#2563eb" />
                )}
              </div>

              <div style={styles.fileInfo}>
                <h3 style={styles.fileName}>{getDisplayFileName(file.filename)}</h3>
                <div style={styles.fileMeta}>
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span>•</span>
                  <span>{formatDate(file.createdAt)}</span>
                  <span>•</span>
                  <span style={styles.stats}>
                    <Eye size={14} /> {file.viewCount}
                  </span>
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  onClick={() => handleTogglePermission(file)}
                  style={styles.actionBtn}
                  title={file.isPublic ? '设为私有' : '设为公开'}
                >
                  {file.isPublic ? <Unlock size={18} /> : <Lock size={18} />}
                </button>

                <button
                  onClick={() => handleCopyLink(file)}
                  style={styles.actionBtn}
                  title="复制 OSS 文件链接"
                >
                  <Copy size={18} />
                </button>

                <button
                  onClick={() => handleShowQRCode(file)}
                  style={styles.actionBtn}
                  title="生成二维码"
                >
                  <QrCode size={18} />
                </button>

                <button
                  onClick={() => handleStartRename(file)}
                  style={styles.actionBtn}
                  title="重命名"
                >
                  <Edit size={18} />
                </button>

                <button
                  onClick={() => handleDelete(file.id)}
                  style={{ ...styles.actionBtn, color: '#dc2626' }}
                  title="删除"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 二维码模态框 */}
      {qrCode && selectedFile && (
        <div style={styles.modal} onClick={() => setQrCode(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>{getDisplayFileName(selectedFile.filename)}</h3>
            <img src={qrCode} alt="QR Code" style={styles.qrImage} />
            <p style={styles.modalText}>扫描二维码直接访问 OSS 文件</p>
            <button onClick={() => setQrCode(null)} style={styles.closeBtn}>
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 重命名对话框 */}
      {renamingFile && (
        <div style={styles.modal} onClick={() => setRenamingFile(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>重命名文件</h3>
            <p style={styles.modalText}>当前文件名：{getDisplayFileName(renamingFile.filename)}</p>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="输入新的文件名（不含扩展名）"
              style={styles.input}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleRename();
                }
              }}
            />
            <div style={styles.modalActions}>
              <button onClick={() => setRenamingFile(null)} style={styles.cancelBtn}>
                取消
              </button>
              <button onClick={handleRename} style={styles.confirmBtn}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem',
    backgroundColor: '#f3f4f6',
  },
  loading: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  uploadBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  empty: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  fileList: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fileCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  fileIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: '1.125rem',
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  fileMeta: {
    display: 'flex',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    alignItems: 'center',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    color: '#374151',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
    maxWidth: '400px',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1f2937',
  },
  qrImage: {
    width: '300px',
    height: '300px',
    margin: '1rem auto',
  },
  modalText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem',
  },
  closeBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default Dashboard;
