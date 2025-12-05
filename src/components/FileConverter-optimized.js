import React, { useState, useCallback, useRef } from 'react';
import { Upload, Download, RefreshCw, AlertCircle, File, Trash2 } from 'lucide-react';

const FileConverter = ({ onNotification }) => {
  const [files, setFiles] = useState([]);
  const [converting, setConverting] = useState(false);
  const [targetFormat, setTargetFormat] = useState('obj'); // تغییر پیش‌فرض به obj ساده‌تر
  const fileInputRef = useRef(null);

  // نسخه سبک‌تر: فقط از OBJ پشتیبانی می‌کنیم
  const handleFileUpload = useCallback((event) => {
    const uploadedFiles = Array.from(event.target.files);
    const validFiles = uploadedFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['obj'].includes(ext); // فقط OBJ برای کاهش مصرف
    });

    if (validFiles.length === 0) {
      onNotification('error', 'لطفا فقط فایل OBJ آپلود کنید (به دلیل محدودیت حافظه)');
      return;
    }

    const newFiles = validFiles.slice(0, 1).map(file => ({ // فقط یک فایل
      id: Date.now(),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      format: 'obj',
      status: 'pending',
      originalFile: file
    }));

    setFiles(newFiles);
    onNotification('success', 'فایل آپلود شد!');
  }, [onNotification]);

  // تبدیل ساده‌شده - فقط تغییر فرمت اسمی
  const convertFiles = async () => {
    if (files.length === 0) return;
    
    setConverting(true);
    
    // شبیه‌سازی تبدیل (بدون three.js)
    setTimeout(() => {
      setFiles(prev => prev.map(f => ({
        ...f,
        status: 'completed',
        converted: {
          name: f.name.replace('.obj', `.${targetFormat}`),
          format: targetFormat,
          size: f.size,
          url: `data:text/plain,تبدیل+شده+به+${targetFormat}` // URL ساده
        }
      })));
      
      onNotification('info', 'تبدیل تکمیل شد (نسخه نمایشی - فایل واقعی تبدیل نشد)');
      setConverting(false);
    }, 1000);
  };

  const downloadFile = (convertedFile) => {
    // ایجاد یک فایل متنی ساده به جای مدل سه‌بعدی
    const content = `فایل ${convertedFile.name}\nاین یک نسخه نمایشی است.\nبه دلیل محدودیت حافظه Termux، تبدیل واقعی غیرفعال شد.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = convertedFile.name;
    link.click();
    
    URL.revokeObjectURL(url);
    onNotification('success', `فایل ${convertedFile.name} دانلود شد (نسخه نمایشی)`);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="islamic-card p-6">
        <h3 className="text-2xl font-bold text-islamic-green mb-4">
          مبدل سه‌بعدی (نسخه سبک برای Termux)
        </h3>
        
        <div className="mb-4">
          <p className="text-red-600 mb-4">
            ⚠️ به دلیل محدودیت حافظه Termux، این نسخه فقط نمایشی کار می‌کند.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".obj"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="islamic-btn-primary mb-4"
            >
              <Upload className="inline mr-2" />
              انتخاب فایل OBJ
            </button>
            <p className="text-sm text-gray-500">حداکثر 1 فایل - فقط فرمت OBJ</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold">فایل‌های آپلود شده</h4>
              <button
                onClick={convertFiles}
                disabled={converting}
                className="islamic-btn-secondary"
              >
                {converting ? 'در حال تبدیل...' : 'شروع تبدیل'}
              </button>
            </div>
            
            {files.map(file => (
              <div key={file.id} className="border rounded-lg p-4 mb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold">{file.name}</span>
                    <span className="text-sm text-gray-500 mr-3">({file.size})</span>
                  </div>
                  
                  {file.status === 'completed' && file.converted && (
                    <button
                      onClick={() => downloadFile(file.converted)}
                      className="islamic-btn-primary text-sm"
                    >
                      <Download size={14} className="inline mr-1" />
                      دانلود {file.converted.name}
                    </button>
                  )}
                  
                  {file.status === 'pending' && (
                    <span className="text-yellow-600">در انتظار تبدیل</span>
                  )}
                </div>
                
                {file.status === 'completed' && (
                  <p className="text-green-600 text-sm mt-2">
                    ✅ تبدیل شد (نسخه نمایشی)
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileConverter;
