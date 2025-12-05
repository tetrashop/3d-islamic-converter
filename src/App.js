import FileConverter from './components/FileConverter';

function App() {
  const handleNotification = (type, message) => {
    console.log(`${type}: ${message}`);
  };

  return (
    <div>
      <FileConverter onNotification={handleNotification} />
    </div>
  );
}

export default App;
