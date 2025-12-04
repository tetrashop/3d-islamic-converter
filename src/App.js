import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Upload, Download, RefreshCw, Eye, Settings, CheckCircle, AlertCircle, Box } from 'lucide-react';
import './styles/islamic-theme.css';

const ModelViewer3D = lazy(() => import('./components/ModelViewer3D'));
const FileConverter = lazy(() => import('./components/FileConverter'));

function App() {
  const [activeTab, setActiveTab] = useState('converter');
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setWebGLAvailable(!!gl);
    
    setTimeout(() => {
      addNotification('success', 'به مبدل سه‌بعدی اسلامی خوش آمدید! 🕌');
    }, 1000);
  }, []);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="header-logo">
              <div className="logo-icon">
                <Box size={40} />
              </div>
              <div className="logo-text">
                <h1 className="title">مبدل سه‌بعدی اسلامی</h1>
                <p className="subtitle">تبدیل و نمایش فایل‌های سه‌بعدی با معماری اسلامی</p>
              </div>
            </div>
            
            <div className="header-tabs">
              <button
                onClick={() => setActiveTab('converter')}
                className={`tab-button ${activeTab === 'converter' ? 'active' : ''}`}
              >
                <div className="tab-button-content">
                  <Settings size={20} />
                  مبدل فرمت
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('viewer')}
                className={`tab-button ${activeTab === 'viewer' ? 'active' : ''}`}
              >
                <div className="tab-button-content">
                  <Eye size={20} />
                  نمایشگر 3D
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="notifications-container">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification ${notification.type}`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="notification-icon success" size={24} />
            ) : (
              <AlertCircle className="notification-icon error" size={24} />
            )}
            <span className="notification-message">{notification.message}</span>
          </div>
        ))}
      </div>

      <main className="main-content">
        {activeTab === 'converter' ? (
          <Suspense fallback={<LoadingSpinner text="در حال بارگذاری مبدل..." />}>
            <FileConverter onNotification={addNotification} />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingSpinner text="در حال بارگذاری نمایشگر..." />}>
            <ModelViewer3D webGLAvailable={webGLAvailable} />
          </Suspense>
        )}
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>📦 فرمت‌های پشتیبانی شده</h3>
              <div className="formats-list">
                <div className="format-item">
                  <span className="format-badge obj">OBJ</span>
                  <span>مدل‌های سه‌بعدی</span>
                </div>
                <div className="format-item">
                  <span className="format-badge stl">STL</span>
                  <span>چاپ سه‌بعدی</span>
                </div>
                <div className="format-item">
                  <span className="format-badge glb">GLB</span>
                  <span>گرافیک وب</span>
                </div>
              </div>
            </div>
            
            <div className="footer-section">
              <h3>⚡ ویژگی‌ها</h3>
              <ul className="features-list">
                <li>
                  <CheckCircle size={18} className="feature-icon" />
                  <span>تبدیل بدون اتلاف کیفیت</span>
                </li>
                <li>
                  <CheckCircle size={18} className="feature-icon" />
                  <span>نمایشگر WebGL کم‌مصرف</span>
                </li>
                <li>
                  <CheckCircle size={18} className="feature-icon" />
                  <span>رابط کاربری فارسی اسلامی</span>
                </li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>🕌 درباره پروژه</h3>
              <p className="about-text">
                این پروژه با هدف ترویج هنر و معماری اسلامی در فضای دیجیتال ایجاد شده است.
                از فناوری‌های مدرن برای نمایش و تبدیل مدل‌های سه‌بعدی استفاده می‌کند.
              </p>
              <button className="footer-button">
                <a href="/docs" className="button-link">
                  <Download size={18} />
                  مستندات پروژه
                </a>
              </button>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© ۱۴۰۲ - تمامی حقوق برای پروژه مبدل سه‌بعدی اسلامی محفوظ است</p>
            <p>طراحی شده با ❤️ برای جامعه اسلامی</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoadingSpinner({ text }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
}

export default App;
