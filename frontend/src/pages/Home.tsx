import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Shield, QrCode, BarChart3 } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>音视频分享平台</h1>
        <p style={styles.heroSubtitle}>
          轻松上传、分享和管理您的音视频文件
        </p>
        <div style={styles.heroActions}>
          <Link to="/register" style={styles.primaryBtn}>
            立即开始
          </Link>
          <Link to="/login" style={styles.secondaryBtn}>
            登录
          </Link>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>
            <Upload size={32} />
          </div>
          <h3 style={styles.featureTitle}>简单上传</h3>
          <p style={styles.featureText}>
            支持拖拽上传，快速将音视频文件上传到云端
          </p>
        </div>

        <div style={styles.feature}>
          <div style={styles.featureIcon}>
            <QrCode size={32} />
          </div>
          <h3 style={styles.featureTitle}>二维码分享</h3>
          <p style={styles.featureText}>
            一键生成二维码，扫码即可播放，分享更便捷
          </p>
        </div>

        <div style={styles.feature}>
          <div style={styles.featureIcon}>
            <Shield size={32} />
          </div>
          <h3 style={styles.featureTitle}>权限控制</h3>
          <p style={styles.featureText}>
            灵活设置文件公开或私有，保护您的隐私
          </p>
        </div>

        <div style={styles.feature}>
          <div style={styles.featureIcon}>
            <BarChart3 size={32} />
          </div>
          <h3 style={styles.featureTitle}>访问统计</h3>
          <p style={styles.featureText}>
            实时统计文件播放次数和扫码次数
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: 'calc(100vh - 80px)',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#f9fafb',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#6b7280',
    marginBottom: '2rem',
  },
  heroActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  primaryBtn: {
    padding: '0.875rem 2rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1.125rem',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-block',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondaryBtn: {
    padding: '0.875rem 2rem',
    backgroundColor: 'white',
    color: '#2563eb',
    border: '2px solid #2563eb',
    borderRadius: '0.375rem',
    fontSize: '1.125rem',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-block',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  features: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  feature: {
    textAlign: 'center',
    padding: '2rem',
  },
  featureIcon: {
    display: 'inline-flex',
    padding: '1rem',
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    borderRadius: '50%',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  featureText: {
    fontSize: '1rem',
    color: '#6b7280',
  },
};

export default Home;
