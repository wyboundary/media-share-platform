import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Upload, Home, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          媒体分享平台
        </Link>

        <div style={styles.menu}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={styles.link}>
                <Home size={18} />
                <span style={styles.linkText}>首页</span>
              </Link>
              <Link to="/upload" style={styles.link}>
                <Upload size={18} />
                <span style={styles.linkText}>上传</span>
              </Link>
              <Link to="/settings" style={styles.link}>
                <Settings size={18} />
                <span style={styles.linkText}>设置</span>
              </Link>
              <div style={styles.userInfo}>
                <span style={styles.username}>{user?.username}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                登录
              </Link>
              <Link to="/register" style={styles.link}>
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'opacity 0.2s',
    cursor: 'pointer',
  },
  linkText: {
    fontSize: '0.95rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    fontSize: '0.95rem',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.2s',
  },
};

export default Navbar;
