import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Wallet, Zap, ChevronDown } from 'lucide-react';

function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqs = [
    {
      question: "How do we work?",
      answer: "We act as a direct, verified bulletin board. Parents post their requirements for free. Verified tutors browse these requirements on their dashboard. If a tutor is interested, they unlock the contact details and negotiate directly with the parent. No middlemen dictating terms."
    },
    {
      question: "What is a Premium Lead?",
      answer: "A Premium Lead is an organic requirement posted directly by a parent on our platform. Tutors unlock these leads with a flat one-time ₹49 fee. After that, 100% of the tuition fee goes directly to the tutor. We charge 0% commission on Premium Leads."
    },
    {
      question: "What is a Classic Lead?",
      answer: "Classic Leads are sourced from our network of partner agencies in Lucknow. Because these come from traditional agencies, the agency will require their standard 50% commission of the first month's fee. We clearly mark these so tutors can choose which leads they want."
    },
    {
      question: "How are tutors verified?",
      answer: "Quality and safety are our highest priorities. Every tutor must register with a valid college ID and contact number. Our admin team manually verifies these credentials before a tutor is granted access to unlock any parent requirements."
    },
    {
      question: "What if the parent declines the demo?",
      answer: "We operate with full transparency. If you unlock a lead and the parent declines to take a demo or refuses the tuition, you are protected by our Refund Policy. Simply contact our support team, and we will process a full refund for that unlock."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* INJECTED: Premium dotted background pattern on the main wrapper */}
      
      {/* ========================================== */}
      {/* 1. HERO SECTION (FULL SCREEN)              */}
      {/* ========================================== */}
      <div className="relative overflow-hidden border-b border-slate-200 min-h-screen flex flex-col justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-indigo-50/80 to-transparent -z-10 rounded-full blur-3xl opacity-80"></div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 w-full py-20">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-700 text-sm md:text-base font-bold mb-10 shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            Lucknow's Direct Network
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-slate-900 mb-8 drop-shadow-sm">
            Tuto<span className="text-indigo-600">₹49</span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
            Connecting dedicated parents with verified, top-tier university tutors in the area. No hidden agencies. No predatory commissions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl justify-center mb-16">
            <Link 
              to="/parent" 
              className="flex-1 bg-indigo-600 text-white rounded-2xl py-6 px-8 font-semibold shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-bold mb-1.5">I am a Parent</div>
              <div className="text-indigo-200 text-sm md:text-base font-medium">Post a requirement instantly</div>
            </Link>

            <Link 
              to="/tutor" 
              className="flex-1 bg-white/90 backdrop-blur-sm text-slate-700 border-2 border-slate-200 rounded-2xl py-6 px-8 font-semibold shadow-sm hover:border-indigo-200 hover:bg-indigo-50/90 hover:text-indigo-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-bold mb-1.5">I am a Tutor</div>
              <div className="text-slate-500 text-sm md:text-base font-medium">Browse verified local jobs</div>
            </Link>
          </div>

          <div className="mt-4">
            <Link to="/register" className="text-base md:text-lg font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
              New Tutor? <span className="underline underline-offset-4 decoration-slate-300 hover:decoration-indigo-600">Register Here First</span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <ChevronDown className="w-8 h-8 text-slate-300" />
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. VALUE PROPOSITION (GRADIENT CARDS)      */}
      {/* ========================================== */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            A <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500">Smarter</span> Way to Connect
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            We stripped away the heavy agency fees to create a direct, transparent connection between parents and teachers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Card 1 with Gradient Border */}
          <div className="group relative p-[1px] rounded-3xl bg-gradient-to-br from-indigo-500 via-blue-400 to-cyan-400 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="bg-white rounded-[calc(1.5rem-1px)] p-10 h-full">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">100% Verified</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Every tutor on our platform is rigorously vetted. We check IDs so you can trust exactly who is teaching your child.
              </p>
            </div>
          </div>

          {/* Card 2 with Gradient Border */}
          <div className="group relative p-[1px] rounded-3xl bg-gradient-to-br from-emerald-500 via-indigo-400 to-blue-400 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
            <div className="bg-white rounded-[calc(1.5rem-1px)] p-10 h-full">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Zero Commissions</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Agencies take up to 50% of a teacher's salary. We don't. On Premium leads, tutors keep 100% of what they earn.
              </p>
            </div>
          </div>

          {/* Card 3 with Gradient Border */}
          <div className="group relative p-[1px] rounded-3xl bg-gradient-to-br from-amber-500 via-indigo-400 to-purple-400 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
            <div className="bg-white rounded-[calc(1.5rem-1px)] p-10 h-full">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Instant Access</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                No endless waiting. Parents post a job, tutors apply, and you connect instantly via call to discuss details.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* 3. FAQ SECTION (GRADIENT FAQ BARS)         */}
      {/* ========================================== */}
      <div className="border-y border-slate-200 py-32 relative">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 tracking-tighter">Frequently</span> Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className={`relative p-[1.5px] rounded-2xl transition-all duration-300 ${isOpen ? 'bg-gradient-to-r from-indigo-500 via-blue-400 to-cyan-400' : 'bg-slate-300 hover:bg-slate-400'}`}
                >
                  <div className={`bg-white rounded-[calc(1rem-1.5px)] overflow-hidden transition-colors duration-200 ${isOpen ? 'bg-indigo-50/40' : ''}`}>
                    <button 
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-6 md:p-8 flex justify-between items-center focus:outline-none"
                    >
                      <span className={`text-lg md:text-xl font-bold pr-4 transition-colors ${isOpen ? 'text-indigo-700' : 'text-slate-900'}`}>{faq.question}</span>
                      <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="p-6 md:p-8 pt-0 text-slate-600 leading-relaxed text-lg font-medium border-t border-slate-100/50">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 4. FOOTER                                  */}
      {/* ========================================== */}
      <footer className="bg-slate-900 text-slate-300 py-20 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tighter">TUTO₹49</h2>
          
          <div className="mb-10">
            <p className="text-base text-slate-400 mb-2 font-medium uppercase tracking-widest">Need Help? Contact our Support Desk</p>
            <a 
              href="mailto:tutor49.official@gmail.com" 
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold text-xl md:text-2xl"
            >
              tutor49.official@gmail.com
            </a>
          </div>

          <div className="border-t border-slate-800 pt-10 mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-medium">© 2026. Empowering Students in Lucknow.</p>
            
            <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;