import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- RAZORPAY SCRIPT LOADER ---
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function TutorPortal() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appData, setAppData] = useState({ tutorName: '', tutorPhone: '', pitch: '' });

  // --- FILTER STATE ---
  const [filterSubject, setFilterSubject] = useState('');
  const [filterArea, setFilterArea] = useState('');

  // --- MODAL STATE VARIABLES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [tutorPhone, setTutorPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [unlockedNumber, setUnlockedNumber] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true); 
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

  // --- THE RAZORPAY CHECKOUT ENGINE ---
  const handleRazorpayPayment = async () => {
    if (tutorPhone.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    setPaymentStatus('submitting');

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Check your connection.");
      setPaymentStatus('idle');
      return;
    }

    try {
      const orderResponse = await fetch('https://luminous-classes-backend.onrender.com/api/payment/create-order', {
        method: 'POST',
      });
      const orderData = await orderResponse.json();

      if (!orderData.id) throw new Error("Failed to generate order ID");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Tutor49",
        description: `Premium Lead Unlock: ${selectedJob.subject}`,
        order_id: orderData.id,
        prefill: {
          contact: tutorPhone
        },
        theme: {
          color: "#2C1810" // Updated to match vintage theme
        },
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('https://luminous-classes-backend.onrender.com/api/unlocks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jobId: selectedJob._id,
                tutorPhone: tutorPhone,
                transactionId: response.razorpay_payment_id
              })
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyResponse.ok) {
              setUnlockedNumber(verifyData.unlockedContact);
              setPaymentStatus('success');
            } else {
              alert("Payment verified, but failed to fetch contact. Please contact Admin.");
              setPaymentStatus('idle');
            }
          } catch (err) {
            console.error(err);
            alert("Network error unlocking contact.");
            setPaymentStatus('idle');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function () {
        setPaymentStatus('idle');
      });

    } catch (error) {
      console.error(error);
      alert("Could not initialize payment. Please try again later.");
      setPaymentStatus('idle');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSubject = job.subject.toLowerCase().includes(filterSubject.toLowerCase());
    const matchesArea = job.location.toLowerCase().includes(filterArea.toLowerCase());
    return matchesSubject && matchesArea;
  });

  return (
    <div className="max-w-5xl mx-auto p-8 font-sans">
      <button onClick={() => navigate('/')} className="text-blue-500 hover:underline mb-6 font-semibold">
        &larr; Back to Home
      </button>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Tutor Dashboard</h1>
          <p className="text-gray-600">Find your next student.</p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder=" Filter by Subject..." 
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2C1810] bg-white shadow-sm flex-1"
          />
          <input 
            type="text" 
            placeholder=" Filter by Area..." 
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2C1810] bg-white shadow-sm flex-1"
          />
        </div>
      </div>

      {/* --- RENDER THE FILTERED VINTAGE TICKETS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isLoading ? (
          <div className="col-span-full py-12 text-center bg-[#FDF8E7] rounded-xl border border-[#2C1810]/20 shadow-sm animate-pulse">
            <p className="text-xl font-bold text-[#2C1810] mb-2"> Fetching Local Requirements...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="col-span-full py-10 text-center bg-gray-50 rounded-xl border text-gray-500 text-lg">
            No jobs match your current filters.
          </div>
        ) : (
          filteredJobs.map((job) => {
            // Dynamic check based on your MongoDB schema (defaults to premium if missing)
            const isPremium = job.leadType === 'premium' || !job.leadType;
            const displayId = job.displayId || job._id.substring(0, 6).toUpperCase();
            
            return (
              <div key={job._id} className="flex w-full drop-shadow-xl group hover:-translate-y-1 transition-transform duration-300">
                {/* MAIN TICKET BODY */}
                <div className="flex-grow bg-[#FDF8E7] text-[#2C1810] p-6 rounded-l-lg border-2 border-r-0 border-[#2C1810] relative">
                  
                  <div className="flex justify-between items-start mb-4 border-b-2 border-dashed border-[#2C1810] pb-2">
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-widest" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                        STUDENT LEAD
                      </h2>
                      <p className="text-xs font-bold tracking-widest opacity-80 mt-1">TK-{displayId}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold uppercase tracking-wider block opacity-70">Price</span>
                      <span className="text-xl font-black">₹49</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-sm uppercase font-bold">
                    <div>
                      <span className="block opacity-50 text-[10px]">Target Level</span>
                      <span>{job.grade} - {job.subject}</span>
                    </div>
                    <div>
                      <span className="block opacity-50 text-[10px]">Location Zone</span>
                      <span> {job.location}</span>
                    </div>
                  </div>

                  <div className="bg-[#f0e4cc] p-3 rounded border border-[#2C1810]/20 mb-4 relative min-h-[60px]">
                    <span className="absolute -top-2 left-2 bg-[#FDF8E7] px-1 text-[10px] font-bold uppercase tracking-wider text-[#2C1810]/60">
                      Parent Notes
                    </span>
                    <p className="italic text-xs leading-relaxed mt-1">
                      "{job.requirements || job.parentDescription || "Standard home tuition requirement verified by Tutor49."}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] uppercase font-bold opacity-60 max-w-[150px] leading-tight">
                      Verified requirement. Unlock for direct WhatsApp.
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedJob(job);
                        setIsModalOpen(true);
                      }}
                      className="px-6 py-2 text-sm font-bold uppercase bg-[#2C1810] text-[#FDF8E7] rounded shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:translate-y-px hover:shadow-[1px_1px_0px_rgba(0,0,0,0.3)] transition-all whitespace-nowrap"
                    >
                      Unlock Contact
                    </button>
                  </div>
                </div>

                {/* TICKET STUB */}
                <div className="w-16 md:w-20 bg-[#FDF8E7] border-2 border-l-2 border-dashed border-[#2C1810] rounded-r-lg flex flex-col justify-center items-center relative overflow-hidden">
                  <div className={`w-full py-2 text-center border-b-2 border-dashed border-[#2C1810] ${isPremium ? 'bg-green-700' : 'bg-orange-600'} text-[#FDF8E7]`}>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-tight px-1">
                      {isPremium ? '0% COMM' : '25% FEE'}
                    </p>
                  </div>
                  <div className="flex-grow flex items-center justify-center py-4">
                    <h3 className="text-lg md:text-xl font-black tracking-[0.2em] uppercase text-[#2C1810]" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                      {isPremium ? 'PREMIUM' : 'CLASSIC'}
                    </h3>
                  </div>
                  <div className="w-full text-center py-2 border-t-2 border-dashed border-[#2C1810]">
                    <span className="text-[8px] font-mono font-bold tracking-widest">{displayId}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================= */}
      {/* --- PAYMENT MODAL OVERLAY (THE VAULT DOOR) --- */}
      {/* ========================================= */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FDF8E7] border-4 border-[#2C1810] rounded-xl shadow-[8px_8px_0px_rgba(44,24,16,1)] max-w-md w-full overflow-hidden">
            
            <div className="bg-[#2C1810] p-6 text-center text-[#FDF8E7] border-b-4 border-[#2C1810]">
              <h3 className="text-2xl font-black uppercase tracking-widest mb-1">Unlock Lead</h3>
              <p className="text-[#FDF8E7]/80 text-xs font-bold uppercase">Pay ₹49 to instantly reveal the parent's contact.</p>
            </div>

            <div className="p-6">
              {paymentStatus === 'success' ? (
                <div className="text-center py-4">
                  <div className="text-green-700 text-5xl mb-2 font-black">✓</div>
                  <h4 className="text-xl font-black uppercase tracking-widest text-[#2C1810] mb-4">Lead Unlocked!</h4>
                  
                  <div className="bg-[#f0e4cc] border-2 border-[#2C1810] rounded-lg p-6 mb-6 relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FDF8E7] px-2 text-xs font-black uppercase tracking-wider text-[#2C1810] border-2 border-[#2C1810]">
                      Parent Contact
                    </span>
                    <p className="text-3xl font-black text-[#2C1810] tracking-wider mt-2">
                      {unlockedNumber}
                    </p>
                  </div>
                  
                  <p className="text-[#2C1810]/70 text-xs font-bold mb-6 px-4 uppercase leading-relaxed">
                    Mention Tutor49 when calling. Misconduct will result in a permanent ban.
                  </p>

                  <button 
                    onClick={() => { 
                      setIsModalOpen(false); 
                      setPaymentStatus('idle'); 
                      setTutorPhone('');
                      setUnlockedNumber('');
                    }}
                    className="w-full bg-[#2C1810] text-[#FDF8E7] py-3 rounded font-black uppercase tracking-widest hover:translate-y-px transition-transform"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#2C1810] mb-2">
                      Enter your WhatsApp Number:
                    </label>
                    <input 
                      type="text" 
                      placeholder="10-digit number"
                      value={tutorPhone}
                      onChange={(e) => setTutorPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded bg-white border-2 border-[#2C1810] focus:ring-0 focus:outline-none focus:border-blue-600 transition-colors text-lg font-bold tracking-widest text-center"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-3 text-[#2C1810] font-black uppercase tracking-wider border-2 border-[#2C1810] rounded hover:bg-[#2C1810]/5 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleRazorpayPayment}
                      disabled={tutorPhone.length < 10 || paymentStatus === 'submitting'}
                      className="flex-[2] px-4 py-3 bg-[#2C1810] text-[#FDF8E7] font-black uppercase tracking-wider rounded disabled:opacity-50 transition shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:translate-y-px hover:shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
                    >
                      {paymentStatus === 'submitting' ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        <>Pay ₹49 Securely</>
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