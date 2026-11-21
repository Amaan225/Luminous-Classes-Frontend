import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import TutorAccountReview from './TutorAccountReview';
import { approvedUnlocksForJob } from '../lib/unlocks';

// Admin-only timestamps, always IST. Returns 'Not recorded' when the event time was never stored.
const formatWhen = value => {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return 'Not recorded';
  return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) + ' IST';
};
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, UserCheck, Trash2, Edit, CheckCircle2, Lock, ArrowLeft, Search, Plus } from 'lucide-react';

function AdminPortal() {
  const navigate = useNavigate();

  // --- THE BOUNCER STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [session, setSession] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  useEffect(() => {
    // One-time handoff from a verified Google admin; the server minted this short-lived admin session.
    try {
      const raw = sessionStorage.getItem('t49-admin-handoff');
      sessionStorage.removeItem('t49-admin-handoff');
      const s = raw && JSON.parse(raw);
      if (s?.token && s.expiresAt > Date.now()) { setSession(s); setActiveTab('ledger'); setIsAuthenticated(true); }
    } catch { /* ignore malformed handoff */ }
  }, []);
  const clearSession = useCallback(() => {
    setIsAuthenticated(false);
    setSession(null);
    setPasscode('');
    setJobs([]);
    setUnlocks([]);
    setUnlocksStatus('loading');
    setTutors([]);
    setEditingJobId(null);
    setEditLeadForm({});
  }, []);
  const adminApi = useMemo(() => {
    const client = axios.create();
    if (import.meta.env.VITE_TUTOR_PREVIEW === 'true') client.interceptors.request.use(config => {
      config.url = config.url.replace('https://luminous-classes-backend.onrender.com', '');
      return config;
    });
    client.interceptors.request.use(config => {
      if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
      return config;
    });
    client.interceptors.response.use(response => response, error => {
      if (error.response?.status === 401) {
        clearSession();
        setLoginError('Session expired. Please sign in again.');
      }
      return Promise.reject(error);
    });
    return client;
  }, [session, clearSession]);
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(() => {
      clearSession();
      setLoginError('Session expired. Please sign in again.');
    }, Math.max(0, session.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [session, clearSession]);
  const handleLogin = async e => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const { data } = await axios.post((import.meta.env.VITE_TUTOR_PREVIEW === 'true' ? '' : 'https://luminous-classes-backend.onrender.com') + '/api/admin/login', { password: passcode });
      setSession(data);
      setActiveTab('ledger');
      setIsAuthenticated(true);
    } catch (error) {
      setLoginError(error.response?.data?.error || 'Could not sign in. Please try again.');
    } finally {
      setPasscode('');
      setIsLoggingIn(false);
    }
  };
  const handleLogout = async () => {
    try { await adminApi.post('https://luminous-classes-backend.onrender.com/api/admin/logout'); }
    catch { /* The local session is still cleared if the network is unavailable. */ }
    finally { clearSession(); }
  };

  // --- YOUR EXISTING ADMIN STATE ---
  const [jobs, setJobs] = useState([]);
  const [unlocks, setUnlocks] = useState([]);
  const [unlocksStatus, setUnlocksStatus] = useState('loading');
  const [purchases, setPurchases] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ledger');
  const [statusFilter, setStatusFilter] = useState('all');
  const [unlockFilter, setUnlockFilter] = useState('all');

  // --- INJECTION FORM STATE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    title: '', parentName: '', subject: '', grade: '', city: 'Lucknow', location: '', salary: '', contactNumber: '', requirements: '',
    leadType: 'classic',
    status: 'approved'
  });

  const [editingJobId, setEditingJobId] = useState(null);
  const [editLeadForm, setEditLeadForm] = useState({});

  const fetchJobs = useCallback(async () => {
    try {
      const jobsRes = await adminApi.get('https://luminous-classes-backend.onrender.com/api/jobs');
      setJobs(jobsRes.data);
    } catch (e) { console.error(e); }
  }, [adminApi]);

  const fetchUnlocks = useCallback(async () => {
    setUnlocksStatus('loading');
    try {
      const { data } = await adminApi.get('https://luminous-classes-backend.onrender.com/api/unlocks');
      if (!Array.isArray(data)) throw new Error('Invalid unlock records response');
      setUnlocks(data);
      setUnlocksStatus('ready');
    } catch (error) {
      setUnlocksStatus('error');
      console.error('Could not load unlock records', error);
    }
  }, [adminApi]);

  // Verified dashboard purchases (new unlock flow). Older backend versions return no `purchases`
  // field; treat that as an empty list so this view works before the backend deploy lands.
  const fetchPurchases = useCallback(async () => {
    try {
      const { data } = await adminApi.get('https://luminous-classes-backend.onrender.com/api/admin/tutor-accounts');
      setPurchases(Array.isArray(data?.purchases) ? data.purchases : []);
    } catch (e) {
      setPurchases([]);
      console.error('Could not load dashboard purchases', e);
    }
  }, [adminApi]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();
      fetchUnlocks();
      fetchPurchases();

      const fetchRest = async () => {
        try {
          const tutorsRes = await adminApi.get('https://luminous-classes-backend.onrender.com/api/admin/tutors/pending');
          setTutors(tutorsRes.data);
        } catch (e) { console.error(e); }
      };
      fetchRest();
    }
  }, [isAuthenticated, adminApi, fetchJobs, fetchUnlocks, fetchPurchases]);

  const handleDeleteJob = async (id) => {
    if (window.confirm("Purge this record permanently?")) {
      await adminApi.delete(`https://luminous-classes-backend.onrender.com/api/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
    }
  };

  const handleApproveLead = async (job) => {
    if (window.confirm(`Did you call ${job.parentName} and verify this requirement?`)) {
      try {
        await adminApi.put(`https://luminous-classes-backend.onrender.com/api/jobs/${job._id}`, { ...job, status: 'approved' });
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
      await adminApi.put(`https://luminous-classes-backend.onrender.com/api/admin/tutors/${id}/status`, { status: 'approved' });
      setTutors(tutors.map(t => t._id === id ? { ...t, status: 'approved' } : t));
    } catch (error) { console.error("Error approving:", error); }
  };

  const handleLeadChange = (e) => setNewLeadForm({ ...newLeadForm, [e.target.name]: e.target.value });

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
     await adminApi.post('https://luminous-classes-backend.onrender.com/api/jobs', newLeadForm);
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
      await adminApi.put(`https://luminous-classes-backend.onrender.com/api/jobs/${id}`, editLeadForm);
      alert("Record successfully amended.");
      setEditingJobId(null);
      fetchJobs();
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Failed to update record.");
    }
  };

  // --- FILTERING & STABLE SORTING LOGIC ---
  const pendingLeads = jobs.filter(job => job.status === 'pending');
  const pendingTutors = tutors.filter(t => t.status === 'pending');

  // Unified Filtering and Sorting for Active Ledger
  const ledgerJobs = jobs.filter(job => job.status === 'approved' || job.status === 'hidden' || !job.status);
  const unlocksReady = unlocksStatus === 'ready';
  const isUnlocked = job => unlocksReady && approvedUnlocksForJob(unlocks, job._id).length > 0;
  const matchesSearch = job => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    const displayIdMatch = (job.displayId && job.displayId.toLowerCase().includes(query)) ||
                           (job.ticketId && job.ticketId.toLowerCase().includes(query));
    const parentNameMatch = job.parentName && job.parentName.toLowerCase().includes(query);
    const titleMatch = job.title && job.title.toLowerCase().includes(query);
    return displayIdMatch || parentNameMatch || titleMatch;
  };
  const matchesStatus = (job, f) => f === 'all' || (f === 'hidden' ? job.status === 'hidden' : job.status !== 'hidden');
  const matchesUnlock = (job, f) => {
    if (f === 'all' || !unlocksReady) return true;
    return f === 'unlocked' ? isUnlocked(job) : !isUnlocked(job);
  };
  // Facet counts follow the other active filters and the search, so each chip shows what it would yield.
  const statusBase = ledgerJobs.filter(job => matchesSearch(job) && matchesUnlock(job, unlockFilter));
  const statusCounts = {
    all: statusBase.length,
    active: statusBase.filter(job => job.status !== 'hidden').length,
    hidden: statusBase.filter(job => job.status === 'hidden').length,
  };
  const unlockBase = ledgerJobs.filter(job => matchesSearch(job) && matchesStatus(job, statusFilter));
  const unlockedCount = unlockBase.filter(isUnlocked).length;
  const unlockCounts = {
    all: unlockBase.length,
    unlocked: unlocksReady ? unlockedCount : null,
    locked: unlocksReady ? unlockBase.length - unlockedCount : null,
  };
  const filtersActive = statusFilter !== 'all' || unlockFilter !== 'all';
  const filteredActiveJobs = ledgerJobs
    .filter(job => matchesStatus(job, statusFilter) && matchesUnlock(job, unlockFilter) && matchesSearch(job))
    .sort((a, b) => {
      // Stable sorting by creation date (Newest First) so sequence never scrambles
      const dateA = new Date(a.createdAt || a._id).getTime();
      const dateB = new Date(b.createdAt || b._id).getTime();
      return dateB - dateA;
    });

  // --- SECTION TABS (top navigation; only the selected section renders) ---
  const sections = [
    { id: 'ledger', label: 'Active Ledger', count: filteredActiveJobs.length },
    { id: 'pending', label: 'Pending Leads', count: pendingLeads.length },
    { id: 'tutors', label: 'Tutor Verification', count: pendingTutors.length },
    ...(import.meta.env.VITE_TUTOR_ACCOUNTS_ENABLED === 'true' ? [{id:'account-review',label:'Account recovery',count:null}] : []),
    { id: 'inject', label: 'Inject Lead', count: null },
  ];

  // --- THE LOCK SCREEN UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans p-4 selection:bg-indigo-500 selection:text-white">
        <form
          onSubmit={handleLogin}
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
              autoComplete="current-password"
              maxLength={256}
              required
              placeholder="Enter Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl tracking-[0.2em] font-bold text-slate-900 transition-all"
            />
            {loginError && <p role="alert" className="text-red-600 text-sm text-center">{loginError}</p>}
            <button
              disabled={isLoggingIn}
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              {isLoggingIn ? 'Signing in...' : 'Unlock Console'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- HIDE/UNHIDE FUNCTION ---
  const toggleVisibility = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'hidden' ? 'approved' : 'hidden';
    try {
      await adminApi.put(`https://luminous-classes-backend.onrender.com/api/jobs/${jobId}`, {
        status: newStatus
      });

      setJobs(prevJobs => prevJobs.map(job =>
        job._id === jobId ? { ...job, status: newStatus } : job
      ));
    } catch (error) {
      console.error("Failed to toggle job visibility:", error);
      alert("Could not update job status. Check console.");
    }
  };

  // --- THE ACTUAL ADMIN PORTAL ---
  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">

      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center py-4 gap-2">
            <button onClick={async () => { await handleLogout(); navigate('/'); }} className="justify-self-start flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Exit
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight text-center whitespace-nowrap">Command Center</h1>
            <div aria-hidden="true" />
          </div>
        </div>

        {/* SECTION NAVIGATION TABS */}
        <div className="border-t border-slate-100">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto py-2.5" aria-label="Admin sections">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => { setActiveTab(section.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                aria-current={activeTab === section.id ? 'page' : undefined}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === section.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {section.label}
                {section.count !== null && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === section.id ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                  }`}>
                    {section.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">

        {/* SECTION 1: QUARANTINE ZONE (PENDING LEADS) */}
        {activeTab === 'account-review' && <TutorAccountReview adminApi={adminApi} />}
        {activeTab === 'pending' && (
        <section>
          <div className="flex flex-wrap items-center gap-3 mb-6">
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
                <div key={job._id} className="bg-white rounded-2xl border-2 border-amber-300 shadow-md p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{job.parentName}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                      📞 <span className="text-slate-700">{job.contactNumber}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-100">
                      <span>{job.grade} {job.subject}</span>
                      <span className="text-slate-300">|</span>
                      <span>{job.location} {job.city && `, ${job.city}`}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-indigo-600 font-bold">{job.salary ? `₹${job.salary}` : 'Negotiable'}</span>
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
        )}

        {/* SECTION 2: MANUAL LEAD INJECTION */}
        {activeTab === 'inject' && (
        <section className="bg-white rounded-3xl p-8 border border-slate-300 shadow-md">
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
                  <option value="direct">DIRECT - 0% Organic Lead</option>
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
        )}

        {/* SECTION 3: PENDING TUTORS */}
        {activeTab === 'tutors' && (
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
                <div key={tutor._id} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-md flex flex-col justify-between">
                  <div className="mb-6">
                    <h3 className="font-bold text-lg text-slate-900">{tutor.name}</h3>
                    <div className="space-y-1.5 mt-3 text-sm text-slate-600 break-all">
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
        )}

        {/* SECTION 4: ACTIVE JOBS BOARD WITH SEARCH BAR */}
        {activeTab === 'ledger' && (
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


          <div className="mb-6 flex flex-col gap-3" aria-label="Ledger filters">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 w-full sm:w-auto sm:mr-1">Status</span>
              {[['all','All'],['active','Active'],['hidden','Hidden']].map(([id,label]) => (
                <button key={id} type="button" aria-pressed={statusFilter === id} onClick={() => setStatusFilter(id)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${statusFilter === id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
                  {label} ({statusCounts[id]})
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by unlock">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 w-full sm:w-auto sm:mr-1">Unlocks</span>
              {[['all','All'],['unlocked','Unlocked'],['locked','Not unlocked']].map(([id,label]) => (
                <button key={id} type="button" aria-pressed={unlockFilter === id} disabled={id !== 'all' && !unlocksReady} onClick={() => setUnlockFilter(id)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${unlockFilter === id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
                  {label} ({unlockCounts[id] ?? '...'})
                </button>
              ))}
              {unlockFilter !== 'all' && !unlocksReady && (
                <span className="text-xs text-amber-700 w-full">Unlock records not loaded, so this filter is not applied.</span>
              )}
              {filtersActive && (
                <button type="button" onClick={() => { setStatusFilter('all'); setUnlockFilter('all'); }} className="text-sm font-semibold text-indigo-700 hover:underline ml-1">Clear filters</button>
              )}
            </div>
          </div>

          {unlocksStatus === 'loading' && (
            <p className="mb-4 text-sm text-slate-500" role="status">Loading unlock records...</p>
          )}
          {unlocksStatus === 'error' && (
            <div role="alert" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              Unlock records unavailable, so "Unlocked By" is hidden and unlock filters are off.
              <button type="button" onClick={fetchUnlocks} className="ml-2 font-semibold text-indigo-700 hover:underline">Retry</button>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {filteredActiveJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center text-slate-500">
                {(searchQuery || filtersActive) ? "No records match your search or filters." : "No active jobs in the database."}
              </div>
            ) : (
              filteredActiveJobs.map((job) => {
                const jobUnlocks = approvedUnlocksForJob(unlocks, job._id);
                const jobPurchases = purchases.filter(p => String(p.jobId) === job._id);
                const isDirect = job.leadType === 'direct' || job.leadType === 'premium' || !job.leadType;

                return (
                  <div key={job._id} className="bg-white border border-slate-300 rounded-3xl shadow-md overflow-hidden flex flex-col">

                    {/* Status Badge & Hidden Indicator (in normal flow so it never overlaps the title on narrow screens) */}
                    <div className="flex flex-wrap items-center justify-end gap-2 px-6 md:px-8 pt-5">
                      {job.status === 'hidden' && (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded border border-red-400">
                          Hidden
                        </span>
                      )}
                      {isDirect ? (
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                          0% DIRECT
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                          50% CLASSIC
                        </span>
                      )}
                    </div>

                    {editingJobId === job._id ? (
                      <div className="p-6 md:p-8 pt-4 bg-indigo-50/50">
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
                              <select name="leadType" value={editLeadForm.leadType || 'direct'} onChange={handleEditChange} className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full">
                                <option value="classic">CLASSIC - 50% FEE</option>
                                <option value="direct">DIRECT - 0% FEE</option>
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
                      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-4 flex flex-col md:flex-row gap-8">

                        {/* Job Details */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-2 min-w-0">
                            {job.displayId && <span className="block text-sm font-bold text-slate-400 whitespace-nowrap mb-1">{job.displayId}</span>}
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">{job.title || "STUDENT LEAD"}</h3>
                          </div>

                          {/* Creation Date Badge Added Here */}
                          <div className="text-xs font-semibold text-indigo-600 mb-3">
                            📅 Added on: {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm font-medium text-slate-600">
                            <span className="bg-slate-100 px-3 py-1 rounded-lg">📍 {job.location}{job.city && `, ${job.city}`}</span>
                            <span className="bg-slate-100 px-3 py-1 rounded-lg">💰 {job.salary ? `₹${job.salary}` : 'Negotiable'}</span>
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-lg">
                              👤 {job.parentName} ({job.contactNumber})
                            </span>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3">
                            <button onClick={() => startEditing(job)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                              <Edit className="w-4 h-4" /> Amend
                            </button>
                            <button
                              onClick={() => toggleVisibility(job._id, job.status)}
                              className={`px-3 py-1 text-sm font-bold rounded-md shadow-sm transition-all duration-200 ${
                                job.status === 'hidden'
                                  ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                              }`}
                            >
                              {job.status === 'hidden' ? '👁️ Unhide' : '🙈 Hide'}
                            </button>
                            <button onClick={() => handleDeleteJob(job._id)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" /> Purge
                            </button>
                          </div>
                        </div>

                        {/* Unlocks Panel: only for leads with at least one recorded unlock */}
                        {unlocksStatus === 'ready' && (jobUnlocks.length > 0 || jobPurchases.length > 0) && (
                        <div className="w-full md:w-72 bg-slate-50 rounded-2xl p-5 border border-slate-200 shrink-0">
                          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                            Unlocked By
                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{jobUnlocks.length + jobPurchases.length}</span>
                          </h4>
                          <div className="space-y-3">
                            {jobUnlocks.map(unlock => (
                              <div key={unlock._id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                <p className="font-bold text-slate-900 text-sm">{unlock.tutorPhone}</p>
                                <p className="text-xs text-slate-400 mt-0.5">ID: {unlock._id.substring(0,8)}</p>
                                <p className="text-xs text-slate-500 mt-1">Requested: {formatWhen(unlock.createdAt)}</p>
                                <p className="text-xs text-slate-500">{unlock.approvedAt ? `Approved: ${formatWhen(unlock.approvedAt)}` : 'Approval time not recorded'}</p>
                                <a href={`https://wa.me/91${unlock.tutorPhone}`} target="_blank" rel="noreferrer" className="mt-2 block w-full text-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                  Message
                                </a>
                              </div>
                            ))}
                            {jobPurchases.map((purchase, idx) => (
                              <div key={purchase.jobId + String(purchase.verifiedAt) + idx} className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                                <p className="font-bold text-slate-900 text-sm break-all">{purchase.email}</p>
                                <p className="text-xs text-emerald-700 font-semibold mt-0.5">Dashboard purchase</p>
                                <p className="text-xs text-slate-500 mt-1">Verified: {formatWhen(purchase.verifiedAt)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
        )}

      </div>
    </div>
  );
}

export default AdminPortal;
