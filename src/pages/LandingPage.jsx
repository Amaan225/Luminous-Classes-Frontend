import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Wallet, Zap } from 'lucide-react';

function LandingPage() {
  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      
      {/* ========================================== */}
      {/* 1. THE HERO SECTION (The Hook)               */}
      {/* ========================================== */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative border-b border-gray-200">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 mb-4 tracking-tight text-center">
          Luminous <span className="text-blue-600">Classes</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-12 text-center max-w-2xl font-light">
          Connecting dedicated parents with verified, top-tier university tutors in the area.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center z-10">
          <Link to="/parent" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-6 px-8 rounded-2xl shadow-lg transition duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-2">I am a Parent</h2>
            <p className="text-blue-100 text-sm">Post a requirement and find verified tutors instantly.</p>
          </Link>

          <Link to="/tutor" className="flex-1 bg-white hover:bg-gray-50 text-slate-800 border-2 border-blue-500 text-center py-6 px-8 rounded-2xl shadow-lg transition duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-2">I am a Tutor</h2>
            <p className="text-gray-500 text-sm">Browse local jobs and apply directly to parents.</p>
          </Link>
        </div>

        <div className="text-center mt-8 z-10">
          <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition">
            New Tutor? Register Here First
          </Link>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 animate-bounce text-gray-400 hidden md:block">
          ↓ Scroll to learn more ↓
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. THE VALUE PROPOSITION (The Details)       */}
      {/* ========================================== */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">A <h2 className='text-blue-600'>Smarter</h2> Way to Learn</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto py-10">
            We stripped away the heavy agency fees to create a direct, transparent connection between great students and great teachers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
         {/* Detail Card 1 */}
<div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-500 text-center hover:shadow-md transition">
  
  {/* The new SVG Icon! Notice we can change the color using text-blue-600 */}
  <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
  
  <h3 className="text-xl font-bold text-slate-800 mb-3">100% Verified Tutors</h3>
  <p className="text-gray-600 leading-relaxed">Every tutor on our platform is a rigorously vetted university student. We check college IDs manually so you can trust who is teaching your child.</p>
</div>

{/* Detail Card 2 */}
<div className="bg-blue-500 p-8 rounded-2xl shadow-sm border text-center hover:shadow-md transition">
  
  <Wallet className="w-16 h-16 text-black-600 mx-auto mb-4" />
  
  <h3 className="text-xl font-bold text-white mb-3">Zero Agency Fees</h3>
  <p className="text-white leading-relaxed">Traditional agencies take up to 50% of a teacher's salary. We don't. Tutors keep what they earn, which means parents get highly motivated educators.</p>
</div>

{/* Detail Card 3 */}
<div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-500 text-center hover:shadow-md transition">
  
  <Zap className="w-16 h-16 text-amber-500 mx-auto mb-4" />
  
  <h3 className="text-xl font-bold text-slate-800 mb-3">Instant Connections</h3>
  <p className="text-gray-600 leading-relaxed">No endless waiting or middleman delays. Parents post a job, tutors apply, and you connect instantly via WhatsApp to discuss details.</p>
</div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. THE FOOTER                                */}
      {/* ========================================== */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center">
        <p className="mb-4">© 2026 Luminous Classes. Empowering Students.</p>
        
        {/* --- YOUR SECRET ADMIN SHORTCUT --- */}
        <Link to="/admin" className="text-slate-700 hover:text-slate-500 text-xs font-medium transition">
          Admin Control Room
        </Link>
      </footer>

    </div>
  );
}

export default LandingPage;