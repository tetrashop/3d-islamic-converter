import React, { useState, useCallback } from 'react';
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, File, Trash2 } from 'lucide-react';

const FileConverter = ({ onNotification }) => {
  const [files, setFiles] = useState([]);
  const [converting, setConverting] = useState(false);
  const [targetFormat, setTargetFormat] = useState('glb');
  const [progress, setProgress] = useState(0);

  const supportedFormats = [
    { ext: 'obj', name: 'Wavefront OBJ', color: 'format-obj' },
    { ext: 'stl', name: 'Stereolithography', color: 'format-stl' },
    { ext: 'glb', name: 'Binary GLTF', color: 'format-glb' },
    { ext: 'fbx', name: 'Autodesk FBX', color: 'format-fbx' },
    { ext: '3ds', name: '3D Studio', color: 'format-3ds' },
    { ext: 'ply', name: 'Polygon File', color: 'format-ply' }
  ];

  const handleFileUpload = useCallback((event) => {
    const uploadedFiles = Array.from(event.target.files);
    const validFiles = uploadedFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return supportedFormats.some(format => format.ext === ext);
    });

    if (validFiles.length === 0) {
      onNotification('error', 'لطفا فایل سه‌بعدی معتبر آپلود کنید!');
      return;
    }

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      format: file.name.split('.').pop().toLowerCase(),
      status: 'pending',
      converted: null
    }));

    setFiles(prev => [...prev, ...newFiles]);
    onNotification('success', `${validFiles.length} فایل با موفقیت آپلود شد!`);
  }, [onNotification, supportedFormats]);

  const simulateConversion = (file) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            id: file.id + '_converted',
            name: file.name.replace(/\.\w+$/, `.${targetFormat}`),
            format: targetFormat,
            size: (file.size * 0.9 / (1024 * 1024)).toFixed(2) + ' MB',
            url: '#'
          });
        }
      }, 100);
    });
  };

  const convertFiles = async () => {
    if (files.length === 0) {
      onNotification('error', 'لطفا ابتدا فایلی آپلود کنید!');
      return;
    }

    setConverting(true);
    setProgress(0);

    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (let i = 0; i < pendingFiles.length; i++) {
      const file = pendingFiles[i];
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'converting' } : f
      ));

      const convertedFile = await simulateConversion(file);
      
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: 'completed', converted: convertedFile }
          : f
      ));

      onNotification('success', `فایل ${file.name} با موفقیت تبدیل شد!`);
    }

    setConverting(false);
    setProgress(100);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    onNotification('info', 'فایل حذف شد!');
  };

  const clearAll = () => {
    setFiles([]);
    onNotification('info', 'همه فایل‌ها حذف شدند!');
  };

  const downloadFile = (file) => {
    onNotification('success', `دانلود ${file.name} شروع شد!`);
    // در حالت واقعی، اینجا فایل دانلود می‌شود
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
            
            <label className="islamic-btn-primary cursor-pointer inline-block">
              <input
                type="file"
                multiple
                accept=".obj,.stl,.glb,.fbx,.3ds,.ply"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="flex items-center gap-2">
                <File size={20} />
                انتخاب فایل‌ها
              </span>
            </label>
            
            <p className="text-sm text-gray-500 mt-4">
              پشتیبانی از فرمت‌های: OBJ, STL, GLB, FBX, 3DS, PLY
            </p>
          </div>
        </div>

        {converting && (
          <div className="mt-6 p-4 bg-gradient-to-r from-islamic-green/10 to-islamic-blue/10 rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="font-bold">در حال تبدیل...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-islamic-green to-islamic-blue transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="islamic-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-islamic-green flex items-center gap-2">
            <File size={24} />
            فایل‌های آپلود شده ({files.length})
          </h3>
          
          <div className="flex gap-3">
            <button
              onClick={clearAll}
              disabled={files.length === 0}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Trash2 size={18} />
              حذف همه
            </button>
            
            <button
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
                      <span className="format-badge format-obj">{file.format.toUpperCase()}</span>
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
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                        
                        {file.converted && (
                          <button
                            onClick={() => downloadFile(file.converted)}
                            className="islamic-btn-secondary flex items-center gap-1 px-3 py-2"
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
            کیفیت حفظ شده
          </h4>
          <p className="text-gray-600">
            الگوریتم‌های پیشرفته ما کیفیت مدل‌های سه‌بعدی را در حین تبدیل کاملاً حفظ می‌کنند.
          </p>
        </div>
        
        <div className="islamic-card p-6">
          <h4 className="font-bold text-lg mb-4 text-islamic-green flex items-center gap-2">
            <RefreshCw size={20} />
            تبدیل گروهی
          </h4>
          <p className="text-gray-600">
            امکان تبدیل همزمان چندین فایل با فرمت‌های مختلف در کمترین زمان ممکن.
          </p>
        </div>
        
        <div className="islamic-card p-6">
          <h4 className="font-bold text-lg mb-4 text-islamic-green flex items-center gap-2">
            <AlertCircle size={20} />
            امنیت کامل
          </h4>
          <p className="text-gray-600">
            تمام پردازش‌ها در مرورگر شما انجام می‌شود و فایل‌های شما به هیچ سروری ارسال نمی‌شوند.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileConverter;
