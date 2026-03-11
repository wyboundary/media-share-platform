import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileService } from '../services/file';
import toast from 'react-hot-toast';
import { Upload as UploadIcon, File as FileIcon } from 'lucide-react';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // 检查文件类型
      if (!selectedFile.type.startsWith('audio/') && !selectedFile.type.startsWith('video/')) {
        toast.error('只支持音频和视频文件');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      if (!droppedFile.type.startsWith('audio/') && !droppedFile.type.startsWith('video/')) {
        toast.error('只支持音频和视频文件');
        return;
      }

      setFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('请选择文件');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      await fileService.uploadFile(file, (progress) => {
        setProgress(progress);
      });

      toast.success('上传成功！');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || '上传失败');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>上传文件</h2>

        <div
          style={styles.dropzone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {file ? (
            <div style={styles.fileInfo}>
              <FileIcon size={48} color="#2563eb" />
              <p style={styles.fileName}>{file.name}</p>
              <p style={styles.fileSize}>
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div style={styles.uploadPrompt}>
              <UploadIcon size={48} color="#9ca3af" />
              <p style={styles.promptText}>点击或拖拽文件到此处上传</p>
              <p style={styles.promptSubtext}>支持音频和视频文件</p>
            </div>
          )}
        </div>

        {uploading && (
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
            <p style={styles.progressText}>{progress}%</p>
          </div>
        )}

        <div style={styles.actions}>
          {file && !uploading && (
            <button onClick={() => setFile(null)} style={styles.clearBtn}>
              清除
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              ...styles.uploadBtn,
              opacity: !file || uploading ? 0.5 : 1,
              cursor: !file || uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? '上传中...' : '开始上传'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem',
    backgroundColor: '#f3f4f6',
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#1f2937',
  },
  dropzone: {
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    padding: '3rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    backgroundColor: '#f9fafb',
  },
  fileInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  fileName: {
    fontSize: '1.125rem',
    fontWeight: '500',
    color: '#1f2937',
    marginTop: '0.5rem',
  },
  fileSize: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  uploadPrompt: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  promptText: {
    fontSize: '1.125rem',
    color: '#4b5563',
    marginTop: '0.5rem',
  },
  promptSubtext: {
    fontSize: '0.875rem',
    color: '#9ca3af',
  },
  progressContainer: {
    marginTop: '1.5rem',
  },
  progressBar: {
    width: '100%',
    height: '0.5rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    transition: 'width 0.3s',
  },
  progressText: {
    textAlign: 'center',
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    justifyContent: 'flex-end',
  },
  clearBtn: {
    padding: '0.75rem 1.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  uploadBtn: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.375rem',
    backgroundColor: '#2563eb',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
};

export default Upload;
