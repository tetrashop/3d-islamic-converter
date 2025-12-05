import FileConverter from './components/FileConverter';

function App() {
  const handleNotification = (type, message) => {
    // در این نسخه، فقط در کنسول نمایش می‌دهیم
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <FileConverter onNotification={handleNotification} />
    </div>
  );
}

export default App;
