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
      await axios.post('https://luminous-classes-backend.onrender.com/api/tutors', formData);
      alert("Registration successful! Please wait for admin approval before applying to jobs.");
      navigate('/'); // Send them back to the home page
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. This email might already be registered.");
    }
  };

  return (
    // FULL PAGE VINTAGE WRAPPER
    <div className="min-h-screen bg-[#FDF8E7] text-[#2C1810] font-sans selection:bg-[#2C1810] selection:text-[#FDF8E7] p-4 md:p-8">
      
      <div className="max-w-xl mx-auto mt-10">
        
        {/* VINTAGE BACK BUTTON */}
        <button 
          onClick={() => navigate('/')} 
          className="mb-8 px-5 py-2 border-2 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] hover:bg-[#2C1810] hover:text-[#FDF8E7] transition-colors shadow-[2px_2px_0px_rgba(44,24,16,1)] hover:translate-y-px hover:shadow-[1px_1px_0px_rgba(44,24,16,1)]"
        >
          &larr; Back to Home
        </button>

        {/* BRUTALIST REGISTRATION BOX */}
        <div className="bg-[#f0e4cc] p-8 border-4 border-[#2C1810] rounded-none shadow-[8px_8px_0px_rgba(44,24,16,1)] relative">
          
          {/* Official Document "Stamp" Illusion */}
          <div className="absolute -top-6 -right-6 w-24 h-24 border-4 border-[#2C1810] rounded-full flex items-center justify-center bg-[#FDF8E7] transform rotate-12 shadow-[4px_4px_0px_rgba(44,24,16,1)]">
            <span className="font-black uppercase tracking-widest text-[#2C1810] text-sm text-center leading-tight">
              APPLY<br/>ENTRY
            </span>
          </div>

          <h1 
            className="text-4xl font-black uppercase tracking-widest text-[#2C1810] mb-2 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.1)]"
          >
            Join Tutor49
          </h1>
          <p className="text-[#2C1810]/80 font-bold uppercase tracking-widest text-sm mb-10">
            Register as a verified university tutor.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* The Brutalist Input Fields */}
            <input type="text" name="name" placeholder="FULL NAME" value={formData.name} onChange={handleChange} required 
              className="w-full px-4 py-4 rounded-none bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)] text-xl" 
            />
            
            <input type="email" name="email" placeholder="UNIVERSITY OR GMAIL ADDRESS" value={formData.email} onChange={handleChange} required 
              className="w-full px-4 py-4 rounded-none bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)] text-xl" 
            />
            
            <input type="tel" name="phone" placeholder="WHATSAPP NUMBER" value={formData.phone} onChange={handleChange} required 
              className="w-full px-4 py-4 rounded-none bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)] text-xl" 
            />
            <input type="text" name="collegeId" placeholder="ENROLLMENT/ROLL NUMBER" value={formData.collegeId} onChange={handleChange} required 
              className="w-full px-4 py-4 rounded-none bg-[#FDF8E7] border-4 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:bg-white transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)] text-xl" 
            />
            
            <button 
              type="submit" 
              className="mt-6 w-full bg-[#2C1810] text-[#FDF8E7] py-4 rounded-none font-black uppercase tracking-widest border-2 border-[#2C1810] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-y-px hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] transition-all"
            >
              Submit for Verification
            </button>
          </form>
        </div>
          
          <div className="bg-[#FDF8E7] border-2 border-dashed border-[#2C1810] p-4 text-center mt-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]/70">
               Admin review typically takes 24 hours. Misconduct will result in a permanent ban.
            </p>
          </div>

        </div>
      </div>
    
  );
}

export default TutorRegistration;