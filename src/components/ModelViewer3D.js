import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, ZoomIn, Move, Download, Sun, Moon, AlertCircle, Box } from 'lucide-react';

const ModelViewer3D = ({ webGLAvailable }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState('cube');
  const [backgroundColor, setBackgroundColor] = useState('#f8f5e9');
  const [modelColor, setModelColor] = useState('#2d6a4f');
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);

  useEffect(() => {
    if (!mountRef.current || !webGLAvailable) return;

    const loadThreeJS = async () => {
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls');

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(backgroundColor);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 2;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight1 = new THREE.DirectionalLight(0xf9e076, 0.8);
      directionalLight1.position.set(10, 10, 5);
      scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0x4d8b31, 0.4);
      directionalLight2.position.set(-10, -10, -5);
      scene.add(directionalLight2);

      const material = new THREE.MeshPhongMaterial({ 
        color: modelColor,
        shininess: 100,
        specular: 0x111111,
        wireframe: wireframe
      });

      let mesh;
      if (currentModel === 'cube') {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
      } else if (currentModel === 'sphere') {
        mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
      } else if (currentModel === 'cone') {
        mesh = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
      } else if (currentModel === 'cylinder') {
        mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2, 32), material);
      } else if (currentModel === 'torus') {
        mesh = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 100), material);
      } else if (currentModel === 'tetrahedron') {
        mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(1), material);
      } else {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
      }
      
      scene.add(mesh);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        if (autoRotate && mesh) {
          mesh.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!mountRef.current) return;
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        controls.dispose();
        scene.clear();
      };
    };

    const cleanup = loadThreeJS();
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, [webGLAvailable, backgroundColor, autoRotate, currentModel, modelColor, wireframe]);

  const loadModel = (modelName) => {
    setCurrentModel(modelName);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const changeModelColor = (color) => {
    setModelColor(color);
  };

  const toggleWireframe = () => {
    setWireframe(!wireframe);
  };

  const downloadModel = () => {
    const link = document.createElement('a');
    link.href = `/samples/${currentModel}.obj`;
    link.download = `${currentModel}_islamic.obj`;
    link.click();
  };

  if (!webGLAvailable) {
    return (
      <div className="islamic-card p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-red-600 mb-2">WebGL غیرفعال است</h3>
        <p className="text-gray-600 mb-4">
          برای استفاده از نمایشگر سه‌بعدی، لطفا WebGL را در مرورگر خود فعال کنید.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg text-right">
          <p className="font-bold mb-2">راه‌حل‌ها:</p>
          <p>۱. مرورگر را به آخرین نسخه آپدیت کنید</p>
          <p>۲. به آدرس chrome://flags بروید</p>
          <p>۳. گزینه "WebGL" را جستجو و فعال کنید</p>
          <p>۴. مرورگر را ری‌استارت کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="islamic-card p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-islamic-green">🎮 نمایشگر تعاملی سه‌بعدی</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    autoRotate ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <RefreshCw size={18} />
                  چرخش خودکار
                </button>
                <button 
                  onClick={toggleWireframe}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    wireframe ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Move size={18} />
                  نمایش شبکه
                </button>
              </div>
            </div>
            
            <div 
              ref={mountRef} 
              className="model-viewer-container h-96 w-full relative"
            >
              {loading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    <p className="mt-4 text-white font-bold">در حال بارگذاری مدل...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-sm text-gray-500 text-center">
              <p>برای چرخش مدل: کلیک و بکشید | برای زوم: اسکرول ماوس</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="islamic-card p-4">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Box size={20} />
              انتخاب مدل
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {['cube', 'sphere', 'cone', 'torus', 'tetrahedron', 'cylinder'].map((model) => (
                <button
                  key={model}
                  onClick={() => loadModel(model)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    currentModel === model
                      ? 'bg-islamic-green text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-bold mb-1">
                    {model === 'cube' && 'مکعب'}
                    {model === 'sphere' && 'کره'}
                    {model === 'cone' && 'مخروط'}
                    {model === 'torus' && 'حلقه'}
                    {model === 'tetrahedron' && 'چهاروجهی'}
                    {model === 'cylinder' && 'استوانه'}
                  </div>
                  <div className="text-xs opacity-75">
                    {model === 'cube' && '📦'}
                    {model === 'sphere' && '🔵'}
                    {model === 'cone' && '🔺'}
                    {model === 'torus' && '⭕'}
                    {model === 'tetrahedron' && '△'}
                    {model === 'cylinder' && '⬭'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="islamic-card p-4">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sun size={20} />
              تنظیمات رنگ
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">رنگ مدل:</label>
                <div className="flex gap-2">
                  {['#2d6a4f', '#d4af37', '#1e3a8a', '#8b4513', '#c53030'].map((color) => (
                    <button
                      key={color}
                      onClick={() => changeModelColor(color)}
                      className="w-8 h-8 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={modelColor}
                    onChange={(e) => changeModelColor(e.target.value)}
                    className="w-8 h-8 cursor-pointer"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">رنگ پس‌زمینه:</label>
                <div className="flex gap-2">
                  {['#f8f5e9', '#1a1a1a', '#2c3e50', '#34495e', '#ecf0f1'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className="w-8 h-8 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="islamic-card p-4">
            <h4 className="font-bold text-lg mb-4">⚡ عملیات</h4>
            <div className="space-y-3">
              <button
                onClick={() => loadModel(currentModel)}
                className="islamic-btn-primary w-full flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                بارگذاری مجدد مدل
              </button>
              
              <button
                onClick={downloadModel}
                className="islamic-btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Download size={18} />
                دانلود مدل نمونه
              </button>
              
              <div className="text-xs text-gray-500 text-center mt-2">
                <p>مدل فعلی: {currentModel}</p>
                <p>رنگ: {modelColor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="islamic-card p-6">
        <h4 className="font-bold text-xl mb-4 text-islamic-green">📊 اطلاعات فنی نمایشگر</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="text-2xl font-bold text-islamic-green">60 FPS</div>
            <div className="text-sm text-gray-600">نرخ فریم</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="text-2xl font-bold text-islamic-blue">{'<'} 50MB</div>
            <div className="text-sm text-gray-600">مصرف حافظه</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
            <div className="text-2xl font-bold text-amber-600">WebGL 2.0</div>
            <div className="text-sm text-gray-600">فناوری گرافیکی</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">6 مدل</div>
            <div className="text-sm text-gray-600">مدل‌های آماده</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer3D;
