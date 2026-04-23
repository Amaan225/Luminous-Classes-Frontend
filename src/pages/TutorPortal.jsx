import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TutorPortal() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [applyingTo, setApplyingTo] = useState(null); 
  const [appData, setAppData] = useState({ tutorName: '', tutorPhone: '', pitch: '' });

  // --- 1. NEW STATE FOR FILTERS ---
  const [filterSubject, setFilterSubject] = useState('');
  const [filterArea, setFilterArea] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
    setIsLoading(true); // <--- TELL REACT WE ARE WAITING
    try {
      const response = await axios.get('https://luminous-classes-backend.onrender.com/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false); // <--- TELL REACT WE ARE DONE (even if it fails)
    }
  };
    
    fetchJobs();
  }, []);

  const handleAppChange = (e) => setAppData({ ...appData, [e.target.name]: e.target.value });

  const submitApplication = async (e, jobId) => {
    e.preventDefault();
    try {
      await axios.post('https://luminous-classes-backend.onrender.com/api/applications', { ...appData, jobId });
      alert("Application sent successfully! The parent will contact you.");
      setApplyingTo(null);
      setAppData({ tutorName: '', tutorPhone: '', pitch: '' });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send application.");
    }
  };

  // --- 2. THE FILTER ENGINE ---
  // This looks at all jobs and only keeps the ones that match what the user typed
  const filteredJobs = jobs.filter(job => {
    // We make everything lowercase so "Math" and "math" match perfectly
    const matchesSubject = job.subject.toLowerCase().includes(filterSubject.toLowerCase());
    const matchesArea = job.location.toLowerCase().includes(filterArea.toLowerCase());
    
    // Only return the job if it matches BOTH the subject AND the area typed
    return matchesSubject && matchesArea;
  });

  return (
    <div className="max-w-5xl mx-auto p-8 font-sans">
      <button onClick={() => navigate('/')} className="text-blue-500 hover:underline mb-6 font-semibold">
        &larr; Back to Home
      </button>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Tutor Dashboard</h1>
          <p className="text-gray-600">Find your next student.</p>
        </div>

        {/* --- 3. THE SEARCH BAR UI --- */}
        <div className="mt-4 md:mt-0 flex gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder=" Filter by Subject..." 
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white shadow-sm flex-1"
          />
          <input 
            type="text" 
            placeholder=" Filter by Area..." 
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white shadow-sm flex-1"
          />
        </div>
      </div>

      {/* --- RENDER THE FILTERED JOBS (Not the full jobs array!) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center bg-blue-50 rounded-xl border border-blue-100 shadow-sm animate-pulse">
            <p className="text-xl font-bold text-blue-600 mb-2"> Connecting to Luminous Servers...</p>
            <p className="text-sm text-blue-500">Waking up the database. This usually takes about 15 seconds on the first load!</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="col-span-full py-10 text-center bg-gray-50 rounded-xl border text-gray-500 text-lg">
            No jobs match your current filters.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm relative overflow-hidden transition hover:shadow-md">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{job.subject} - {job.grade}</h3>
              <p className="text-gray-600 mb-1 font-medium"> {job.location}</p>
              <p className="text-green-600 mb-4 font-bold">{job.salary}</p>
              
              {applyingTo === job._id ? (
                <form onSubmit={(e) => submitApplication(e, job._id)} className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-3">
                  <h4 className="font-semibold text-slate-700 text-sm">Submit Application</h4>
                  <input type="text" name="tutorName" placeholder="Your Name" value={appData.tutorName} onChange={handleAppChange} required className="p-2 border rounded text-sm" />
                  <input type="tel" name="tutorPhone" placeholder="Your WhatsApp" value={appData.tutorPhone} onChange={handleAppChange} required className="p-2 border rounded text-sm" />
                  <textarea name="pitch" placeholder="Why are you a good fit?" value={appData.pitch} onChange={handleAppChange} required className="p-2 border rounded resize-none h-20 text-sm"></textarea>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition text-sm">Send</button>
                    <button type="button" onClick={() => setApplyingTo(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-700 py-2 rounded font-semibold transition text-sm">Cancel</button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setApplyingTo(job._id)} className="w-full mt-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition border border-slate-200">
                  Apply for this Job
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TutorPortal;