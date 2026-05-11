import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ParentPortal() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedJob, setSubmittedJob] = useState(null); // <-- NEW STATE: Tracks if we should show the success screen
  const [formData, setFormData] = useState({
    parentName: '', subject: '', grade: '', location: '', salary: '', contactNumber: '', requirements: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    
    try {
      // 1. Capture the response so we can get the new displayId (TK-1234)
      const response = await axios.post('https://luminous-classes-backend.onrender.com/api/jobs', formData);
      
      // 2. Set the submitted job to trigger the success screen
      setSubmittedJob(response.data);
      
      // 3. Clear the form data in the background
      setFormData({ parentName: '', subject: '', grade: '', location: '', salary: '', contactNumber: '', requirements: '' });
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleReset = () => {
    setSubmittedJob(null); // Go back to the blank form
  };

  // --- THE CONCIERGE SUCCESS SCREEN ---
  if (submittedJob) {
    return (
      <div className="max-w-3xl mx-auto p-8 font-sans mt-10">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
          <div className="text-green-500 text-6xl mb-6">✓</div>
          <h3 className="text-3xl font-bold text-slate-800 mb-3">Requirement Posted!</h3>
          
          <p className="text-slate-600 mb-8 text-lg">
            Your job has been securely added to the Tutor Kart network.
          </p>

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

  // --- THE ORIGINAL FORM ---
  return (
    <div className="max-w-3xl mx-auto p-8 font-sans">
      <button onClick={() => navigate('/')} className="text-blue-500 hover:underline mb-6 font-semibold">
        &larr; Back to Home
      </button>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Parent Portal</h1>
      <p className="text-gray-600 mb-8">Post your tuition requirement here.</p>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="parentName" placeholder="Your Name" value={formData.parentName} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="subject" placeholder="Subject (e.g., Math)" value={formData.subject} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50" />
            <input type="text" name="grade" placeholder="Grade (e.g., 10th)" value={formData.grade} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="location" placeholder="Your Location" value={formData.location} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50" />
            <input type="number" name="salary" placeholder="Salary Offered (₹)" value={formData.salary} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50" />
          </div>
          <input type="tel" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50" />
          <textarea name="requirements" placeholder="Any extra requirements?" value={formData.requirements} onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 h-24 resize-none bg-gray-50"></textarea>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`mt-4 p-4 text-white font-bold rounded-lg shadow-md transition ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Posting Job...' : 'Publish Requirement'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ParentPortal;