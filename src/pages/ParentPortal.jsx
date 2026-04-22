import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ParentPortal() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    parentName: '', subject: '', grade: '', location: '', salary: '', contactNumber: '', requirements: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://luminous-classes-backend.onrender.com/api/jobs', formData);
      setFormData({ parentName: '', subject: '', grade: '', location: '', salary: '', contactNumber: '', requirements: '' });
      alert("Job posted successfully! Tutors will be notified.");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to post job.");
    }
  };

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
          <button type="submit" className="mt-4 p-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md">Publish Requirement</button>
        </form>
      </div>
    </div>
  );
}

export default ParentPortal;