// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, } from 'react-router-dom';
import Login from './Login';
import StepForm from './StepForm';
import ArchivePage from './ArchivePage';
import AdvertisementDatabase from './AdvertisementDatabase';
import './App.css';
import StationPage from './StationPage';  
import AdvertisementAddPage from './AdvertisementAddpage';

function Navbar({ onLogout }) {
  return (
    <nav className="nav">
      <Link to="/form"><button>Liniyalar</button></Link>
      <Link to="/database"><button>Ma'lumotlar bazasi</button></Link>
      <Link to="/archive"><button>Arxiv</button></Link>
      <button onClick={onLogout}>Chiqish</button>
    </nav>
  );
}

function AppContent({ onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/form" />} />
      <Route path="/form" element={<StepForm />} />
      <Route path="/database" element={<AdvertisementDatabase />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/station/:id" element={<StationPage />} />
      <Route path="/add-ad" element={<AdvertisementAddPage />} />

    </Routes>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <Router>
      <div className="container">
        <h1 className="title">Metro Reklama Boshqaruvi</h1>
        <Navbar onLogout={handleLogout} />
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
