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

  // --- THE VINTAGE RECEIPT SUCCESS SCREEN ---
  if (submittedJob) {
    return (
      <div className="min-h-screen bg-[#FDF8E7] text-[#2C1810] font-sans selection:bg-[#2C1810] selection:text-[#FDF8E7] p-8">
        <div className="max-w-2xl mx-auto mt-10">
          
          <div className="bg-[#f0e4cc] p-10 border-4 border-[#2C1810] shadow-[12px_12px_0px_rgba(44,24,16,1)] text-center relative">
            
            {/* Vintage "Stamp" */}
            <div className="absolute -top-6 -right-6 w-24 h-24 border-4 border-[#2C1810] rounded-full flex items-center justify-center bg-[#FDF8E7] transform rotate-12 shadow-[4px_4px_0px_rgba(44,24,16,1)]">
              <span className="font-black uppercase tracking-widest text-[#2C1810] text-sm text-center leading-tight">
                VERIFIED<br/>ENTRY
              </span>
            </div>

            <h3 className="text-4xl font-black uppercase tracking-widest text-[#2C1810] mb-4 border-b-4 border-dashed border-[#2C1810] pb-4 inline-block">
              Requirement Posted
            </h3>
            <p className="text-[#2C1810]/80 font-bold uppercase tracking-widest text-sm mb-10 mt-4">
              Your job has been securely added to the Tutor49 network.
            </p>

            {/* Ticket Stub Style ID Box */}
            <div className="bg-[#FDF8E7] border-4 border-[#2C1810] p-6 mb-10 inline-block min-w-[250px] shadow-[6px_6px_0px_rgba(44,24,16,1)]">
              <p className="text-xs font-black uppercase tracking-widest text-[#2C1810]/70 mb-2">Official Reference ID</p>
              <p className="text-5xl font-black text-[#2C1810] tracking-[0.1em]">
                {submittedJob.displayId || "TK-PNDG"}
              </p>
            </div>

            <div className="bg-[#FDF8E7] border-4 border-[#2C1810] p-6 text-sm text-[#2C1810] mb-10 text-left relative">
              <span className="absolute -top-3 left-4 bg-[#f0e4cc] px-2 font-black uppercase tracking-widest text-xs border-2 border-[#2C1810]">
                Admin Notice
              </span>
              <p className="font-black uppercase tracking-widest mb-2 text-base mt-2">Need to make changes?</p>
              <p className="font-bold uppercase tracking-wider leading-relaxed text-xs opacity-80">
                To edit details, update the salary, or close this listing once you hire a tutor, simply WhatsApp our Admin team at <span className="font-black border-b-2 border-[#2C1810]">+91 7007112372</span> with your Reference ID.
              </p>
            </div>
            
            <button 
              onClick={handleReset} 
              className="px-8 py-4 bg-[#2C1810] text-[#FDF8E7] font-black uppercase tracking-widest border-4 border-[#2C1810] hover:bg-[#FDF8E7] hover:text-[#2C1810] transition-colors shadow-[6px_6px_0px_rgba(44,24,16,1)] hover:translate-y-px hover:shadow-[3px_3px_0px_rgba(44,24,16,1)]"
            >
              Post Another Requirement
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- THE VINTAGE FORM UI ---
  return (
    <div className="min-h-screen bg-[#FDF8E7] text-[#2C1810] font-sans selection:bg-[#2C1810] selection:text-[#FDF8E7] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <button 
          onClick={() => navigate('/')} 
          className="mb-8 px-5 py-2 border-2 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] hover:bg-[#2C1810] hover:text-[#FDF8E7] transition-colors shadow-[2px_2px_0px_rgba(44,24,16,1)] hover:translate-y-px hover:shadow-[1px_1px_0px_rgba(44,24,16,1)]"
        >
          &larr; Back to Home
        </button>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* LEFT COLUMN: The Trust Content */}
          <div className="space-y-8 md:pr-8">
            <h1 
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#2C1810] leading-none"
              style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}
            >
              FIND THE <br/> PERFECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2C1810] to-[#5c3726] border-b-8 border-[#2C1810]">TUTOR.</span>
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-[#2C1810]/80 leading-relaxed border-l-4 border-[#2C1810] pl-4">
              Tutor49 connects families in Lucknow with bright, verified university students who are passionate about teaching. Skip the expensive agencies and hire top-tier talent directly.
            </p>
            
            <div className="space-y-8 pt-6">
              {/* Feature 1 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-[#f0e4cc] p-2 border-4 border-[#2C1810] shadow-[2px_2px_0px_rgba(44,24,16,1)]">
                  <svg className="w-6 h-6 text-[#2C1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="ml-5">
                  <h4 className="text-xl font-black uppercase tracking-widest text-[#2C1810]">Verified Tutors</h4>
                  <p className="text-[#2C1810]/70 mt-2 text-xs font-bold uppercase tracking-wider leading-relaxed">We rigorously screen students from top local colleges to ensure quality, knowledge, and safety.</p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-[#f0e4cc] p-2 border-4 border-[#2C1810] shadow-[2px_2px_0px_rgba(44,24,16,1)]">
                  <svg className="w-6 h-6 text-[#2C1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="ml-5">
                  <h4 className="text-xl font-black uppercase tracking-widest text-[#2C1810]">Zero Agency Fees</h4>
                  <p className="text-[#2C1810]/70 mt-2 text-xs font-bold uppercase tracking-wider leading-relaxed">You pay the tutor directly. We do not charge parents any hidden commissions or middleman fees.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-[#f0e4cc] p-2 border-4 border-[#2C1810] shadow-[2px_2px_0px_rgba(44,24,16,1)]">
                  <svg className="w-6 h-6 text-[#2C1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="ml-5">
                  <h4 className="text-xl font-black uppercase tracking-widest text-[#2C1810]">Fast Matching</h4>
                  <p className="text-[#2C1810]/70 mt-2 text-xs font-bold uppercase tracking-wider leading-relaxed">Post your requirement below, and start receiving interest from qualified tutors within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Brutalist Form */}
          <div className="bg-[#f0e4cc] p-8 md:p-10 border-4 border-[#2C1810] shadow-[12px_12px_0px_rgba(44,24,16,1)]">
            <h3 className="text-3xl font-black uppercase tracking-widest text-[#2C1810] mb-8 border-b-4 border-[#2C1810] pb-4 inline-block">
              Post Requirement
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="relative">
                <label className="absolute -top-3 left-3 bg-[#f0e4cc] px-1 text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Parent Name</label>
                <input type="text" name="parentName" placeholder="ENTER YOUR NAME" value={formData.parentName} onChange={handleChange} required 
                  className="w-full p-4 bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)]" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="absolute -top-3 left-3 bg-[#f0e4cc] px-1 text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Subject</label>
                  <input type="text" name="subject" placeholder="E.G. MATH" value={formData.subject} onChange={handleChange} required 
                    className="w-full p-4 bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)]" 
                  />
                </div>
                <div className="relative">
                  <label className="absolute -top-3 left-3 bg-[#f0e4cc] px-1 text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Grade</label>
                  <input type="text" name="grade" placeholder="E.G. 10TH" value={formData.grade} onChange={handleChange} required 
                    className="w-full p-4 bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)]" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="absolute -top-3 left-3 bg-[#f0e4cc] px-1 text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Location</label>
                  <input type="text" name="location" placeholder="YOUR AREA" value={formData.location} onChange={handleChange} required 
                    className="w-full p-4 bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)]" 
                  />
                </div>
                <div className="relative">
                  <label className="absolute -top-3 left-3 bg-[#f0e4cc] px-1 text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Salary (₹)</label>
                  <input type="number" name="salary" placeholder="AMOUNT" value={formData.salary} onChange={handleChange} required 
                    className="w-full p-4 bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)]" 
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="absolute -top-3 left-3 bg-[#f0e4cc] px-1 text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Contact Number</label>
                <input type="tel" name="contactNumber" placeholder="10-DIGIT NUMBER" value={formData.contactNumber} onChange={handleChange} required 
                  className="w-full p-4 bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)]" 
                />
              </div>

              <div className="relative">
                <label className="absolute -top-3 left-3 bg-[#f0e4cc] px-1 text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Extra Requirements</label>
                <textarea name="requirements" placeholder="ANY EXTRA REQUIREMENTS OR PREFERENCES?" value={formData.requirements} onChange={handleChange} 
                  className="w-full p-4 bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)] h-32 resize-none"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-4 p-5 border-4 border-[#2C1810] font-black uppercase tracking-widest transition-all shadow-[6px_6px_0px_rgba(44,24,16,1)] ${
                  isSubmitting 
                  ? 'bg-[#2C1810]/50 text-[#FDF8E7] cursor-not-allowed shadow-none translate-y-[6px]' 
                  : 'bg-[#2C1810] text-[#FDF8E7] hover:bg-[#FDF8E7] hover:text-[#2C1810] hover:translate-y-px hover:shadow-[3px_3px_0px_rgba(44,24,16,1)]'
                }`}
              >
                {isSubmitting ? 'TRANSMITTING...' : 'PUBLISH REQUIREMENT'}
              </button>
              
              <div className="bg-[#FDF8E7] border-2 border-dashed border-[#2C1810] p-3 text-center mt-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]/70">
                  🔒 Data encrypted. Only verified tutors can unlock your contact.
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ParentPortal;