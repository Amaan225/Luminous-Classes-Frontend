import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Wallet, Zap, ChevronDown, Star, Quote, Menu, X } from 'lucide-react';

function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- NEW: Smooth Scroll Function ---
  const scrollToFaq = (e) => {
    e.preventDefault();
    const element = document.getElementById('faq');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

 const testimonials = [
    {
      quote: "Agencies used to take 50% of my first month's salary. Here, I paid a flat ₹49 to unlock the lead and kept the entire ₹5,000 tuition fee. This platform actually respects a teacher's hard work.",
      name: "Rahul Verma",
      role: "Independent Tutor",
      avatarBg: "bg-indigo-100 text-indigo-700",
      initial: "R",
      rating: 5
    },
    {
      quote: "Finding a reliable Maths tutor for my son's CBSE boards used to be a nightmare. Here, I connected directly with a fantastic teacher within hours. No middlemen, no hidden fees, just pure transparency.",
      name: "Priya Sharma",
      role: "Parent",
      avatarBg: "bg-emerald-100 text-emerald-700",
      initial: "P",
      rating: 5
    },
    {
      quote: "What I love most is the transparency. You negotiate directly with the tutor before making any commitments. That direct communication gave us the peace of mind we needed to invite a teacher into our home.",
      name: "Vikram Singh",
      role: "Parent",
      avatarBg: "bg-amber-100 text-amber-700",
      initial: "V",
      rating: 5
    },
    {
      quote: "The platform is brilliant. I browse local tuition requirements and only unlock the ones that fit my schedule. No agencies dictating my hours or my fees. Highly recommended for any serious educator.",
      name: "Neha K.",
      role: "Freelance Educator",
      avatarBg: "bg-indigo-100 text-indigo-700",
      initial: "N",
      rating: 5
    },
    {
      quote: "I was struggling with physics concepts, but the tutor my parents found here explained everything so practically. The platform made it so easy to find the exact subject expertise I needed.",
      name: "Ananya M.",
      role: "Student",
      avatarBg: "bg-emerald-100 text-emerald-700",
      initial: "A",
      rating: 4
    }
  ];

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
      answer: "Quality and safety are our highest priorities. Every tutor must register with a Aadhaar card number. Our admin team manually verifies these credentials before a tutor is granted access to unlock any parent requirements."
    },
    {
      question: "What if the parent declines the demo?",
      answer: "We operate with full transparency. If you unlock a lead and the parent declines to take a demo, you are protected by our Refund Policy. Simply contact our support team, and send us the screenshot of the conversation, and we will process a refund for that unlock."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
      
      <style>
        {`
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            animation: infinite-scroll 40s linear infinite;
            width: max-content;
          }
          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* ========================================== */}
      {/* 0. NAVIGATION BAR (VIOLET/BLUE GLASS TINT) */}
      {/* ========================================== */}
      <nav className="fixed top-0 inset-x-0 z-[100] bg-white/40 backdrop-blur-2xl bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/10 border-b border-indigo-100/50 shadow-sm shadow-indigo-500/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900 drop-shadow-sm">
            TUTO₹<span className="text-indigo-600">49</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/parent" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">For Parents</Link>
            <Link to="/tutor" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">For Tutors</Link>
            {/* UPDATED: Smooth Scroll Link */}
            <a href="#faq" onClick={scrollToFaq} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">FAQ</a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/register" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">Register</Link>
            <Link to="/parent" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-slate-900/10 hover:bg-indigo-600 hover:shadow-indigo-600/20 hover:-translate-y-0.5 transition-all">
              Post Requirement
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-indigo-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu (Also Tinted) */}
        <div className={`md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-indigo-100/50 shadow-2xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-8 flex flex-col gap-6">
            <Link to="/parent" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-700 hover:text-indigo-600">For Parents</Link>
            <Link to="/tutor" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-700 hover:text-indigo-600">Browse Jobs</Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-700 hover:text-indigo-600">Register as Tutor</Link>
            {/* UPDATED: Mobile Smooth Scroll Link */}
            <a href="#faq" onClick={(e) => { setIsMobileMenuOpen(false); scrollToFaq(e); }} className="text-lg font-bold text-slate-700 hover:text-indigo-600 cursor-pointer">FAQ</a>
            <div className="pt-6 border-t border-indigo-100/50">
              <Link to="/parent" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex justify-center bg-indigo-600 text-white px-5 py-4 rounded-xl text-lg font-bold shadow-md">
                Post a Requirement
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================== */}
      {/* 1. HERO SECTION                            */}
      {/* ========================================== */}
      <div className="relative overflow-hidden border-b border-slate-200 min-h-screen flex flex-col justify-center pt-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-indigo-50/80 to-transparent -z-10 rounded-full blur-3xl opacity-80"></div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 w-full py-20">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-700 text-sm md:text-base font-bold mb-10 shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            Lucknow's Direct Network
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-slate-900 mb-8 drop-shadow-sm">
            Tuto₹<span className="text-indigo-600">49</span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
            Connecting dedicated parents with verified, top-tier tutors in the area.
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
      {/* 2. VALUE PROPOSITION                       */}
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
          
          <div className="group relative p-[1px] rounded-3xl bg-gradient-to-br from-indigo-500 via-blue-400 to-cyan-400 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="bg-white rounded-[calc(1.5rem-1px)] p-10 h-full overflow-hidden">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">100% Verified</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Every tutor on our platform is experienced and verified. We check IDs so you can trust exactly who is teaching your child.
              </p>
            </div>
          </div>

          <div className="group relative p-[1px] rounded-3xl bg-gradient-to-br from-emerald-500 via-indigo-400 to-blue-400 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
            <div className="bg-white rounded-[calc(1.5rem-1px)] p-10 h-full overflow-hidden">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Zero Commissions</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Agencies take up to 50% of a teacher's salary. We don't. On Premium leads, tutors keep 100% of what they earn.
              </p>
            </div>
          </div>

          <div className="group relative p-[1px] rounded-3xl bg-gradient-to-br from-amber-500 via-indigo-400 to-purple-400 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
            <div className="bg-white rounded-[calc(1.5rem-1px)] p-10 h-full overflow-hidden">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Instant Access</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                No endless waiting. Parents post a job, tutors apply, and you connect instantly via WhatsApp to discuss details.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* 3. TESTIMONIAL MARQUEE SECTION             */}
      {/* ========================================== */}
      <section className="py-24 border-y border-slate-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm"> 
              What <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500">users</span> say about us 
            </h2>
        </div>

        <div className="overflow-hidden relative flex">
          <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

          <div className="flex animate-infinite-scroll">
            {doubledTestimonials.map((test, index) => (
              <div key={index} className="w-[350px] md:w-[450px] flex-shrink-0 px-4">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 h-full flex flex-col justify-between shadow-sm hover:border-indigo-200 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
                  
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-slate-100 -z-10 group-hover:text-indigo-50 transition-colors duration-300" />
                  
                  <div className="mb-8 z-10">
                    <div className="flex gap-0.5 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < test.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium text-lg">"{test.quote}"</p>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-auto z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${test.avatarBg}`}>
                      {test.initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base tracking-tight">{test.name}</h4>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{test.role}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. FAQ SECTION                             */}
      {/* ========================================== */}
      {/* UPDATED: Added scroll-mt-24 so the navbar doesn't cover the title when scrolling down */}
      <div id="faq" className="py-32 relative scroll-mt-24">
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
      {/* 5. FOOTER                                  */}
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