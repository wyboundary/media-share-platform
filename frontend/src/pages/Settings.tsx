import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingService } from '../services/setting';
import type { OSSSettings } from '../services/setting';
import toast from 'react-hot-toast';
import { Save, ArrowLeft } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<OSSSettings>({
    ossRegion: '',
    ossAccessKeyId: '',
    ossAccessKeySecret: '',
    ossBucket: '',
    ossDomain: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingService.getSettings();
      setSettings(response.data.settings);
    } catch (error: any) {
      // 如果没有配置过，不显示错误
      if (error.response?.status !== 404) {
        toast.error('获取设置失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OSSSettings, value: string) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 验证所有字段
    if (!settings.ossRegion || !settings.ossAccessKeyId ||
        !settings.ossAccessKeySecret || !settings.ossBucket || !settings.ossDomain) {
      toast.error('请填写所有字段');
      return;
    }

    setSaving(true);
    try {
      await settingService.updateSettings(settings);
      toast.success('设置保存成功');
    } catch (error: any) {
      toast.error(error.message || '保存失败');
    } finally {
      setSaving(false);
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
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={20} />
          返回
        </button>
        <h1 style={styles.title}>阿里云 OSS 设置</h1>
      </div>

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Region（地域节点）
              <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={settings.ossRegion}
              onChange={(e) => handleChange('ossRegion', e.target.value)}
              placeholder="例如：oss-cn-beijing"
              style={styles.input}
            />
            <p style={styles.hint}>阿里云 OSS 的地域节点，如 oss-cn-beijing、oss-cn-hangzhou</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Access Key ID
              <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={settings.ossAccessKeyId}
              onChange={(e) => handleChange('ossAccessKeyId', e.target.value)}
              placeholder="输入 Access Key ID"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Access Key Secret
              <span style={styles.required}>*</span>
            </label>
            <input
              type="password"
              value={settings.ossAccessKeySecret}
              onChange={(e) => handleChange('ossAccessKeySecret', e.target.value)}
              placeholder="输入 Access Key Secret"
              style={styles.input}
            />
            <p style={styles.hint}>密钥将被安全加密存储</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Bucket 名称
              <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={settings.ossBucket}
              onChange={(e) => handleChange('ossBucket', e.target.value)}
              placeholder="例如：my-bucket"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              OSS 域名
              <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={settings.ossDomain}
              onChange={(e) => handleChange('ossDomain', e.target.value)}
              placeholder="例如：https://my-bucket.oss-cn-beijing.aliyuncs.com"
              style={styles.input}
            />
            <p style={styles.hint}>完整的 OSS 访问域名，包括 https://</p>
          </div>

          <button type="submit" disabled={saving} style={styles.submitBtn}>
            <Save size={18} />
            {saving ? '保存中...' : '保存设置'}
          </button>
        </form>
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
  loading: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    maxWidth: '800px',
    margin: '0 auto 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  backBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#374151',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  formCard: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
  },
  required: {
    color: '#dc2626',
    marginLeft: '0.25rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  hint: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  submitBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
  },
};

export default Settings;
