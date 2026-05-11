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

  useEffect(() => {
    // Only fetch data IF the admin is logged in to save bandwidth and secure the API
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const jobsRes = await axios.get('https://luminous-classes-backend.onrender.com/api/jobs');
          setJobs(jobsRes.data);
        } catch (e) { console.error(e); }

        try {
          const appsRes = await axios.get('https://luminous-classes-backend.onrender.com/api/applications');
          setApplications(appsRes.data);
        } catch (e) { console.error(e); }

        try {
          const tutorsRes = await axios.get('https://luminous-classes-backend.onrender.com/api/tutors');
          setTutors(tutorsRes.data);
        } catch (e) { console.error(e); }
      };
      fetchData();
    }
  }, [isAuthenticated]); // Reruns fetch when authentication changes

  const handleDeleteJob = async (id) => {
    if (window.confirm("Delete this job?")) {
      await axios.delete(`https://luminous-classes-backend.onrender.com/api/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
    }
  };

  const handleApproveTutor = async (id) => {
    try {
      await axios.patch(`https://luminous-classes-backend.onrender.com/api/tutors/${id}/approve`);
      setTutors(tutors.map(t => t._id === id ? { ...t, status: 'approved' } : t));
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const pendingTutors = tutors.filter(t => t.status === 'pending');

  // --- THE LOGIN GATEKEEPER ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'amaan2026') { 
      setIsAuthenticated(true);
    } else {
      alert("Access Denied. Nice try though.");
      setPasscode(''); // Clear the wrong password
    }
  };

  // --- THE LOCK SCREEN UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col gap-6 w-full max-w-md border-t-8 border-blue-600">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-extrabold text-slate-800">Admin Vault</h2>
            <p className="text-slate-500 mt-2">Restricted Access</p>
          </div>
          <input 
            type="password" 
            placeholder="Enter Passcode" 
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest bg-slate-50"
          />
          <button type="submit" className="bg-slate-900 text-white font-bold p-4 rounded-xl hover:bg-slate-800 transition shadow-lg text-lg">
            Unlock Console
          </button>
          <button type="button" onClick={() => navigate('/')} className="text-blue-500 hover:underline text-sm font-semibold mt-2 text-center">
            &larr; Back to Public Site
          </button>
        </form>
      </div>
    );
  }

  // --- THE ACTUAL ADMIN PORTAL (Only visible after login) ---
  return (
    <div className="max-w-5xl mx-auto p-8 font-sans">
      <div className="flex justify-between items-center mb-8 border-b-4 border-slate-800 pb-4">
        <div>
          <button onClick={() => navigate('/')} className="text-blue-500 hover:underline mb-2 font-semibold block">&larr; Back to Home</button>
          <h1 className="text-4xl font-extrabold text-slate-800">Admin Control Room</h1>
        </div>
        <button 
          onClick={() => { setIsAuthenticated(false); setPasscode(''); }} 
          className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-bold transition"
        >
          Lock Vault
        </button>
      </div>

      <div className="mb-12 bg-amber-50 p-6 rounded-xl border-2 border-amber-200 shadow-sm">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Waiting Room ({pendingTutors.length})</h2>
        {pendingTutors.length === 0 ? (
          <p className="text-amber-700 italic">No tutors waiting for approval.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingTutors.map(tutor => (
              <div key={tutor._id} className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{tutor.name}</p>
                  <p className="text-sm text-gray-600">✉️ {tutor.email}</p>
                  <p className="text-sm text-gray-600">📞 {tutor.phone}</p>
                  <p className="text-sm font-mono text-blue-600 mt-1">ID: {tutor.collegeId}</p>
                </div>
                <button onClick={() => handleApproveTutor(tutor._id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold shadow transition">
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-4">Active Jobs ({jobs.length})</h2>
      <div className="flex flex-col gap-8">
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-lg">No active jobs to manage.</p>
        ) : (
          jobs.map((job) => {
            const jobApps = applications.filter(app => app.jobId === job._id);
            return (
              <div key={job._id} className="bg-white border-2 border-slate-200 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900">
                      {job.displayId && <span className="text-blue-600 mr-2">[{job.displayId}]</span>}
                      {job.subject} - {job.grade}
                    </h2>
                    <p className="text-gray-600 font-medium">📍 {job.location} | 💰 {job.salary}</p>
                    <p className="text-gray-500 mt-1">Parent: {job.parentName} ({job.contactNumber})</p>
                  </div>
                  <button onClick={() => handleDeleteJob(job._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold shadow transition">
                    Delete Job
                  </button>
                </div>

                <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-slate-700 mb-3 border-b border-slate-300 pb-2">
                    Applications Received ({jobApps.length})
                  </h3>
                  {jobApps.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No tutors have applied yet.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {jobApps.map(app => (
                        <div key={app._id} className="bg-white p-3 rounded border shadow-sm flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800">{app.tutorName}</p>
                            <p className="text-sm text-gray-600 mt-1 italic">"{app.pitch}"</p>
                          </div>
                          <a href={`https://wa.me/91${app.tutorPhone}`} target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold text-sm transition">
                            WhatsApp
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminPortal;