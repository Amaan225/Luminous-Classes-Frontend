import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck, Wallet, ArrowLeft, CheckCircle2, Award } from 'lucide-react';

function TutorRegistration() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle', 'success', 'error'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    collegeId: '',
    city: 'Lucknow', // Default city
    preferredArea: '' // The new field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await axios.post('https://luminous-classes-backend.onrender.com/api/tutors', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', collegeId: '' });
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SUCCESS STATE UI ---
  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
          <CheckCircle2 className="w-20 h-20 text-indigo-600 mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Received!</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Your profile is now in our verification queue. Our admin team will manually review your details and college ID shortly.
          </p>
          <div className="bg-indigo-50 p-4 rounded-xl mb-8 border border-indigo-100">
            <p className="text-sm text-indigo-800 font-medium">
              Once approved, you will gain full access to unlock "premium" 0% commission leads on the Tutor Board.
            </p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold shadow-md hover:bg-slate-800 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // --- THE MODERN FORM UI ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Join the <span className="text-indigo-600">Elite</span> Network
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Stop giving away 50% of your hard-earned money to traditional agencies. Register once, get verified, and keep 100% of your tuition fees on <span className="text-indigo-600">premium</span> leads.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* THE FORM CONTAINER */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Your Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" name="name" required value={formData.name} onChange={handleChange}
                        className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full"
                        placeholder="e.g. Your beautiful name"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">WhatsApp Number <span className="text-red-500">*</span></label>
                      <input 
                        type="text" name="phone" required value={formData.phone} onChange={handleChange}
                        className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-sm font-medium text-slate-700">Email Address <span className="text-red-500">*</span></label>
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full"
                      placeholder="e.g. tutor@gmail.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">City <span className="text-red-500">*</span></label>
                      <input 
                        type="text" name="city" required value={formData.city} onChange={handleChange}
                        className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-full"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">Preferred Teaching Area <span className="text-red-500">*</span></label>
                      <input 
                        type="text" name="preferredArea" required value={formData.preferredArea} onChange={handleChange}
                        className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-full"
                        placeholder="e.g. Gomti Nagar"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-sm font-medium text-slate-700">Aadhar Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="collegeId" required value={formData.collegeId} onChange={handleChange}
                      className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full"
                      placeholder="e.g. Aadhar Number"
                    />
                    <p className="text-xs text-slate-500 mt-1">This is required for our manual safety verification process.</p>
                  </div>
                </div>

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100">
                    Registration failed. This email or phone number might already be registered.
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
                >
                  {isSubmitting ? 'Submitting Profile...' : 'Submit Application'}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4">
                  By registering, you agree to maintain professional conduct. We reserve the right to ban unverified accounts.
                </p>
              </form>
            </div>
          </div>

          {/* TRUST BADGES SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-6 shadow-md text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-24 h-24 text-white" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white border border-white/20">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Keep 100% of your pay</h3>
              <p className="text-sm text-indigo-100 leading-relaxed relative z-10">
                Agencies take 50% of your first month's salary. At Tutor49, you pay a flat ₹49 to unlock a "premium" lead, and the rest is entirely yours.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck className="w-24 h-24 text-slate-900" />
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-700 border border-slate-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Trusted by Parents</h3>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                We are a closed network. Parents trust us because we only allow verified tutors onto the platform.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Award className="w-24 h-24 text-slate-900" />
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-700 border border-slate-100">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Protected by Refund</h3>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                If you pay to unlock a lead and the parent genuinely declines a demo, our support team will refund you.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TutorRegistration;