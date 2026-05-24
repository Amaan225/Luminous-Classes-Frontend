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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ========================================== */}
      {/* 1. HERO SECTION                            */}
      {/* ========================================== */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200">
        {/* Soft background gradient blob for modern feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 rounded-full blur-3xl opacity-70"></div>
        
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center justify-center text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Lucknow's Direct Network
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Tuto<span className="text-indigo-600">₹49</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Connecting dedicated parents with verified, top-tier university tutors in the area. No hidden agencies. No predatory commissions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl justify-center">
            <Link 
              to="/parent" 
              className="flex-1 bg-indigo-600 text-white rounded-xl py-4 px-8 font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-lg">I am a Parent</div>
              <div className="text-indigo-200 text-xs font-normal mt-0.5">Post a requirement instantly</div>
            </Link>

            <Link 
              to="/tutor" 
              className="flex-1 bg-white text-slate-700 border border-slate-200 rounded-xl py-4 px-8 font-semibold shadow-sm hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-lg">I am a Tutor</div>
              <div className="text-slate-500 text-xs font-normal mt-0.5">Browse verified local jobs</div>
            </Link>
          </div>

          <div className="mt-10">
            <Link to="/register" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              New Tutor? <span className="underline underline-offset-4 decoration-slate-300 hover:decoration-indigo-600">Register Here First</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. VALUE PROPOSITION                       */}
      {/* ========================================== */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            A Smarter Way to Connect
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            We stripped away the heavy agency fees to create a direct, transparent connection between great students and great teachers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">100% Verified</h3>
            <p className="text-slate-600 leading-relaxed">
              Every tutor on our platform is rigorously vetted. We check IDs so you can trust exactly who is teaching your child.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Zero Fees*</h3>
            <p className="text-slate-600 leading-relaxed">
              Agencies take up to 50% of a teacher's salary. We don't. On Premium leads, tutors keep 100% of what they earn.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Access</h3>
            <p className="text-slate-600 leading-relaxed">
              No endless waiting. Parents post a job, tutors apply, and you connect instantly via call to discuss details.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. FAQ SECTION                             */}
      {/* ========================================== */}
      <div className="bg-white border-y border-slate-200 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${isOpen ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                      {faq.answer}
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
      <footer className="bg-slate-900 text-slate-300 py-16 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">TUTO₹49</h2>
          
          <div className="mb-8">
            <p className="text-sm text-slate-400 mb-2">Need Help? Contact our Support Desk</p>
            <a 
              href="mailto:tutor49.official@gmail.com" 
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium text-lg"
            >
              tutor49.official@gmail.com
            </a>
          </div>

          <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026. Empowering Students in Lucknow.</p>
            
            <div className="flex gap-6 text-sm font-medium">
              <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;