import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPortal() {
  const navigate = useNavigate();
  
  // --- THE BOUNCER STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');

  // --- YOUR EXISTING ADMIN STATE ---
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // --- INJECTION FORM STATE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    title: '', parentName: '', subject: '', grade: '', location: '', salary: '', contactNumber: '', requirements: '', 
    leadType: 'classic',
    status: 'approved' // <-- Admin injections bypass quarantine
  });

  const [editingJobId, setEditingJobId] = useState(null);
  const [editLeadForm, setEditLeadForm] = useState({});

  const fetchJobs = async () => {
    try {
      const jobsRes = await axios.get('https://luminous-classes-backend.onrender.com/api/jobs?secret=amaan2026');
      setJobs(jobsRes.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();

      const fetchRest = async () => {
        try {
          const appsRes = await axios.get('https://luminous-classes-backend.onrender.com/api/applications');
          setApplications(appsRes.data);
        } catch (e) { console.error(e); }

        try {
          const tutorsRes = await axios.get('https://luminous-classes-backend.onrender.com/api/tutors');
          setTutors(tutorsRes.data);
        } catch (e) { console.error(e); }
      };
      fetchRest();
    }
  }, [isAuthenticated]);

  const handleDeleteJob = async (id) => {
    if (window.confirm("Purge this record permanently?")) {
      await axios.delete(`https://luminous-classes-backend.onrender.com/api/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
    }
  };

  // --- NEW: APPROVE LEAD FUNCTION ---
  const handleApproveLead = async (job) => {
    if (window.confirm(`Did you call ${job.parentName} and verify this requirement?`)) {
      try {
        await axios.put(`https://luminous-classes-backend.onrender.com/api/jobs/${job._id}`, { ...job, status: 'approved' });
        alert("Lead Verified & Published to Tutor Board!");
        fetchJobs();
      } catch (error) {
        console.error("Error approving lead:", error);
        alert("Failed to approve lead.");
      }
    }
  };

  const handleApproveTutor = async (id) => {
    try {
      await axios.patch(`https://luminous-classes-backend.onrender.com/api/tutors/${id}/approve`);
      setTutors(tutors.map(t => t._id === id ? { ...t, status: 'approved' } : t));
    } catch (error) { console.error("Error approving:", error); }
  };

  const handleLeadChange = (e) => setNewLeadForm({ ...newLeadForm, [e.target.name]: e.target.value });

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('https://luminous-classes-backend.onrender.com/api/jobs', newLeadForm);
      alert("Lead Successfully Injected!");
      setNewLeadForm({ title: '', parentName: '', subject: '', grade: '', location: '', salary: '', contactNumber: '', requirements: '', leadType: 'classic', status: 'approved' });
      fetchJobs(); 
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to inject lead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (job) => {
    setEditingJobId(job._id);
    setEditLeadForm({ ...job }); 
  };

  const handleEditChange = (e) => {
    setEditLeadForm({ ...editLeadForm, [e.target.name]: e.target.value });
  };

  const handleUpdateLead = async (e, id) => {
    e.preventDefault();
    try {
      await axios.put(`https://luminous-classes-backend.onrender.com/api/jobs/${id}`, editLeadForm);
      alert("Record successfully amended.");
      setEditingJobId(null);
      fetchJobs(); 
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Failed to update record.");
    }
  };

  // --- FILTERING LOGIC ---
  const pendingLeads = jobs.filter(job => job.status === 'pending');
  
  // Active jobs are either explicitly approved, or old jobs that don't have a status yet
  const activeJobs = jobs.filter(job => job.status === 'approved' || !job.status);
  
  const filteredActiveJobs = activeJobs.filter(job => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const displayIdMatch = job.displayId && job.displayId.toLowerCase().includes(query);
    const parentNameMatch = job.parentName && job.parentName.toLowerCase().includes(query);
    return displayIdMatch || parentNameMatch;
  });

  const pendingTutors = tutors.filter(t => t.status === 'pending');

  // --- THE LOCK SCREEN UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C1810] font-sans p-4">
        <form onSubmit={(e) => { e.preventDefault(); passcode === 'amaan2026' ? setIsAuthenticated(true) : alert("Access Denied."); setPasscode(''); }} 
          className="bg-[#FDF8E7] p-10 border-8 border-double border-[#2C1810] shadow-[16px_16px_0px_rgba(0,0,0,1)] flex flex-col gap-6 w-full max-w-md relative">
          <div className="absolute -top-6 -left-6 bg-[#2C1810] text-[#FDF8E7] font-black uppercase tracking-widest px-3 py-1 text-xs border-4 border-[#FDF8E7]">RESTRICTED</div>
          <div className="text-center mb-4 mt-2">
            <h2 className="text-4xl font-black uppercase tracking-widest text-[#2C1810]">Admin Vault</h2>
            <p className="text-[#2C1810]/70 mt-2 font-bold uppercase tracking-widest text-xs">Authorized Personnel Only</p>
          </div>
          <input type="password" placeholder="ENTER PASSCODE" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="p-4 border-4 border-[#2C1810] bg-[#f0e4cc] focus:outline-none focus:bg-white text-center text-2xl tracking-[0.5em] font-black uppercase text-[#2C1810] shadow-[4px_4px_0px_rgba(44,24,16,1)]" />
          <button type="submit" className="bg-[#2C1810] text-[#FDF8E7] font-black uppercase tracking-widest p-4 hover:bg-[#FDF8E7] hover:text-[#2C1810] border-4 border-[#2C1810] transition-colors shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] mt-2">Unlock Console</button>
        </form>
      </div>
    );
  }

  // --- THE ACTUAL ADMIN PORTAL ---
  return (
    <div className="min-h-screen bg-[#FDF8E7] text-[#2C1810] font-sans selection:bg-[#2C1810] selection:text-[#FDF8E7] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-8 border-dashed border-[#2C1810] pb-6">
          <div>
            <button onClick={() => navigate('/')} className="text-[#2C1810] hover:underline mb-4 font-black uppercase tracking-widest text-xs border-2 border-[#2C1810] px-3 py-1 bg-[#f0e4cc]">&larr; Public Site</button>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-[#2C1810]">Command Center</h1>
          </div>
          <button onClick={() => { setIsAuthenticated(false); setPasscode(''); }} className="mt-4 md:mt-0 bg-[#2C1810] text-[#FDF8E7] px-6 py-3 font-black uppercase tracking-widest border-4 border-[#2C1810] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-y-px transition-transform">Lock Vault</button>
        </div>

        {/* SECTION 1: QUARANTINE ZONE (PENDING LEADS) */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-black uppercase tracking-widest text-red-800">Pending Leads ({pendingLeads.length})</h2>
            <span className="bg-red-800 text-white px-2 py-1 text-[10px] font-black tracking-widest uppercase">Action Required</span>
          </div>
          
          {pendingLeads.length === 0 ? (
            <div className="bg-[#f0e4cc] p-6 border-4 border-dashed border-red-800/30 text-center font-bold uppercase tracking-widest text-red-900/50">Quarantine is empty.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingLeads.map(job => (
                <div key={job._id} className="bg-red-50 border-4 border-red-800 shadow-[8px_8px_0px_rgba(153,27,27,1)] p-6 relative">
                  <div className="absolute top-0 right-0 bg-red-800 text-white px-3 py-1 text-xs font-black tracking-widest uppercase border-b-4 border-l-4 border-red-800">UNVERIFIED</div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-widest text-red-900">{job.parentName}</h3>
                      <p className="text-sm font-bold uppercase tracking-widest mt-1">📞 {job.contactNumber}</p>
                      <div className="mt-3 text-xs font-black uppercase tracking-widest bg-red-200 text-red-900 inline-block px-2 py-1 border border-red-900">
                        {job.grade} {job.subject} | {job.location} | ₹{job.salary}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4 md:mt-0 w-full md:w-auto">
                      <button onClick={() => handleApproveLead(job)} className="bg-green-700 text-white px-6 py-3 font-black uppercase tracking-widest border-4 border-green-900 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-y-px transition-all">
                        Approve & Publish
                      </button>
                      <button onClick={() => handleDeleteJob(job._id)} className="bg-transparent text-red-900 px-6 py-2 font-black uppercase tracking-widest border-4 border-red-900 hover:bg-red-900 hover:text-white transition-all text-xs">
                        Reject (Spam)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: MANUAL LEAD INJECTION */}
        <div className="mb-16 bg-[#f0e4cc] p-6 md:p-8 border-4 border-[#2C1810] shadow-[12px_12px_0px_rgba(44,24,16,1)] relative">
          <div className="absolute -top-4 left-6 bg-[#2C1810] text-[#FDF8E7] px-3 py-1 font-black uppercase tracking-widest text-xs border-2 border-[#2C1810]">INTERNAL TOOL</div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#2C1810] mb-6 border-b-2 border-[#2C1810] pb-2 inline-block">Inject Verified Lead</h2>
          
          <form onSubmit={handleCreateLead} className="flex flex-col gap-5">
            <input type="text" name="title" placeholder="CUSTOM TITLE (E.g. SCHOOL TEACHER) - LEAVE BLANK FOR 'STUDENT LEAD'" value={newLeadForm.title} onChange={handleLeadChange} className="w-full p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none focus:bg-white" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" name="parentName" placeholder="CLIENT / PARENT NAME" value={newLeadForm.parentName} onChange={handleLeadChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none focus:bg-white" />
              <input type="text" name="contactNumber" placeholder="CONTACT NUMBER" value={newLeadForm.contactNumber} onChange={handleLeadChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none focus:bg-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <input type="text" name="subject" placeholder="SUBJECT" value={newLeadForm.subject} onChange={handleLeadChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none focus:bg-white" />
              <input type="text" name="grade" placeholder="GRADE / LEVEL" value={newLeadForm.grade} onChange={handleLeadChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none focus:bg-white" />
              <input type="text" name="salary" placeholder="SALARY (₹)" value={newLeadForm.salary} onChange={handleLeadChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none focus:bg-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              <input type="text" name="location" placeholder="LOCATION ZONE" value={newLeadForm.location} onChange={handleLeadChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none focus:bg-white" />
              <div className="relative">
                <label className="absolute -top-3 left-2 bg-[#f0e4cc] px-1 text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Commission Structure</label>
                <select name="leadType" value={newLeadForm.leadType} onChange={handleLeadChange} className="w-full p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none cursor-pointer">
                  <option value="classic">CLASSIC - 50% PARTNER AGENCY FEE</option>
                  <option value="premium">PREMIUM - 0% ORGANIC DIRECT LEAD</option>
                </select>
              </div>
            </div>
            <textarea name="requirements" placeholder="INTERNAL NOTES & REQUIREMENTS" value={newLeadForm.requirements} onChange={handleLeadChange} className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none focus:bg-white h-24 resize-none"></textarea>
            
            <button type="submit" disabled={isSubmitting} className="bg-[#2C1810] text-[#FDF8E7] font-black uppercase tracking-widest p-4 border-4 border-[#2C1810] shadow-[6px_6px_0px_rgba(0,0,0,0.3)] hover:translate-y-px transition-all">
              {isSubmitting ? 'UPLOADING...' : 'INJECT LIVE LEAD INTO SYSTEM'}
            </button>
          </form>
        </div>

        {/* SECTION 3: WAITING ROOM */}
        <div className="mb-16">
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#2C1810] mb-6">Pending Tutors ({pendingTutors.length})</h2>
          {pendingTutors.length === 0 ? (
            <div className="bg-[#FDF8E7] p-6 border-4 border-dashed border-[#2C1810]/30 text-center font-bold uppercase tracking-widest text-[#2C1810]/50">Queue is empty.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingTutors.map(tutor => (
                <div key={tutor._id} className="bg-white p-5 border-4 border-[#2C1810] shadow-[6px_6px_0px_rgba(44,24,16,1)] flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="font-black text-xl uppercase tracking-widest">{tutor.name}</p>
                    <p className="text-xs font-bold uppercase tracking-wider mt-2 opacity-70">✉️ {tutor.email}</p>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1 opacity-70">📞 {tutor.phone}</p>
                    <p className="text-sm font-black text-[#2C1810] mt-3 border-t-2 border-dashed pt-2">ID: {tutor.collegeId}</p>
                  </div>
                  <button onClick={() => handleApproveTutor(tutor._id)} className="w-full bg-[#2C1810] text-[#FDF8E7] py-2 font-black uppercase tracking-widest border-2 border-[#2C1810] hover:bg-[#FDF8E7] hover:text-[#2C1810] transition-colors">Verify & Approve</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4: ACTIVE JOBS BOARD WITH SEARCH BAR */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-4 border-[#2C1810] pb-6 gap-4">
            <h2 className="text-2xl font-black uppercase tracking-widest text-[#2C1810]">
              Active Job Ledger ({filteredActiveJobs.length})
            </h2>
            <div className="w-full md:w-80 relative">
              <label className="absolute -top-3 left-2 bg-[#FDF8E7] px-1 text-[10px] font-black uppercase tracking-widest text-[#2C1810] z-10">Search Vault</label>
              <input type="text" placeholder="ENTER TK-ID OR CLIENT NAME..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-3 border-4 border-[#2C1810] bg-white font-black uppercase tracking-wider focus:outline-none focus:bg-[#f0e4cc] transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)]" />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {filteredActiveJobs.length === 0 ? (
              <div className="bg-[#FDF8E7] p-6 border-4 border-dashed border-[#2C1810]/30 text-center font-bold uppercase tracking-widest text-[#2C1810]/50">
                {searchQuery ? "No records match your search." : "No active jobs in the database."}
              </div>
            ) : (
              filteredActiveJobs.map((job) => {
                const jobApps = applications.filter(app => app.jobId === job._id);
                const isPremium = job.leadType === 'premium' || !job.leadType;

                return (
                  <div key={job._id} className="bg-white border-4 border-[#2C1810] shadow-[8px_8px_0px_rgba(44,24,16,1)] relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-3 py-1 font-black uppercase text-[10px] tracking-widest border-b-4 border-l-4 border-[#2C1810] ${isPremium ? 'bg-green-300 text-green-900' : 'bg-orange-400 text-orange-950'}`}>
                      {isPremium ? '0% PREMIUM' : '50% CLASSIC'}
                    </div>

                    {editingJobId === job._id ? (
                      <div className="p-6 md:p-8 bg-[#f0e4cc] border-b-4 border-[#2C1810]">
                        <h3 className="text-2xl font-black uppercase tracking-widest text-[#2C1810] mb-6 border-b-2 border-dashed border-[#2C1810] pb-2">Amend Record: {job.displayId}</h3>
                        <form onSubmit={(e) => handleUpdateLead(e, job._id)} className="flex flex-col gap-4">
                          <input type="text" name="title" placeholder="LEAD TITLE" value={editLeadForm.title || ''} onChange={handleEditChange} className="w-full p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="parentName" placeholder="CLIENT NAME" value={editLeadForm.parentName} onChange={handleEditChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none" />
                            <input type="text" name="contactNumber" placeholder="CONTACT" value={editLeadForm.contactNumber} onChange={handleEditChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="subject" placeholder="SUBJECT" value={editLeadForm.subject} onChange={handleEditChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none" />
                            <input type="text" name="grade" placeholder="GRADE" value={editLeadForm.grade} onChange={handleEditChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none" />
                            <input type="text" name="salary" placeholder="SALARY" value={editLeadForm.salary} onChange={handleEditChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <input type="text" name="location" placeholder="LOCATION" value={editLeadForm.location} onChange={handleEditChange} required className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none" />
                            <select name="leadType" value={editLeadForm.leadType || 'premium'} onChange={handleEditChange} className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none cursor-pointer">
                              <option value="classic">CLASSIC - 50% PARTNER AGENCY FEE</option>
                              <option value="premium">PREMIUM - 0% ORGANIC DIRECT LEAD</option>
                            </select>
                          </div>
                          <textarea name="requirements" placeholder="REQUIREMENT DETAILS" value={editLeadForm.requirements || ''} onChange={handleEditChange} className="p-3 border-4 border-[#2C1810] bg-[#FDF8E7] font-black uppercase tracking-wider focus:outline-none h-24 resize-none"></textarea>
                          
                          <div className="flex gap-4 mt-2">
                            <button type="button" onClick={() => setEditingJobId(null)} className="flex-1 bg-[#FDF8E7] text-[#2C1810] py-3 font-black uppercase tracking-widest border-4 border-[#2C1810] hover:bg-[#2C1810] hover:text-[#FDF8E7] transition-colors shadow-[4px_4px_0px_rgba(44,24,16,1)] hover:translate-y-px hover:shadow-[2px_2px_0px_rgba(44,24,16,1)]">Cancel</button>
                            <button type="submit" className="flex-[2] bg-[#2C1810] text-[#FDF8E7] py-3 font-black uppercase tracking-widest border-4 border-[#2C1810] shadow-[4px_4px_0px_rgba(44,24,16,1)] hover:translate-y-px hover:shadow-[2px_2px_0px_rgba(44,24,16,1)] transition-transform">Save Amendments</button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 border-b-4 border-[#2C1810] pb-4">
                          <div className="pr-16">
                            <h2 className="text-3xl font-black uppercase tracking-widest text-[#2C1810]">
                              {job.displayId && <span className="opacity-50 mr-3">[{job.displayId}]</span>}
                              {job.title || "STUDENT LEAD"}
                            </h2>
                            <p className="font-bold uppercase tracking-widest text-sm mt-2 opacity-80">📍 {job.location} | 💰 ₹{job.salary}</p>
                            <p className="font-black uppercase tracking-widest text-xs mt-3 text-blue-900 bg-blue-100 px-2 py-1 inline-block border border-blue-900">
                              CLIENT: {job.parentName} ({job.contactNumber})
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 mt-4 md:mt-0">
                            <button onClick={() => startEditing(job)} className="bg-[#f0e4cc] text-[#2C1810] px-4 py-2 font-black uppercase tracking-widest border-4 border-[#2C1810] shadow-[4px_4px_0px_rgba(44,24,16,1)] hover:translate-y-px transition-transform whitespace-nowrap text-xs">Amend Record</button>
                            <button onClick={() => handleDeleteJob(job._id)} className="bg-red-600 text-white px-4 py-2 font-black uppercase tracking-widest border-4 border-red-900 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-y-px transition-transform whitespace-nowrap text-xs">Purge Record</button>
                          </div>
                        </div>

                        <div className="bg-[#f0e4cc] p-4 border-4 border-[#2C1810]">
                          <h3 className="font-black uppercase tracking-widest text-[#2C1810] mb-4 border-b-2 border-dashed border-[#2C1810] pb-2">Unlocked By ({jobApps.length})</h3>
                          {jobApps.length === 0 ? (
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">No unlocks recorded.</p>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {jobApps.map(app => (
                                <div key={app._id} className="bg-white p-3 border-2 border-[#2C1810] flex justify-between items-center shadow-[2px_2px_0px_rgba(44,24,16,1)]">
                                  <div>
                                    <p className="font-black uppercase tracking-widest text-sm">{app.tutorName}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-70">Trans: {app._id.substring(0,8)}</p>
                                  </div>
                                  <a href={`https://wa.me/91${app.tutorPhone}`} target="_blank" rel="noreferrer" className="bg-[#2C1810] text-[#FDF8E7] px-3 py-1 font-black uppercase text-xs tracking-widest border-2 border-[#2C1810] hover:bg-[#FDF8E7] hover:text-[#2C1810] transition-colors">Message</a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminPortal;