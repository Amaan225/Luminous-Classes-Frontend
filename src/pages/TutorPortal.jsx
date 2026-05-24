import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, BookOpen, GraduationCap, ArrowLeft, Search, ShieldCheck, Banknote } from 'lucide-react';


function TutorPortal() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'premium', 'classic'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [tutorPhone, setTutorPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, submitting, success
  const [unlockedNumber, setUnlockedNumber] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://luminous-classes-backend.onrender.com/api/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const openUnlockModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    setPaymentStatus('idle');
    setTutorPhone('');
    setUnlockedNumber('');
  };

  const handleRazorpayPayment = async () => {
    if (tutorPhone.length < 10) return;
    setPaymentStatus('submitting');

    try {
      // 1. Create order on backend
      const orderRes = await axios.post('https://luminous-classes-backend.onrender.com/api/payment/create-order');
      const order = orderRes.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // TODO: Replace with env variable in production
        amount: order.amount,
        currency: order.currency,
        name: "Tutor49",
        description: `Unlock Lead: ${selectedJob.displayId || selectedJob.subject}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify on backend and get the unmasked number
            const verifyRes = await axios.post('https://luminous-classes-backend.onrender.com/api/unlocks', {
              jobId: selectedJob._id,
              tutorPhone: tutorPhone,
              transactionId: response.razorpay_payment_id
            });
            
            setUnlockedNumber(verifyRes.data.unlockedContact);
            setPaymentStatus('success');
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
            setPaymentStatus('idle');
          }
        },
        prefill: {
          contact: tutorPhone,
        },
        theme: {
          color: "#4f46e5", // Indigo-600 to match modern theme
        },
        modal: {
          ondismiss: function() {
            setPaymentStatus('idle');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Could not initialize payment gateway.");
      setPaymentStatus('idle');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.leadType === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Board
            </button>
            <div className="text-center sm:text-right">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Available Requirements</h1>
              <p className="text-xs text-slate-500 font-medium mt-1 flex items-center justify-center sm:justify-end gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> All leads manually verified
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button 
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}
          >
            All Leads ({jobs.length})
          </button>
          <button 
            onClick={() => setFilter('premium')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${filter === 'premium' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Premium (0% Commission)
          </button>
          <button 
            onClick={() => setFilter('classic')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${filter === 'classic' ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Classic (50% Agency Commission)
          </button>
        </div>

        {/* JOB GRID */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Fetching verified leads...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No leads found</h3>
            <p className="text-slate-500">There are currently no requirements matching this filter. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const isPremium = job.leadType === 'premium' || !job.leadType;
              
              return (
                <div key={job._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                  
                  {/* Card Header (Badges) */}
                  <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-slate-400 tracking-wider">
                        {job.displayId || 'TK-XXXX'}
                      </span>
                      {isPremium ? (
                        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold border border-indigo-100 w-max">
                          <ShieldCheck className="w-3.5 h-3.5" /> 0% COMMISSION
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-200 w-max">
                          CLASSIC AGENCY LEAD
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-lg font-black text-green-700 bg-slate-50 px-3 py-1 rounded-lg shadow-sm border border-slate-100">
  <Banknote className="w-5 h-5" />
  ₹{job.salary}
</span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2">
                      {job.subject} Tutor Required
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                          <GraduationCap className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="font-medium">{job.grade}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                          <MapPin className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="font-medium">{job.location}</span>
                      </div>
                    </div>

                    {job.requirements && (
                      <div className="mt-5 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-100 relative">
                        <BookOpen className="w-4 h-4 text-yellow-400 absolute top-4 left-4" />
                        <p className="pl-7 line-clamp-3">{job.requirements}</p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer (Action) */}
                  <div className="p-5 pt-0 mt-auto">
                    <button 
                      onClick={() => openUnlockModal(job)}
                      className="w-full py-3.5 bg-slate-900 text-amber-400 rounded-xl font-bold tracking-wide border border-amber-500/30 shadow-lg hover:bg-slate-800 hover:border-amber-400 hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 group"
                    >
                      Unlock for ₹{job.price || 49}
                      <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* THE MODERN FULL-SCREEN UNLOCK MODAL        */}
      {/* ========================================== */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
          
          <div className="bg-white rounded-3xl shadow-2xl w-[95vw] max-w-6xl min-h-[90vh] flex flex-col transform transition-all my-auto overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-indigo-600 p-8 md:p-10 text-center text-white relative">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Secure this Lead</h3>
                <p className="text-indigo-100 text-sm md:text-base font-medium">
                  Pay a flat ₹{selectedJob.price || 49} to instantly reveal the parent's contact number.
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-12 flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full">
              
              {paymentStatus === 'success' ? (
                <div className="text-center py-4">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h4 className="text-3xl font-extrabold text-slate-900 mb-8">Lead Unlocked Successfully</h4>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 mb-8 relative max-w-2xl mx-auto shadow-sm">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold tracking-wide">
                      PARENT CONTACT NUMBER
                    </span>
                    <p className="text-5xl md:text-6xl font-black text-slate-900 tracking-wider mt-4">
                      {unlockedNumber}
                    </p>
                  </div>
                  
                  <p className="text-slate-500 text-sm md:text-base font-medium mb-10 px-4 max-w-2xl mx-auto">
                    Important: Please mention Tutor49 when you WhatsApp them. Maintain professional conduct at all times to avoid platform bans.
                  </p>

                  <button 
                    onClick={() => { 
                      setIsModalOpen(false); 
                      setPaymentStatus('idle'); 
                      setTutorPhone('');
                      setUnlockedNumber('');
                    }}
                    className="w-full max-w-lg mx-auto block bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors"
                  >
                    Close & Return to Dashboard
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <h4 className="text-2xl font-bold text-slate-900">Platform Guarantees</h4>
                    <p className="text-slate-500 mt-2">Please read before proceeding with the payment</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 font-bold shadow-sm text-sm">1</div>
                        <h5 className="font-bold text-slate-900">Zero Commissions</h5>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed pl-11">
                        For Premium leads, you will not be charged any agency commission after this one-time unlock fee.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 font-bold shadow-sm text-sm">2</div>
                        <h5 className="font-bold text-slate-900">Contact Access Only</h5>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed pl-11">
                        This payment gives you the parent's contact number. It does not instantly guarantee you the job.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 font-bold shadow-sm text-sm">3</div>
                        <h5 className="font-bold text-slate-900">The Hiring Process</h5>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed pl-11">
                        You secure the job only after contacting the parent, giving a free demo, and getting their approval.
                      </p>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 opacity-10 text-indigo-600">
                        <ShieldCheck className="w-32 h-32" />
                      </div>
                      <div className="flex items-center gap-3 mb-3 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm text-sm">4</div>
                        <h5 className="font-bold text-indigo-900">Refund Policy</h5>
                      </div>
                      <p className="text-sm text-indigo-800 leading-relaxed pl-11 relative z-10">
                        If you contact the client and they refuse a demo, you get a  refund with nominal fee deduction.
                      </p>
                    </div>
                  </div>

                  <div className="mb-8 max-w-2xl mx-auto w-full">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 text-center">
                      Confirm your registered WhatsApp Number:
                    </label>
                    <input 
                      type="text" 
                      placeholder="10-digit number"
                      value={tutorPhone}
                      onChange={(e) => setTutorPhone(e.target.value)}
                      className="w-full px-6 py-5 rounded-2xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-xl font-bold tracking-widest text-center shadow-sm"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto w-full">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 text-slate-700 bg-white font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleRazorpayPayment}
                      disabled={tutorPhone.length < 10 || paymentStatus === 'submitting'}
                      className="flex-[2] py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex justify-center items-center"
                    >
                      {paymentStatus === 'submitting' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <>Pay Securely via Razorpay</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TutorPortal;