import React, { useState } from 'react';
import { BrowserRouter as  Router, Route, Routes, Link } from 'react-router-dom'; 
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Header from './components/Header/Header.jsx';
import RegistrationForm from './components/Forms/Registration/RegistrationForm.jsx'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* головна сторінка */}
          <Route path="/" element={<h1>Welcome to the Main Page!</h1>} />

          {/* сторінка реєстрації */}
          <Route path="/register" element={<RegistrationForm />} />

          {/* сторінка з дашбордом */}
          <Route path="/dashboard" element={
            <>
              <Header setIsSidebarOpen={setIsSidebarOpen} />
              <div>
                <Dashboard isSidebarOpen={isSidebarOpen} />
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
