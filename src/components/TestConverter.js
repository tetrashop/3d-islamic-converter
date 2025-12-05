import React, { useState } from 'react';

const TestConverter = () => {
  const [log, setLog] = useState([]);
  const [fileCount, setFileCount] = useState(0);

  const addLog = (message) => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 10)]);
  };

  // ساده‌ترین تابع آپلود
  const handleFileSelect = (event) => {
    const files = event.target.files;
    addLog(`رویداد onChange فعال شد. ${files.length} فایل انتخاب شد`);
    
    if (files.length === 0) {
      addLog('هیچ فایلی انتخاب نشد');
      return;
    }

    // نمایش اطلاعات هر فایل
    Array.from(files).forEach((file, index) => {
      addLog(`فایل ${index + 1}: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    });

    setFileCount(files.length);
    event.target.value = ''; // ریست input
  };

  // تست ساده کلیک
  const handleTestClick = () => {
    addLog('دکمه تست کلیک شد');
    document.getElementById('hidden-file-input').click();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#1a5e25' }}>تست قطعی آپلود فایل</h1>
      
      {/* لاگ رویدادها */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <h3>لاگ رویدادها:</h3>
        {log.length === 0 ? (
          <p style={{ color: '#666' }}>هنوز رویدادی ثبت نشده است...</p>
        ) : (
          log.map((item, index) => (
            <div key={index} style={{ 
              padding: '5px 0', 
              borderBottom: '1px solid #ddd',
              fontSize: '14px'
            }}>
              {item}
            </div>
          ))
        )}
      </div>

      {/* وضعیت */}
      <div style={{ 
        background: fileCount > 0 ? '#e8f5e9' : '#fff3cd',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `2px solid ${fileCount > 0 ? '#4caf50' : '#ffc107'}`
      }}>
        <h3>وضعیت فعلی:</h3>
        <p>تعداد فایل‌های انتخاب‌شده: <strong>{fileCount}</strong></p>
        <p>آخرین رویداد: {log[0] || 'هیچ'}</p>
      </div>

      {/* روش ۱: دکمه با label */}
      <div style={{ marginBottom: '20px' }}>
        <h3>روش ۱: استفاده از label</h3>
        <label style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#1a5e25',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          انتخاب فایل (روش ۱)
          <input
            type="file"
            accept=".obj,.stl,.glb"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </label>
        <span style={{ color: '#666' }}>← مستقیم روی label کلیک کنید</span>
      </div>

      {/* روش ۲: دکمه با onClick */}
      <div style={{ marginBottom: '20px' }}>
        <h3>روش ۲: دکمه با onClick</h3>
        <button
          onClick={handleTestClick}
          style={{
            padding: '12px 24px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          انتخاب فایل (روش ۲)
        </button>
        <input
          id="hidden-file-input"
          type="file"
          accept=".obj,.stl,.glb"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <span style={{ color: '#666' }}>← دکمه را کلیک کنید</span>
      </div>

      {/* روش ۳: مستقیم input */}
      <div style={{ marginBottom: '20px' }}>
        <h3>روش ۳: Input مستقیم</h3>
        <input
          type="file"
          accept=".obj,.stl,.glb"
          onChange={handleFileSelect}
          style={{
            padding: '10px',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            width: '100%'
          }}
        />
        <p style={{ color: '#666', fontSize: '14px' }}>← مستقیم روی input کلیک کنید</p>
      </div>

      {/* دستورالعمل تست */}
      <div style={{
        background: '#e3f2fd',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h3>📋 دستورالعمل تست:</h3>
        <ol>
          <li>روی هر یک از روش‌های بالا کلیک کنید</li>
          <li>یک فایل با پسوند <code>.obj</code>, <code>.stl</code> یا <code>.glb</code> انتخاب کنید</li>
          <li>لاگ‌ها را در بالا مشاهده کنید</li>
          <li>اگر رویدادی ثبت نشد، مرورگر را باز کنید (F12) و به Console بروید</li>
        </ol>
        
        <p style={{ marginTop: '10px' }}>
          <strong>تست سریع:</strong> حتی یک فایل متنی با نام <code>test.obj</code> بسازید و آن را انتخاب کنید!
        </p>
      </div>
    </div>
  );
};

export default TestConverter;
