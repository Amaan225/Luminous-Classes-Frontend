import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import { Analytics } from '@vercel/analytics/react'; // <-- 1. Import Analytics

import TutorRegistration from './pages/TutorRegistration';
import LandingPage from './pages/LandingPage';
import ParentPortal from './pages/ParentPortal';
import TutorPortal from './pages/TutorPortal';
import AdminPortal from './pages/AdminPortal';
import Terms from './pages/Terms';
import TutorAccount from './pages/TutorAccount';
import TutorAccountBoundary from './pages/TutorAccountBoundary';
import Seo from './Seo';
import { routeMetadata } from './routeMetadata.js';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <Seo title="Page not found | Tutor49" noindex />
      <h1 className="text-3xl font-black mb-3">Page not found</h1>
      <p className="text-slate-600 mb-6">We could not find that page.</p>
      <a href="/" className="text-indigo-600 font-semibold underline">Go to the Tutor49 home page</a>
    </div>
  );
}

const page = (path, el) => (
  <>
    <Seo {...routeMetadata[path]} path={path} />
    {el}
  </>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOwnerTest=location.pathname==='/tutor-test';
  const tutorAccounts = import.meta.env.VITE_TUTOR_ACCOUNTS_ENABLED === 'true';
  const isAccountDashboard=tutorAccounts&&location.pathname==='/tutor';
  return (
    // Your modern premium wrapper
    <div className="min-h-screen font-sans text-slate-900 bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={page('/', <LandingPage />)} />
          <Route path="/parent" element={page('/parent', import.meta.env.VITE_TUTOR_PREVIEW === 'true' ? <div className="mx-auto max-w-xl p-8"><h1 className="text-3xl font-bold mb-4">Parent form is unchanged</h1><p>This test version cannot submit a real parent requirement. Parent submissions on the live site remain Direct and pending admin review.</p></div> : <ParentPortal />)} />
          <Route path="/tutor" element={page('/tutor', tutorAccounts ? <TutorAccountBoundary><TutorAccount /></TutorAccountBoundary> : <TutorPortal />)} />
          <Route path="/tutor-test" element={<><Seo title="Owner test | Tutor49" noindex /><TutorAccount ownerTest /></>} />
          <Route path="/admin" element={<><Seo title="Admin | Tutor49" noindex /><AdminPortal /></>} />
          <Route path="/register" element={page('/register', <TutorRegistration />)} />
          <Route path="/tutor-legacy" element={<><Seo title="Tuition board | Tutor49" noindex /><TutorPortal /></>} />
          <Route path="/terms" element={page('/terms', <Terms />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      {/* 2. Drop the component here so it tracks every page! */}
      {!isOwnerTest && import.meta.env.VITE_TUTOR_PREVIEW !== 'true' && <Analytics />}

    {/* Floating WhatsApp Button (hidden on the admin console, where it covers records on mobile) */}
{!isAdminRoute && !isOwnerTest && !isAccountDashboard && import.meta.env.VITE_TUTOR_PREVIEW !== 'true' && (
<a
  href="https://wa.me/919838580939?text=Hi%20Tutor49%2C%20I%20have%20a%20question!"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 hover:shadow-xl transition-all duration-300 group"
  aria-label="Chat on WhatsApp"
>
  {/* WhatsApp SVG Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className="w-10 h-10 fill-current"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>

  {/* Optional Ping Indicator for extra attention */}
  <span className="absolute top-0 right-0 flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
  </span>
</a>
)}
    </div>


  );
}

export default App;