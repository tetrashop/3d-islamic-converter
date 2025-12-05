import React, { useState } from 'react';
import { Upload, Download, Trash2, File } from 'lucide-react';

const SimpleFileConverter = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  // تابع ساده برای آپلود فایل
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    
    if (uploadedFiles.length === 0) {
      setMessage('هیچ فایلی انتخاب نشده است!');
      return;
    }

    // فقط فایل‌های با فرمت مجاز
    const allowedFormats = ['.obj', '.stl', '.glb'];
    const validFiles = uploadedFiles.filter(file => {
      const fileName = file.name.toLowerCase();
      return allowedFormats.some(format => fileName.endsWith(format));
    });

    if (validFiles.length === 0) {
      setMessage('فرمت فایل مجاز نیست! فقط OBJ, STL, GLB');
      return;
    }

    // اضافه کردن فایل‌های جدید
    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.name.split('.').pop().toUpperCase(),
      file: file, // ذخیره شی فایل اصلی
      uploadTime: new Date().toLocaleTimeString()
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setMessage(`${validFiles.length} فایل با موفقیت آپلود شد!`);
    
    // ریست کردن input
    event.target.value = '';
  };

  // حذف یک فایل
  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    setMessage('فایل حذف شد!');
  };

  // حذف همه فایل‌ها
  const clearAll = () => {
    setFiles([]);
    setMessage('همه فایل‌ها حذف شدند!');
  };

  // دانلود فایل (نمایشی)
  const downloadFile = (file) => {
    setMessage(`دانلود "${file.name}" آغاز شد (نسخه نمایشی)...`);
    
    // ایجاد یک فایل متنی نمونه برای دانلود
    const content = `این یک فایل نمونه است\nنام: ${file.name}\nحجم: ${file.size}\nتاریخ: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // آزاد کردن حافظه
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          مبدل ساده فایل‌های سه‌بعدی
        </h2>
        
        {/* نمایش پیام */}
        {message && (
          <div className={`p-3 rounded-lg mb-4 ${message.includes('موفقیت') ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
            {message}
          </div>
        )}

        {/* بخش آپلود */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">فایل‌های خود را انتخاب کنید</p>
          
          <label className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700">
            <input
              type="file"
              multiple
              accept=".obj,.stl,.glb"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="flex items-center gap-2">
              <File size={20} />
              انتخاب فایل‌ها
            </span>
          </label>
          
          <p className="text-sm text-gray-500 mt-3">
            فرمت‌های مجاز: .obj .stl .glb
          </p>
        </div>

        {/* لیست فایل‌ها */}
        {files.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">
                فایل‌های آپلود شده ({files.length})
              </h3>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
              >
                <Trash2 size={16} />
                حذف همه
              </button>
            </div>

            <div className="space-y-3">
              {files.map(file => (
                <div key={file.id} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {file.type}
                      </span>
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      حجم: {file.size} | زمان آپلود: {file.uploadTime}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <button
                      onClick={() => downloadFile(file)}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2"
                    >
                      <Download size={16} />
                      دانلود نمونه
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* اطلاعات */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>توجه:</strong> این نسخه ساده‌شده برای رفع مشکلات اولیه است. 
            پس از اطمینان از کارکرد صحیح، می‌توانید ویژگی‌های پیشرفته را اضافه کنید.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleFileConverter;
