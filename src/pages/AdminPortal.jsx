import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, UserCheck, Trash2, Edit, CheckCircle2, Lock, ArrowLeft, Search, Plus } from 'lucide-react';

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
    title: '', parentName: '', subject: '', grade: '', city: 'Lucknow', location: '', salary: '', contactNumber: '', requirements: '', 
    leadType: 'classic',
    status: 'approved' 
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
          // THE FIX 1: Pointing to the new Admin Pending route
          const tutorsRes = await axios.get('https://luminous-classes-backend.onrender.com/api/admin/tutors/pending');
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
      // THE FIX 2: Pointing to the new Admin PUT route and passing the 'approved' status
      await axios.put(`https://luminous-classes-backend.onrender.com/api/admin/tutors/${id}/status`, { status: 'approved' });
      setTutors(tutors.map(t => t._id === id ? { ...t, status: 'approved' } : t));
    } catch (error) { console.error("Error approving:", error); }
  };

  const handleLeadChange = (e) => setNewLeadForm({ ...newLeadForm, [e.target.name]: e.target.value });

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
     await axios.post('https://luminous-classes-backend.onrender.com/api/jobs?secret=amaan2026', newLeadForm);
      alert("Lead Successfully Injected!");
      setNewLeadForm({ title: '', parentName: '', subject: '', grade: '', city: 'Lucknow', location: '', salary: '', contactNumber: '', requirements: '', leadType: 'classic', status: 'approved' });
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans p-4 selection:bg-indigo-500 selection:text-white">
        <form 
          onSubmit={(e) => { e.preventDefault(); passcode === 'amaan2026' ? setIsAuthenticated(true) : alert("Access Denied."); setPasscode(''); }} 
          className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden border border-slate-100"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Vault</h2>
            <p className="text-slate-500 text-sm font-medium mt-2">Restricted Access. Authorized Personnel Only.</p>
          </div>
          
          <div className="space-y-6">
            <input 
              type="password" 
              placeholder="Enter Passcode" 
              value={passcode} 
              onChange={(e) => setPasscode(e.target.value)} 
              className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl tracking-[0.2em] font-bold text-slate-900 transition-all" 
            />
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              Unlock Console
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- THE ACTUAL ADMIN PORTAL ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Exit
              </button>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Command Center</h1>
            </div>
            <button 
              onClick={() => { setIsAuthenticated(false); setPasscode(''); }} 
              className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              <Lock className="w-4 h-4" /> Lock Vault
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        
        {/* SECTION 1: QUARANTINE ZONE (PENDING LEADS) */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-500" />
              Pending Leads ({pendingLeads.length})
            </h2>
            {pendingLeads.length > 0 && (
              <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">Action Required</span>
            )}
          </div>
          
          {pendingLeads.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Quarantine is empty. All leads are processed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingLeads.map(job => (
                <div key={job._id} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{job.parentName}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                      📞 <span className="text-slate-700">{job.contactNumber}</span>
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-100">
                      <span>{job.grade} {job.subject}</span>
                      <span className="text-slate-300">|</span>
                      <span>{job.location} {job.city && `, ${job.city}`}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-indigo-600 font-bold">₹{job.salary}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button onClick={() => handleDeleteJob(job._id)} className="flex-1 md:flex-none px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-semibold text-sm transition-colors flex justify-center items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Reject
                    </button>
                    <button onClick={() => handleApproveLead(job)} className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all flex justify-center items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Verify & Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: MANUAL LEAD INJECTION */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Inject Verified Lead</h2>
              <p className="text-sm text-slate-500 mt-0.5">Bypass quarantine and push directly to the live board.</p>
            </div>
          </div>
          
          <form onSubmit={handleCreateLead} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Custom Title (Optional)</label>
                <input type="text" name="title" placeholder="Leave blank for 'STUDENT LEAD'" value={newLeadForm.title} onChange={handleLeadChange} className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Client / Parent Name <span className="text-red-500">*</span></label>
                <input type="text" name="parentName" value={newLeadForm.parentName} onChange={handleLeadChange} required className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Contact Number <span className="text-red-500">*</span></label>
                <input type="text" name="contactNumber" value={newLeadForm.contactNumber} onChange={handleLeadChange} required className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full" placeholder="Exactly 10 digits" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Subject <span className="text-red-500">*</span></label>
                <input type="text" name="subject" value={newLeadForm.subject} onChange={handleLeadChange} required className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Grade / Level <span className="text-red-500">*</span></label>
                <input type="text" name="grade" value={newLeadForm.grade} onChange={handleLeadChange} required className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Salary (₹) <span className="text-red-500">*</span></label>
                <input type="number" min="0" name="salary" value={newLeadForm.salary} onChange={handleLeadChange} required className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">City <span className="text-red-500">*</span></label>
                <input type="text" name="city" value={newLeadForm.city} onChange={handleLeadChange} required className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Area / Location <span className="text-red-500">*</span></label>
                <input type="text" name="location" value={newLeadForm.location} onChange={handleLeadChange} required className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Commission Structure <span className="text-red-500">*</span></label>
                <select name="leadType" value={newLeadForm.leadType} onChange={handleLeadChange} className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full font-medium">
                  <option value="classic">CLASSIC - 50% Partner Agency Fee</option>
                  <option value="premium">PREMIUM - 0% Organic Direct Lead</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Internal Notes / Requirements</label>
                <textarea name="requirements" value={newLeadForm.requirements} onChange={handleLeadChange} className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full h-24 resize-none"></textarea>
              </div>
            </div>
            
            <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 flex justify-center items-center">
              {isSubmitting ? 'Pushing to Database...' : 'Inject Live Lead'}
            </button>
          </form>
        </section>

        {/* SECTION 3: PENDING TUTORS */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-indigo-600" />
              Tutor Verification Queue ({pendingTutors.length})
            </h2>
          </div>
          {pendingTutors.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-8 text-center text-slate-500">
              No pending registrations.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingTutors.map(tutor => (
                <div key={tutor._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="mb-6">
                    <h3 className="font-bold text-lg text-slate-900">{tutor.name}</h3>
                    <div className="space-y-1.5 mt-3 text-sm text-slate-600">
                      <p>✉️ {tutor.email}</p>
                      <p>📞 {tutor.phone}</p>
                    </div>
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">College ID / Roll No</p>
                      <p className="text-sm font-bold text-slate-900">{tutor.collegeId}</p>
                    </div>
                  </div>
                  <button onClick={() => handleApproveTutor(tutor._id)} className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-600 transition-colors shadow-sm">
                    Verify & Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 4: ACTIVE JOBS BOARD WITH SEARCH BAR */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              Active Job Ledger ({filteredActiveJobs.length})
            </h2>
            <div className="w-full md:w-80 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search TK-ID or Name..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {filteredActiveJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center text-slate-500">
                {searchQuery ? "No records match your search." : "No active jobs in the database."}
              </div>
            ) : (
              filteredActiveJobs.map((job) => {
                const jobApps = applications.filter(app => app.jobId === job._id);
                const isPremium = job.leadType === 'premium' || !job.leadType;

                return (
                  <div key={job._id} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col relative">
                    
                    {/* Status Badge */}
                    <div className="absolute top-6 right-6">
                      {isPremium ? (
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                          0% PREMIUM
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                          50% CLASSIC
                        </span>
                      )}
                    </div>

                    {editingJobId === job._id ? (
                      <div className="p-6 md:p-8 bg-indigo-50/50">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-indigo-100">
                          <Edit className="w-5 h-5 text-indigo-600" />
                          <h3 className="text-xl font-bold text-slate-900">Amend Record: {job.displayId}</h3>
                        </div>
                        
                        <form onSubmit={(e) => handleUpdateLead(e, job._id)} className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Title</label>
                              <input type="text" name="title" value={editLeadForm.title || ''} onChange={handleEditChange} className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Name</label>
                              <input type="text" name="parentName" value={editLeadForm.parentName} onChange={handleEditChange} required className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</label>
                              <input type="text" name="contactNumber" value={editLeadForm.contactNumber} onChange={handleEditChange} required className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                              <input type="text" name="subject" value={editLeadForm.subject} onChange={handleEditChange} required className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</label>
                              <input type="text" name="grade" value={editLeadForm.grade} onChange={handleEditChange} required className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Salary</label>
                              <input type="number" name="salary" value={editLeadForm.salary} onChange={handleEditChange} required className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                              <input type="text" name="city" value={editLeadForm.city} onChange={handleEditChange} required className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                            </div>
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location / Area</label>
                              <input type="text" name="location" value={editLeadForm.location} onChange={handleEditChange} required className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                            </div>
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Type</label>
                              <select name="leadType" value={editLeadForm.leadType || 'premium'} onChange={handleEditChange} className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full">
                                <option value="classic">CLASSIC - 50% FEE</option>
                                <option value="premium">PREMIUM - 0% FEE</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requirements</label>
                              <textarea name="requirements" value={editLeadForm.requirements || ''} onChange={handleEditChange} className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full h-20 resize-none"></textarea>
                            </div>
                          </div>
                          
                          <div className="flex gap-4 pt-2">
                            <button type="button" onClick={() => setEditingJobId(null)} className="flex-1 py-3 text-slate-700 bg-white border border-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                            <button type="submit" className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-sm hover:bg-indigo-700 transition-colors">Save Amendments</button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                        
                        {/* Job Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {job.displayId && <span className="text-sm font-bold text-slate-400">{job.displayId}</span>}
                            <h3 className="text-2xl font-bold text-slate-900">{job.title || "STUDENT LEAD"}</h3>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm font-medium text-slate-600">
                            <span className="bg-slate-100 px-3 py-1 rounded-lg">📍 {job.location}{job.city && `, ${job.city}`}</span>
                            <span className="bg-slate-100 px-3 py-1 rounded-lg">💰 ₹{job.salary}</span>
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-lg">
                              👤 {job.parentName} ({job.contactNumber})
                            </span>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3">
                            <button onClick={() => startEditing(job)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                              <Edit className="w-4 h-4" /> Amend
                            </button>
                            <button onClick={() => handleDeleteJob(job._id)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" /> Purge
                            </button>
                          </div>
                        </div>

                        {/* Unlocks Panel */}
                        <div className="w-full md:w-72 bg-slate-50 rounded-2xl p-5 border border-slate-200 shrink-0">
                          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                            Unlocked By 
                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{jobApps.length}</span>
                          </h4>
                          
                          {jobApps.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">No unlocks recorded.</p>
                          ) : (
                            <div className="space-y-3">
                              {jobApps.map(app => (
                                <div key={app._id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                  <p className="font-bold text-slate-900 text-sm">{app.tutorName}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">ID: {app._id.substring(0,8)}</p>
                                  <a href={`https://wa.me/91${app.tutorPhone}`} target="_blank" rel="noreferrer" className="mt-2 block w-full text-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                    Message
                                  </a>
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
        </section>

      </div>
    </div>
  );
}

export default AdminPortal;