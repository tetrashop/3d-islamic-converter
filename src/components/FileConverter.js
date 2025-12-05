import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, File, Trash2 } from 'lucide-react';

const FileConverter = ({ onNotification }) => {
  const [files, setFiles] = useState([]);
  const [converting, setConverting] = useState(false);
  const [targetFormat, setTargetFormat] = useState('obj');
  
  const fileInputRef = useRef(null);

  const supportedFormats = [
    { ext: 'obj', name: 'Wavefront OBJ', color: 'format-obj' },
    { ext: 'stl', name: 'Stereolithography', color: 'format-stl' },
    { ext: 'glb', name: 'Binary GLTF', color: 'format-glb' }
  ];

  // تابع آپلود ساده و مطمئن (مشابه DebugConverter)
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    
    if (uploadedFiles.length === 0) {
      onNotification('error', 'هیچ فایلی انتخاب نشده است!');
      return;
    }

    // فیلتر فایل‌های مجاز
    const validFiles = uploadedFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return supportedFormats.some(format => format.ext === ext);
    });

    if (validFiles.length === 0) {
      onNotification('error', 'فرمت فایل مجاز نیست! فقط OBJ, STL, GLB');
      return;
    }

    // ایجاد لیست فایل‌های جدید
    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      format: file.name.split('.').pop().toLowerCase(),
      originalFile: file,
      status: 'pending',
      converted: null
    }));

    // محدود کردن به ۵ فایل
    setFiles(prev => {
      const updated = [...prev, ...newFiles].slice(0, 5);
      return updated;
    });

    onNotification('success', `${validFiles.length} فایل با موفقیت آپلود شد!`);
    
    // ریست input برای امکان انتخاب مجدد همان فایل
    if (event.target) event.target.value = '';
  };

  // فعال‌سازی input فایل از طریق ref
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      onNotification('error', 'خطا در دسترسی به انتخاب فایل');
    }
  };

  // تابع تبدیل (نسخه نمایشی)
  const convertFiles = async () => {
    if (files.length === 0) {
      onNotification('error', 'لطفاً ابتدا فایلی آپلود کنید!');
      return;
    }

    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      onNotification('info', 'همه فایل‌ها قبلاً پردازش شده‌اند!');
      return;
    }

    setConverting(true);

    // پردازش هر فایل
    for (const file of pendingFiles) {
      // به روزرسانی وضعیت به "در حال تبدیل"
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'converting' } : f
      ));

      try {
        // تاخیر شبیه‌سازی شده برای تبدیل
        await new Promise(resolve => setTimeout(resolve, 1500));

        // ایجاد فایل تبدیل‌شده نمونه
        const convertedFile = {
          id: file.id + '_converted',
          name: file.name.replace(/\.[^/.]+$/, `.${targetFormat}`),
          format: targetFormat,
          size: (parseFloat(file.size) * 0.9).toFixed(2) + ' MB',
          url: URL.createObjectURL(new Blob([`فایل نمونه تبدیل شده از ${file.name}`], 
            { type: 'text/plain' }))
        };

        // به روزرسانی وضعیت به "تکمیل شده"
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'completed', converted: convertedFile }
            : f
        ));

        onNotification('success', `"${file.name}" با موفقیت تبدیل شد! (نمایشی)`);

      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'error', error: error.message }
            : f
        ));
        onNotification('error', `خطا در تبدیل "${file.name}": ${error.message}`);
      }
    }

    setConverting(false);
  };

  const downloadFile = (convertedFile) => {
    if (!convertedFile || !convertedFile.url) {
      onNotification('error', 'فایل تبدیل شده معتبر نیست!');
      return;
    }

    const link = document.createElement('a');
    link.href = convertedFile.url;
    link.download = convertedFile.name;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onNotification('success', `دانلود "${convertedFile.name}" آغاز شد!`);
  };

  const removeFile = (id) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove && fileToRemove.converted && fileToRemove.converted.url) {
      URL.revokeObjectURL(fileToRemove.converted.url);
    }
    
    setFiles(prev => prev.filter(f => f.id !== id));
    onNotification('info', 'فایل حذف شد!');
  };

  const clearAll = () => {
    files.forEach(f => {
      if (f.converted && f.converted.url) {
        URL.revokeObjectURL(f.converted.url);
      }
    });
    setFiles([]);
    onNotification('info', 'همه فایل‌ها حذف شدند!');
  };

  return (
    <div className="space-y-6">
      <div className="islamic-card p-6">
        <h3 className="text-2xl font-bold text-islamic-green mb-6 flex items-center gap-3">
          <Upload size={28} />
          آپلود فایل‌های سه‌بعدی
        </h3>

        <div className="mb-8">
          <label className="block text-lg font-medium mb-4">فرمت خروجی مورد نظر:</label>
          <div className="flex flex-wrap gap-3">
            {supportedFormats.map(format => (
              <button
                key={format.ext}
                type="button"
                onClick={() => setTargetFormat(format.ext)}
                className={`format-badge ${format.color} ${
                  targetFormat === format.ext 
                    ? 'ring-4 ring-islamic-gold/50 transform scale-105' 
                    : ''
                }`}
              >
                {format.ext.toUpperCase()}
                <span className="text-xs block mt-1">{format.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-3 border-dashed border-islamic-gold/30 rounded-2xl p-8 text-center bg-gradient-to-br from-islamic-green/5 to-islamic-blue/5">
          <div className="max-w-md mx-auto">
            <Upload className="w-16 h-16 text-islamic-green mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">فایل‌های خود را اینجا رها کنید</h4>
            <p className="text-gray-600 mb-6">یا با کلیک فایل‌ها را انتخاب کنید</p>
            
            {/* دو روش برای انتخاب فایل */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* روش ۱: Label (همیشه کار می‌کند) */}
              <label className="islamic-btn-primary cursor-pointer inline-block">
                <span className="flex items-center gap-2">
                  <File size={20} />
                  انتخاب فایل (روش ۱)
                </span>
                <input
                  type="file"
                  multiple
                  accept=".obj,.stl,.glb"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              
              {/* روش ۲: Button با استفاده از ref */}
              <button
                type="button"
                onClick={triggerFileInput}
                className="islamic-btn-secondary flex items-center gap-2"
              >
                <File size={20} />
                انتخاب فایل (روش ۲)
              </button>
            </div>
            
            {/* Input پنهان برای روش ۲ */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".obj,.stl,.glb"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <p className="text-sm text-gray-500 mt-4">
              پشتیبانی از فرمت‌های: OBJ, STL, GLB (حداکثر ۵ فایل)
            </p>
          </div>
        </div>

        {converting && (
          <div className="mt-6 p-4 bg-gradient-to-r from-islamic-green/10 to-islamic-blue/10 rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="font-bold">در حال تبدیل...</span>
              <span>لطفا منتظر بمانید</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-islamic-green to-islamic-blue transition-all duration-300 animate-pulse"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* لیست فایل‌ها */}
      <div className="islamic-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-islamic-green flex items-center gap-2">
            <File size={24} />
            فایل‌های آپلود شده ({files.length})
          </h3>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={clearAll}
              disabled={files.length === 0 || converting}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Trash2 size={18} />
              حذف همه
            </button>
            
            <button
              type="button"
              onClick={convertFiles}
              disabled={files.length === 0 || converting}
              className="islamic-btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {converting ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  در حال تبدیل...
                </>
              ) : (
                <>
                  <Download size={18} />
                  شروع تبدیل
                </>
              )}
            </button>
          </div>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-12">
            <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">هنوز فایلی آپلود نکرده‌اید</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-islamic-gold/20">
                  <th className="text-right p-4">نام فایل</th>
                  <th className="text-right p-4">فرمت</th>
                  <th className="text-right p-4">حجم</th>
                  <th className="text-right p-4">وضعیت</th>
                  <th className="text-right p-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`format-badge format-${file.format}`}>
                          {file.format.toUpperCase()}
                        </div>
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`format-badge format-${file.format}`}>
                        {file.format.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">{file.size}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {file.status === 'pending' && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            در انتظار
                          </span>
                        )}
                        {file.status === 'converting' && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                            <RefreshCw className="animate-spin" size={14} />
                            در حال تبدیل
                          </span>
                        )}
                        {file.status === 'completed' && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
                            <CheckCircle size={14} />
                            تبدیل شده
                          </span>
                        )}
                        {file.status === 'error' && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-1">
                            <AlertCircle size={14} />
                            خطا
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="حذف فایل"
                        >
                          <Trash2 size={18} />
                        </button>
                        
                        {file.status === 'completed' && file.converted && (
                          <button
                            type="button"
                            onClick={() => downloadFile(file.converted)}
                            className="islamic-btn-secondary flex items-center gap-1 px-3 py-2"
                            title="دانلود فایل تبدیل شده"
                          >
                            <Download size={16} />
                            دانلود
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="islamic-card p-6">
          <h4 className="font-bold text-lg mb-4 text-islamic-green flex items-center gap-2">
            <CheckCircle size={20} />
            تست موفق
          </h4>
          <p className="text-gray-600">
            منطق آپلود فایل با موفقیت تست و تأیید شده است.
          </p>
        </div>
        
        <div className="islamic-card p-6">
          <h4 className="font-bold text-lg mb-4 text-islamic-green flex items-center gap-2">
            <RefreshCw size={20} />
            نسخه نمایشی
          </h4>
          <p className="text-gray-600">
            تبدیل فایل‌ها به صورت نمایشی کار می‌کند. می‌توانید منطق three.js را بعداً اضافه کنید.
          </p>
        </div>
        
        <div className="islamic-card p-6">
          <h4 className="font-bold text-lg mb-4 text-islamic-green flex items-center gap-2">
            <AlertCircle size={20} />
            آماده توسعه
          </h4>
          <p className="text-gray-600">
            پایه پروژه آماده است. می‌توانید ویژگی‌های پیشرفته را اضافه کنید.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileConverter;
