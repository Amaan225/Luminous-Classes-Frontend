import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TutorRegistration from './pages/TutorRegistration';

// Import our newly separated pages
import LandingPage from './pages/LandingPage';
import ParentPortal from './pages/ParentPortal';
import TutorPortal from './pages/TutorPortal';
import AdminPortal from './pages/AdminPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/parent" element={<ParentPortal />} />
        <Route path="/tutor" element={<TutorPortal />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/register" element={<TutorRegistration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;