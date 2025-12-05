import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// اضافه کردن این خطوط به انتهای فایل
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// ثبت Service Worker برای PWA
serviceWorkerRegistration.register();
