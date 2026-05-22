import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Wallet, Zap } from 'lucide-react';

function LandingPage() {
  return (
    // FULL PAGE VINTAGE WRAPPER
    <div className="min-h-screen bg-[#f3f1ec] text-[#2C1810] font-sans selection:bg-[#2C1810] selection:text-[#FDF8E7]">
      
      {/* ========================================== */}
      {/* 1. THE HERO SECTION (The Hook)               */}
      {/* ========================================== */}
      <div className="min-h-[90vh] flex flex-col items-center justify-center p-4 relative border-b-8 border-double border-[#2C1810]">
        
        {/* Vintage Top Label */}
        <div className="border-4 border-[#2C1810] px-4 py-1 mb-8 bg-[#f0e4cc] transform -rotate-2 shadow-[2px_2px_0px_rgba(44,24,16,1)]">
          <span className="font-black uppercase tracking-widest text-xs"> LUCKNOW'S DIRECT NETWORK</span>
        </div>

        <h1 
  className="text-7xl md:text-9xl text-[#2C1810] mb-6 tracking-tighter text-center font-black uppercase flex justify-center items-baseline"
  style={{ textShadow: '6px 6px 0px rgba(0,0,0,0.15)' }}
>
  <span 
    className="font-serif italic normal-case text-[#8B1A1A] tracking-normal pr-2 text-[1.1em]"
    style={{ textShadow: 'none' }}
  >
    Tuto₹
  </span>
  <span>49</span>
</h1>
        
        <p className="text-sm md:text-base text-[#2C1810]/80 mb-12 text-center max-w-2xl font-bold uppercase tracking-widest leading-relaxed">
          Connecting dedicated parents with verified, top-tier university tutors in the area. No hidden agencies.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center z-10 px-4">
          {/* Parent Button (Dark Theme) */}
          <Link 
            to="/parent" 
            className="flex-1 bg-[#2C1810] text-[#FDF8E7] border-4 border-[#2C1810] text-center py-6 px-8 shadow-[8px_8px_0px_rgba(44,24,16,1)] transition-all duration-200 hover:translate-y-1 hover:shadow-[4px_4px_0px_rgba(44,24,16,1)] group"
          >
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2 group-hover:scale-105 transition-transform">I am a Parent</h2>
            <p className="text-[#FDF8E7]/70 text-xs font-bold uppercase tracking-wider">Post a requirement instantly.</p>
          </Link>

          {/* Tutor Button (Light Theme) */}
          <Link 
            to="/tutor" 
            className="flex-1 bg-[#FDF8E7] text-[#2C1810] border-4 border-[#2C1810] text-center py-6 px-8 shadow-[8px_8px_0px_rgba(44,24,16,1)] transition-all duration-200 hover:bg-[#f0e4cc] hover:translate-y-1 hover:shadow-[4px_4px_0px_rgba(44,24,16,1)] group"
          >
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2 group-hover:scale-105 transition-transform">I am a Tuto₹</h2>
            <p className="text-[#2C1810]/70 text-xs font-bold uppercase tracking-wider">Browse verified local jobs.</p>
          </Link>
        </div>

        <div className="text-center mt-12 z-10">
          <Link 
            to="/register" 
            className="inline-block border-b-4 border-[#2C1810] text-[#2C1810] hover:bg-[#2C1810] hover:text-[#FDF8E7] font-black uppercase tracking-widest transition-colors py-1 px-2"
          >
            New Tutor? Register Here First
          </Link>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 font-black uppercase tracking-widest text-[#2C1810]/40 text-xs hidden md:block">
          ↓ Scroll for details ↓
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. THE VALUE PROPOSITION (The Details)       */}
      {/* ========================================== */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-[#2C1810] mb-6 uppercase tracking-widest inline-block border-b-8 border-[#2C1810] pb-2">
  A <span className="font-serif italic normal-case text-[#8B1A1A] tracking-normal px-3 text-[1.1em]">Smarter</span> WAY
</h2>
          <p className="text-sm md:text-base font-bold uppercase tracking-widest text-[#2C1810]/70 max-w-2xl mx-auto leading-relaxed mt-4">
            We stripped away the heavy agency fees to create a direct, transparent connection between great students and great teachers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Detail Card 1 */}
          <div className="bg-[#f0e4cc] p-8 border-4 border-[#2C1810] relative shadow-[8px_8px_0px_rgba(44,24,16,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(44,24,16,1)] transition-all duration-300">
            <div className="absolute -top-5 -left-5 bg-[#FDF8E7] border-4 border-[#2C1810] p-3 shadow-[4px_4px_0px_rgba(44,24,16,1)]">
              <GraduationCap className="w-8 h-8 text-[#2C1810]" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-[#2C1810] mb-4 mt-4">100% Verified</h3>
            <p className="text-sm font-bold uppercase tracking-wider leading-relaxed text-[#2C1810]/80">
              Every tutor on our platform is a rigorously vetted Tutors. We check IDs so you can trust who is teaching.
            </p>
          </div>

          {/* Detail Card 2 */}
          <div className="bg-[#2C1810] p-8 border-4 border-[#2C1810] relative shadow-[8px_8px_0px_rgba(44,24,16,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(44,24,16,1)] transition-all duration-300">
            <div className="absolute -top-5 -left-5 bg-[#FDF8E7] border-4 border-[#2C1810] p-3 shadow-[4px_4px_0px_rgba(44,24,16,1)]">
              <Wallet className="w-8 h-8 text-[#2C1810]" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-[#FDF8E7] mb-4 mt-4">Zero Fees*</h3>
            <p className="text-sm font-bold uppercase tracking-wider leading-relaxed text-[#FDF8E7]/80">
              Agencies take up to 50% of a teacher's salary. We don't. Tutors keep what they earn, meaning you get motivated educators.
            </p>
          </div>

          {/* Detail Card 3 */}
          <div className="bg-[#f0e4cc] p-8 border-4 border-[#2C1810] relative shadow-[8px_8px_0px_rgba(44,24,16,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(44,24,16,1)] transition-all duration-300">
            <div className="absolute -top-5 -left-5 bg-[#FDF8E7] border-4 border-[#2C1810] p-3 shadow-[4px_4px_0px_rgba(44,24,16,1)]">
              <Zap className="w-8 h-8 text-[#2C1810]" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-[#2C1810] mb-4 mt-4">Instant Access</h3>
            <p className="text-sm font-bold uppercase tracking-wider leading-relaxed text-[#2C1810]/80">
              No endless waiting. Parents post a job, tutors apply, and you connect instantly via chat/call to discuss details.
            </p>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* 3. THE FOOTER                                */}
      {/* ========================================== */}
      <footer className="bg-[#2C1810] text-[#FDF8E7] py-12 text-center border-t-8 border-[#2C1810]">
        <h2 className="text-3xl font-black uppercase tracking-widest mb-6">TUTO₹49</h2>
        
        {/* --- NEW VINTAGE SUPPORT SECTION --- */}
        <div className="mb-8 inline-block border-2 border-dashed border-[#FDF8E7]/30 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#FDF8E7]/60 mb-2">
            OFFICIAL SUPPORT DESK
          </p>
          <a 
            href="mailto:tutor49.official@gmail.com" 
            className="text-sm md:text-base font-black tracking-widest hover:text-[#f0e4cc] transition-colors border-b-2 border-[#FDF8E7] pb-1"
          >
            TUTOR49.OFFICIAL@GMAIL.COM
          </a>
        </div>
        {/* ------------------------------------ */}

        <p className="mb-8 font-bold uppercase tracking-widest text-xs opacity-70">
          © 2026. Empowering Students in Lucknow.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 text-xs font-black uppercase tracking-widest">
          <Link to="/terms" className="hover:text-[#f0e4cc] hover:underline transition-colors">Terms & Conditions</Link>
          <Link to="/terms" className="hover:text-[#f0e4cc] hover:underline transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#f0e4cc] hover:underline transition-colors">Refund Policy</Link>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;