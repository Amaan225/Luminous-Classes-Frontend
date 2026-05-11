import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ParentPortal() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedJob, setSubmittedJob] = useState(null); 
  const [formData, setFormData] = useState({
    parentName: '', subject: '', grade: '', location: '', salary: '', contactNumber: '', requirements: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    
    try {
      const response = await axios.post('https://luminous-classes-backend.onrender.com/api/jobs', formData);
      setSubmittedJob(response.data);
      setFormData({ parentName: '', subject: '', grade: '', location: '', salary: '', contactNumber: '', requirements: '' });
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleReset = () => {
    setSubmittedJob(null); 
  };

  // --- THE CONCIERGE SUCCESS SCREEN ---
  if (submittedJob) {
    return (
      <div className="max-w-3xl mx-auto p-8 font-sans mt-10">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
          <div className="text-green-500 text-6xl mb-6">✓</div>
          <h3 className="text-3xl font-bold text-slate-800 mb-3">Requirement Posted!</h3>
          <p className="text-slate-600 mb-8 text-lg">Your job has been securely added to the Tutor Kart network.</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 inline-block min-w-[250px]">
            <p className="text-sm text-blue-800 font-semibold mb-2">Your Reference ID</p>
            <p className="text-4xl font-bold text-blue-700 tracking-wider">
              {submittedJob.displayId || "TK-PENDING"}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-600 mb-8">
            <p className="font-semibold text-slate-800 mb-2 text-base">Need to make changes?</p>
            <p>To edit details, update the salary, or close this listing once you hire a tutor, simply WhatsApp our Admin team at <span className="font-bold text-slate-900">+91 7007112372</span> with your Reference ID.</p>
          </div>
          
          <button 
            onClick={handleReset} 
            className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-md"
          >
            Post Another Requirement
          </button>
        </div>
      </div>
    );
  }

  // --- THE WARM-UP FORM UI ---
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 font-sans">
      <button onClick={() => navigate('/')} className="text-blue-600 hover:underline mb-8 font-semibold flex items-center">
        &larr; Back to Home
      </button>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COLUMN: The Trust Content */}
        <div className="space-y-6 md:pr-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Find the perfect <span className="text-blue-600">home tutor</span> for your child.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Tutor Kart connects families in Lucknow with bright, verified university students who are passionate about teaching. Skip the expensive agencies and hire top-tier talent directly.
          </p>
          
          <div className="space-y-6 pt-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1 bg-green-100 p-1.5 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div className="ml-4">
                <h4 className="text-xl font-bold text-slate-800">Verified Tutors</h4>
                <p className="text-slate-600 mt-1">We rigorously screen students from top local colleges to ensure quality, knowledge, and safety.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1 bg-green-100 p-1.5 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div className="ml-4">
                <h4 className="text-xl font-bold text-slate-800">Zero Agency Fees</h4>
                <p className="text-slate-600 mt-1">You pay the tutor directly. We do not charge parents any hidden commissions or middleman fees.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1 bg-green-100 p-1.5 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div className="ml-4">
                <h4 className="text-xl font-bold text-slate-800">Fast Matching</h4>
                <p className="text-slate-600 mt-1">Post your requirement below, and start receiving interest from qualified tutors within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Post Your Requirement</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input type="text" name="parentName" placeholder="Your Name" value={formData.parentName} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50 outline-none transition" />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="subject" placeholder="Subject (e.g., Math)" value={formData.subject} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50 outline-none transition" />
              <input type="text" name="grade" placeholder="Grade (e.g., 10th)" value={formData.grade} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50 outline-none transition" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="location" placeholder="Your Location" value={formData.location} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50 outline-none transition" />
              <input type="number" name="salary" placeholder="Salary Offered (₹)" value={formData.salary} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50 outline-none transition" />
            </div>
            
            <input type="tel" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50 outline-none transition" />
            <textarea name="requirements" placeholder="Any extra requirements or preferences?" value={formData.requirements} onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 h-28 resize-none bg-gray-50 outline-none transition"></textarea>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`mt-2 p-4 text-white font-bold rounded-xl shadow-md transition ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              {isSubmitting ? 'Posting Securely...' : 'Publish Requirement'}
            </button>
            <p className="text-xs text-center text-slate-500 mt-2">Your contact details are encrypted and securely stored.</p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ParentPortal;