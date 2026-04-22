import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPortal() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tutors, setTutors] = useState([]); // <-- NEW STATE FOR TUTORS

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await axios.get('https://luminous-classes-backend.onrender.com/api/jobs');
        setJobs(jobsRes.data);
      } catch (e) { console.error(e); }

      try {
        const appsRes = await axios.get('https://luminous-classes-backend.onrender.com/api/applications');
        setApplications(appsRes.data);
      } catch (e) { console.error(e); }

      // Fetch Tutors
      try {
        const tutorsRes = await axios.get('https://luminous-classes-backend.onrender.com/api/tutors');
        setTutors(tutorsRes.data);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  const handleDeleteJob = async (id) => {
    if (window.confirm("Delete this job?")) {
      await axios.delete(`https://luminous-classes-backend.onrender.com/api/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
    }
  };

  // THE MAGIC APPROVE FUNCTION
  const handleApproveTutor = async (id) => {
    try {
      await axios.patch(`https://luminous-classes-backend.onrender.com/api/tutors/${id}/approve`);
      // Update the screen instantly
      setTutors(tutors.map(t => t._id === id ? { ...t, status: 'approved' } : t));
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  // Filter out only the pending ones
  const pendingTutors = tutors.filter(t => t.status === 'pending');

  return (
    <div className="max-w-5xl mx-auto p-8 font-sans">
      <button onClick={() => navigate('/')} className="text-blue-500 hover:underline mb-6 font-semibold">&larr; Back to Home</button>
      
      <div className="flex justify-between items-center mb-8 border-b-4 border-slate-800 pb-4">
        <h1 className="text-4xl font-extrabold text-slate-800">Admin Control Room</h1>
      </div>

      {/* --- NEW PENDING TUTORS SECTION --- */}
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
                  <p className="text-sm text-gray-600">✉️ {tutor.email}</p> {/* Email displayed here! */}
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

      {/* --- EXISTING JOBS SECTION --- */}
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
                    <h2 className="text-2xl font-bold text-blue-900">{job.subject} - {job.grade}</h2>
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