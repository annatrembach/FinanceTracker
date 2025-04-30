import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Header from './components/Header/Header.jsx';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="App">
      <Header setIsSidebarOpen={setIsSidebarOpen} />
      <div>
        <Dashboard isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
}

export default App;
