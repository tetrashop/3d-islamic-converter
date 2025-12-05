import React, { useState, useRef, useEffect } from 'react';

const DebugConverter = () => {
  const [logs, setLogs] = useState([]);
  const [fileInfo, setFileInfo] = useState(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  
  const addLog = (source, message) => {
    const time = new Date().toLocaleTimeString();
    const logEntry = `[${time}] [${source}] ${message}`;
    console.log(logEntry);
    setLogs(prev => [logEntry, ...prev.slice(0, 15)]);
  };

  useEffect(() => {
    addLog('SYSTEM', 'کامپوننت بارگذاری شد');
    addLog('REF', `fileInputRef1: ${fileInputRef1.current ? 'متصل' : 'null'}`);
    addLog('REF', `fileInputRef2: ${fileInputRef2.current ? 'متصل' : 'null'}`);
  }, []);

  const processFiles = (sourceName, files) => {
    addLog(sourceName, `رویداد triggered - ${files.length} فایل`);
    
    if (!files || files.length === 0) {
      addLog(sourceName, 'هیچ فایلی دریافت نشد');
      return;
    }
    
    const fileList = Array.from(files);
    fileList.forEach((file, i) => {
      addLog(sourceName, `فایل ${i+1}: "${file.name}" (${file.type}, ${file.size} بایت)`);
    });
    
    if (fileList.length > 0) {
      setFileInfo({
        name: fileList[0].name,
        size: (fileList[0].size / 1024).toFixed(1) + ' KB',
        type: fileList[0].type || 'ناشناخته',
        lastModified: new Date(fileList[0].lastModified).toLocaleString(),
        source: sourceName
      });
    }
    
    addLog(sourceName, 'پردازش فایل‌ها کامل شد');
  };

  // روش ۱: استفاده از label
  const handleMethod1 = (event) => {
    processFiles('METHOD_1 (label)', event.target.files);
    event.target.value = '';
  };

  // روش ۲: دکمه + useRef
  const handleMethod2Click = () => {
    addLog('METHOD_2', 'دکمه کلیک شد');
    if (fileInputRef1.current) {
      addLog('METHOD_2', 'ref موجود است - triggering click');
      fileInputRef1.current.click();
    } else {
      addLog('METHOD_2', 'ERROR: ref null است!');
    }
  };

  const handleMethod2Change = (event) => {
    processFiles('METHOD_2 (ref)', event.target.files);
    event.target.value = '';
  };

  // روش ۳: input مستقیم + useRef دیگر
  const handleMethod3Change = (event) => {
    processFiles('METHOD_3 (direct)', event.target.files);
    event.target.value = '';
  };

  // روش ۴: drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    addLog('DRAG', 'فایل روی منطقه کشیده شد');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    processFiles('METHOD_4 (drag-drop)', e.dataTransfer.files);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system'
    }}>
      <h1 style={{ color: '#1a5e25', borderBottom: '2px solid #d4af37', paddingBottom: '10px' }}>
        🐛 دیباگ کامل آپلود فایل
      </h1>

      {fileInfo && (
        <div style={{
          background: '#e8f5e9',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '2px solid #4caf50'
        }}>
          <h3>📁 فایل انتخاب شده:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div><strong>نام:</strong> {fileInfo.name}</div>
            <div><strong>حجم:</strong> {fileInfo.size}</div>
            <div><strong>نوع:</strong> {fileInfo.type}</div>
            <div><strong>منبع:</strong> {fileInfo.source}</div>
            <div><strong>تاریخ:</strong> {fileInfo.lastModified}</div>
          </div>
        </div>
      )}

      <div style={{
        background: '#2c3e50',
        color: '#ecf0f1',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        maxHeight: '300px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>📋 لاگ رویدادها ({logs.length})</h3>
          <button 
            onClick={() => setLogs([])}
            style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
          >
            پاک کردن لاگ
          </button>
        </div>
        {logs.length === 0 ? (
          <div style={{ color: '#bdc3c7', fontStyle: 'italic' }}>در انتظار رویداد...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ 
              padding: '5px 0', 
              borderBottom: '1px solid #34495e',
              color: log.includes('ERROR') ? '#e74c3c' : 
                     log.includes('SYSTEM') ? '#3498db' : 
                     log.includes('REF') ? '#9b59b6' : '#ecf0f1'
            }}>
              {log}
            </div>
          ))
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        
        {/* روش ۱ */}
        <div style={{ border: '2px solid #27ae60', borderRadius: '10px', padding: '15px' }}>
          <h3 style={{ color: '#27ae60' }}>🟢 روش ۱: Label (کار می‌کند)</h3>
          <label style={{
            display: 'block',
            padding: '12px',
            background: '#27ae60',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            انتخاب فایل
            <input
              type="file"
              accept=".obj,.stl,.glb"
              onChange={handleMethod1}
              style={{ display: 'none' }}
            />
          </label>
          <p style={{ fontSize: '14px', color: '#666' }}>
            استاندارد HTML - input داخل label
          </p>
        </div>

        {/* روش ۲ */}
        <div style={{ border: '2px solid #e74c3c', borderRadius: '10px', padding: '15px' }}>
          <h3 style={{ color: '#e74c3c' }}>🔴 روش ۲: useRef + onClick</h3>
          <button
            onClick={handleMethod2Click}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            کلیک کنید (ref)
          </button>
          <input
            ref={fileInputRef1}
            type="file"
            accept=".obj,.stl,.glb"
            onChange={handleMethod2Change}
            style={{ display: 'none' }}
          />
          <p style={{ fontSize: '14px', color: '#666' }}>
            استفاده از useRef + برنامه‌نویسی click
          </p>
        </div>

        {/* روش ۳ - خطای سینتکس اصلاح شد */}
        <div style={{ 
          border: '2px solid #3498db', 
          borderRadius: '10px', 
          padding: '15px', 
          gridColumn: '1 / -1' 
        }}>
          <h3 style={{ color: '#3498db' }}>🔵 روش ۳: Input مستقیم</h3>
          <input
            ref={fileInputRef2}
            type="file"
            accept=".obj,.stl,.glb"
            onChange={handleMethod3Change}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px dashed #3498db',
              borderRadius: '8px',
              background: '#f8f9fa'
            }}
          />
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            مستقیم روی input کلیک کنید
          </p>
        </div>
      </div>

      {/* منطقه drag & drop */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: '3px dashed #9b59b6',
          borderRadius: '10px',
          padding: '30px',
          textAlign: 'center',
          background: '#f9f9f9',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        <div style={{ fontSize: '48px', color: '#9b59b6' }}>⬇️</div>
        <h3>روش ۴: کشیدن و رها کردن (Drag & Drop)</h3>
        <p>فایل‌ها را اینجا بکشید و رها کنید</p>
      </div>

      <div style={{
        background: '#fff3cd',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #ffc107'
      }}>
        <h3>📋 دستورالعمل تست:</h3>
        <ol>
          <li>روی <strong>هر سه روش</strong> کلیک کنید و فایل انتخاب کنید</li>
          <li><strong>کنسول مرورگر را باز کنید</strong> (F12 → Console)</li>
          <li>مشاهده کنید کدام روش لاگ تولید می‌کند</li>
          <li>خطاهای کنسول را کپی کنید</li>
          <li>برای تست سریع:
            <br />
            <code style={{ background: '#333', color: '#fff', padding: '5px', borderRadius: '4px' }}>
              echo "test" > ~/test-file.obj
            </code>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default DebugConverter;
