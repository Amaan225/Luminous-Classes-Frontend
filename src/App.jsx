import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import { Analytics } from '@vercel/analytics/react'; // <-- 1. Import Analytics

import TutorRegistration from './pages/TutorRegistration';
import LandingPage from './pages/LandingPage';
import ParentPortal from './pages/ParentPortal';
import TutorPortal from './pages/TutorPortal';
import AdminPortal from './pages/AdminPortal';
import Terms from './pages/Terms';

function App() {
  return (
    // Your modern premium wrapper
    <div className="min-h-screen font-sans text-slate-900 bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <BrowserRouter>
        <ScrollToTop /> 
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/parent" element={<ParentPortal />} />
          <Route path="/tutor" element={<TutorPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/register" element={<TutorRegistration />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </BrowserRouter>
      
      {/* 2. Drop the component here so it tracks every page! */}
      <Analytics /> 
    </div>
  );
}

export default App;