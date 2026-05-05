import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import myQR from '../assets/my-qr.jpg'; // Make sure the extension matches your file!

function TutorPortal() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [applyingTo, setApplyingTo] = useState(null); 
  const [appData, setAppData] = useState({ tutorName: '', tutorPhone: '', pitch: '' });

  // --- 1. NEW STATE FOR FILTERS ---
  const [filterSubject, setFilterSubject] = useState('');
  const [filterArea, setFilterArea] = useState('');

  // --- MODAL STATE VARIABLES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [tutorPhone, setTutorPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle');

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

  const handleAppChange = (e) => setAppData({ ...appData, [e.target.name]: e.target.value });

  const submitApplication = async (e, jobId) => {
    e.preventDefault();
    try {
      await axios.post('https://luminous-classes-backend.onrender.com/api/applications', { ...appData, jobId });
      alert("Application sent successfully! The parent will contact you.");
      setApplyingTo(null);
      setAppData({ tutorName: '', tutorPhone: '', pitch: '' });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send application.");
    }
  };

  // --- 2. THE FILTER ENGINE ---
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

        {/* --- 3. THE SEARCH BAR UI --- */}
        <div className="mt-4 md:mt-0 flex gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder=" Filter by Subject..." 
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white shadow-sm flex-1"
          />
          <input 
            type="text" 
            placeholder=" Filter by Area..." 
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white shadow-sm flex-1"
          />
        </div>
      </div>

      {/* --- RENDER THE FILTERED JOBS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center bg-blue-50 rounded-xl border border-blue-100 shadow-sm animate-pulse">
            <p className="text-xl font-bold text-blue-600 mb-2"> Connecting to Luminous Servers...</p>
            <p className="text-sm text-blue-500">Waking up the database. This usually takes about 15 seconds on the first load!</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="col-span-full py-10 text-center bg-gray-50 rounded-xl border text-gray-500 text-lg">
            No jobs match your current filters.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm relative overflow-hidden transition hover:shadow-md">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{job.subject} - {job.grade}</h3>
              <p className="text-gray-600 mb-1 font-medium"> {job.location}</p>
              <p className="text-green-600 mb-4 font-bold">{job.salary}</p>
              
              {applyingTo === job._id ? (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-3">
                  <h4 className="font-semibold text-slate-700 text-sm">Premium Lead</h4>
                  <p className="text-xs text-slate-500 mb-2">This is a verified parent requirement. Unlock to get direct WhatsApp contact.</p>
                  
                  <div className="flex gap-2 mt-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setSelectedJob(job); 
                        setIsModalOpen(true); 
                      }} 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition text-sm flex items-center justify-center gap-1"
                    >
                      <span>Unlock Contact</span>
                      <span className="bg-blue-800 px-1.5 py-0.5 rounded text-xs">₹49</span>
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={() => setApplyingTo(null)} 
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-700 py-2 rounded font-semibold transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setApplyingTo(job._id)} className="w-full mt-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition border border-slate-200">
                  View Details
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* ========================================= */}
      {/* --- PAYMENT MODAL OVERLAY (THE VAULT DOOR) --- */}
      {/* ========================================= */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-900 p-6 text-center text-white">
              <h3 className="text-2xl font-bold mb-1">Unlock Lead</h3>
              <p className="text-slate-300 text-sm">Pay ₹49 to instantly unlock the parent's contact.</p>
            </div>

            <div className="p-6">
              {paymentStatus === 'success' ? (
                <div className="text-center py-6">
                  <div className="text-green-500 text-5xl mb-4">✓</div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Request Submitted!</h4>
                  <p className="text-slate-600 text-sm">The Admin will verify your payment and send the number to your WhatsApp shortly.</p>
                  <button 
                    onClick={() => { 
                      setIsModalOpen(false); 
                      setPaymentStatus('idle'); 
                      setTransactionId('');
                      setTutorPhone('');
                    }}
                    className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* REAL QR CODE */}
                  <div className="flex justify-center mb-6">
                    <div className="w-48 h-48 bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm p-2">
                       <img src={myQR} alt="Scan to Pay" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  
                  <p className="text-center text-sm font-semibold text-slate-700 mb-6">
                    UPI ID: <span className="text-blue-600">amaank7007-1@okicici</span>
                  </p>

                  {/* Input Fields */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Your WhatsApp Number</label>
                      <input 
                        type="text" 
                        placeholder="10-digit number"
                        value={tutorPhone}
                        onChange={(e) => setTutorPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">12-Digit UPI Transaction ID</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 312345678901"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 transition text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={async () => {
                        setPaymentStatus('submitting');
                        try {
                          const response = await fetch('https://luminous-classes-backend.onrender.com/api/unlocks', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              jobId: selectedJob._id,
                              tutorPhone,
                              transactionId
                            })
                          });
                          
                          if (response.ok) {
                            setPaymentStatus('success');
                          } else {
                            alert("Something went wrong. Please try again.");
                            setPaymentStatus('idle');
                          }
                        } catch (error) {
                          console.error(error);
                          alert("Failed to connect to server.");
                          setPaymentStatus('idle');
                        }
                      }}
                      disabled={transactionId.length < 5 || tutorPhone.length < 10 || paymentStatus === 'submitting'}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition text-sm flex justify-center items-center"
                    >
                      {paymentStatus === 'submitting' ? (
                        <span className="animate-pulse">Submitting...</span>
                      ) : (
                        'Submit Payment'
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