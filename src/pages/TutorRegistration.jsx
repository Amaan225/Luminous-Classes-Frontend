import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TutorRegistration() {
  const navigate = useNavigate();
  // Notice we added email here!
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', collegeId: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tutors', formData);
      alert("Registration successful! Please wait for admin approval before applying to jobs.");
      navigate('/'); // Send them back to the home page
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. This email might already be registered.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 font-sans mt-10 bg-white rounded-xl shadow-lg border border-gray-100">
      <button onClick={() => navigate('/')} className="text-blue-500 hover:underline mb-6 font-semibold">
        &larr; Back to Home
      </button>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Join Luminous</h1>
      <p className="text-gray-600 mb-8">Register as a verified university tutor.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50" />
        
        {/* NEW EMAIL FIELD */}
        <input type="email" name="email" placeholder="University or Gmail Address" value={formData.email} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50" />
        
        <input type="tel" name="phone" placeholder="WhatsApp Number" value={formData.phone} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50" />
        <input type="text" name="collegeId" placeholder="University Enrollment/Roll Number" value={formData.collegeId} onChange={handleChange} required className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-gray-50" />
        
        <button type="submit" className="mt-4 p-4 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 shadow-md transition">
          Submit for Verification
        </button>
      </form>
    </div>
  );
}

export default TutorRegistration;