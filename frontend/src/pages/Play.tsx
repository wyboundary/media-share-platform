import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fileService } from '../services/file';
import type { FileItem } from '../types/index';
import { formatFileSize } from '../utils/format';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';

const Play: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<FileItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchFile(id);
    }
  }, [id]);

  const fetchFile = async (fileId: string) => {
    try {
      const response = await fileService.playFile(fileId);
      setFile(response.data.file);
    } catch (error: any) {
      setError(error.message || '文件不存在或无法访问');
      toast.error(error.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>加载中...</div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>😔 无法播放</h2>
          <p>{error || '文件不存在'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{file.filename}</h2>

        <div style={styles.playerContainer}>
          {file.fileType === 'video' ? (
            <video
              controls
              style={styles.video}
              src={file.url}
              autoPlay
            >
              您的浏览器不支持视频播放
            </video>
          ) : (
            <audio
              controls
              style={styles.audio}
              src={file.url}
              autoPlay
            >
              您的浏览器不支持音频播放
            </audio>
          )}
        </div>

        <div style={styles.info}>
          <div style={styles.infoItem}>
            <span style={styles.label}>文件大小：</span>
            <span>{formatFileSize(file.fileSize)}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.label}>播放次数：</span>
            <span style={styles.viewCount}>
              <Eye size={16} /> {file.viewCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    fontSize: '1.25rem',
    color: '#6b7280',
  },
  error: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    width: '100%',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#1f2937',
    textAlign: 'center',
  },
  playerContainer: {
    marginBottom: '1.5rem',
  },
  video: {
    width: '100%',
    maxHeight: '500px',
    borderRadius: '0.5rem',
  },
  audio: {
    width: '100%',
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.375rem',
  },
  infoItem: {
    display: 'flex',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
  },
  viewCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
};

export default Play;
