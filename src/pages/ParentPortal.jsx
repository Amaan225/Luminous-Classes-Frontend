import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

function ParentPortal() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  
  const [formData, setFormData] = useState({
    parentName: '', contactNumber: '', subject: '', grade: '', customGrade: '',
    city: '', customCity: '', location: '', customLocation: '', salary: '', requirements: ''
  });

  const detailedLocations = {
    "Lucknow": ['Gomti Nagar', 'Indira Nagar', 'Aliganj', 'Mahanagar', 'Hazratganj', 'Alambagh', 'Ashiyana', 'Jankipuram', 'Other'],
    "Kanpur": ['Kakadeo', 'Swaroop Nagar', 'Kidwai Nagar', 'Civil Lines', 'Kalyanpur', 'Shyam Nagar', 'Other'],
    "Varanasi": ['Lanka', 'Sigra', 'Bhelupur', 'Cantt', 'Mahmoorganj', 'Other']
  };

  const allCities = [
    'Agra', 'Ahmedabad', 'Ajmer', 'Aligarh', 'Allahabad (Prayagraj)', 'Amritsar', 
    'Aurangabad', 'Bangalore', 'Bareilly', 'Bhopal', 'Bhubaneswar', 'Chandigarh', 
    'Chennai', 'Coimbatore', 'Cuttack', 'Dehradun', 'Delhi/NCR', 'Dhanbad', 
    'Durgapur', 'Faridabad', 'Ghaziabad', 'Gorakhpur', 'Gurgaon (Gurugram)', 
    'Guwahati', 'Gwalior', 'Hyderabad', 'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 
    'Jamshedpur', 'Jodhpur', 'Kanpur', 'Kochi', 'Kolkata', 'Kota', 'Lucknow', 
    'Ludhiana', 'Madurai', 'Mangalore', 'Meerut', 'Moradabad', 'Mumbai', 'Mysore', 
    'Nagpur', 'Nashik', 'Noida', 'Patna', 'Pune', 'Raipur', 'Rajkot', 'Ranchi', 
    'Rourkela', 'Siliguri', 'Surat', 'Thiruvananthapuram', 'Udaipur', 'Vadodara', 
    'Varanasi', 'Vijayawada', 'Visakhapatnam', 'Other'
  ];

  const grades = ['Pre-KG', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Dropper/Competitive', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city') {
      setFormData({ ...formData, city: value, location: '', customLocation: '', customCity: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) setFormData({ ...formData, contactNumber: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const payload = {
      ...formData,
      grade: formData.grade === 'Other' ? formData.customGrade : formData.grade,
      city: formData.city === 'Other' ? formData.customCity : formData.city,
      location: formData.location === 'Other' ? formData.customLocation : formData.location
    };

    try {
      await axios.post('https://luminous-classes-backend.onrender.com/api/jobs', payload);
      setSubmitStatus('success');
      setFormData({ parentName: '', contactNumber: '', subject: '', grade: '', customGrade: '', city: '', customCity: '', location: '', customLocation: '', salary: '', requirements: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Requirement Posted!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">Your requirement is currently under review by our team. Once verified, it will be shared with our network of top-tier university tutors.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/')} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold shadow-md hover:bg-slate-800 transition-colors">Return to Homepage</button>
            <button onClick={() => setSubmitStatus('idle')} className="w-full py-3.5 bg-slate-50 text-slate-700 rounded-xl font-semibold border border-slate-200 hover:bg-slate-100 transition-colors">Post Another Requirement</button>
          </div>
        </div>
      </div>
    );
  }

  const hasDetailedAreas = formData.city && detailedLocations[formData.city];
  const availableAreas = hasDetailedAreas ? detailedLocations[formData.city] : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Find the Perfect Tutor</h1>
          <p className="text-lg text-slate-600 max-w-2xl">Post your requirement for free. We'll connect you directly with verified university students from top local colleges.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Your Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">Your Name <span className="text-red-500">*</span></label>
                      <input type="text" name="parentName" required value={formData.parentName} onChange={handleChange} className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full" placeholder="e.g. Mr. Sharma" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">WhatsApp Number <span className="text-red-500">*</span></label>
                      <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handlePhoneChange} className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full" placeholder="10-digit number" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Tuition Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">City <span className="text-red-500">*</span></label>
                      <select name="city" required value={formData.city} onChange={handleChange} className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full appearance-none cursor-pointer">
                        <option value="" disabled>Select City</option>
                        {allCities.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                      {formData.city === 'Other' && (
                        <input type="text" name="customCity" required value={formData.customCity} onChange={handleChange} className="px-4 py-3.5 mt-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full" placeholder="Type your city..." />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">Area / Locality <span className="text-red-500">*</span></label>
                      {!formData.city ? (
                         <select disabled className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 outline-none w-full appearance-none opacity-50 cursor-not-allowed"><option>Select City First</option></select>
                      ) : hasDetailedAreas ? (
                        <>
                          <select name="location" required value={formData.location} onChange={handleChange} className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full appearance-none cursor-pointer">
                            <option value="" disabled>Select Area</option>
                            {availableAreas.map(area => <option key={area} value={area}>{area}</option>)}
                          </select>
                          {formData.location === 'Other' && (
                            <input type="text" name="customLocation" required value={formData.customLocation} onChange={handleChange} className="px-4 py-3.5 mt-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full" placeholder="Type specific area..." />
                          )}
                        </>
                      ) : (
                        <input type="text" name="location" required value={formData.location} onChange={handleChange} className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full" placeholder="Type your area (e.g. MG Road)" />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">Subject(s) <span className="text-red-500">*</span></label>
                      <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full" placeholder="e.g. Maths & Science" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">Grade / Class <span className="text-red-500">*</span></label>
                      <select name="grade" required value={formData.grade} onChange={handleChange} className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full appearance-none cursor-pointer">
                        <option value="" disabled>Select Grade</option>
                        {grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                      </select>
                      {formData.grade === 'Other' && (
                        <input type="text" name="customGrade" required value={formData.customGrade} onChange={handleChange} className="px-4 py-3.5 mt-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full" placeholder="Type specific grade..." />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700">Monthly Budget (₹) <span className="text-red-500">*</span></label>
                      <input type="number" min="0" name="salary" required value={formData.salary} onChange={handleChange} className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full" placeholder="e.g. 4000" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Specific Requirements (Optional)</label>
                    <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full h-32 resize-none" placeholder="e.g. Looking for a female tutor, 3 days a week..."></textarea>
                  </div>
                </div>
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100">Something went wrong while posting your requirement. Please try again.</div>
                )}
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 flex justify-center items-center gap-2 mt-4">
                  {isSubmitting ? 'Securing your request...' : 'Post Requirement Free'}
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Free for Parents</h3>
              <p className="text-sm text-slate-600 leading-relaxed">You never pay a single rupee to Tutor49. We are a free network designed to help you bypass expensive agency commissions.</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Students</h3>
              <p className="text-sm text-slate-600 leading-relaxed">We manually verify the ID of every tutor before they can view your requirements, ensuring a safe learning environment.</p>
            </div>
            <div className="bg-indigo-600 rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">What happens next?</h3>
              <ol className="text-sm text-indigo-100 space-y-3 mt-4 relative z-10 list-decimal list-inside marker:font-bold">
                <li>We review your post for spam.</li>
                <li>It goes live on our Tutor's board.</li>
                <li>Interested tutors unlock your number.</li>
                <li>They WhatsApp you directly to arrange a free demo!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentPortal;