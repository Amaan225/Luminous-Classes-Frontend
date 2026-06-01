import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertCircle, RefreshCcw } from 'lucide-react';

function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Terms & Policies
          </h1>
          <p className="text-slate-500 font-medium">
            Last Updated: May 24, 2026
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Section 1: Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
                <Shield className="w-6 h-6 text-indigo-600" />
                1. Platform Overview
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Tutor49 operates as a direct digital bulletin board connecting parents with independent university tutors. We are <strong>not</strong> a traditional tutoring agency. 
                </p>
                <p>
                  Our primary service is providing a secure platform for parents to post their educational requirements and for verified tutors to access these leads without paying predatory percentage-based commissions.
                </p>
              </div>
            </section>

            {/* Section 2: Parent Guidelines */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                2. For Parents (Clients)
              </h2>
              <ul className="space-y-3 text-slate-600 leading-relaxed list-disc list-outside ml-5 marker:text-slate-400">
                <li><strong>Free Usage:</strong> Posting a requirement on Tutor49 is 100% free. Parents are never charged a fee by the platform.</li>
                <li><strong>Verification:</strong> We manually verify the IDs of the tutors, but parents are strongly encouraged to independently verify the tutor's identity during the first meeting.</li>
                <li><strong>Direct Negotiation:</strong> Tutor49 does not dictate salaries. Fees, timings, and syllabus are negotiated directly between the parent and the chosen tutor.</li>
              </ul>
            </section>

            {/* Section 3: Tutor Guidelines */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                3. For Tutors
              </h2>
              <ul className="space-y-3 text-slate-600 leading-relaxed list-disc list-outside ml-5 marker:text-slate-400">
                <li><strong>The Unlock Fee:</strong> Tutors pay a flat, non-recurring fee of ₹49 to unlock a Direct lead's contact number.</li>
                <li><strong>No Conversion Guarantee:</strong> Unlocking a lead provides the contact number; it does <strong>not</strong> guarantee the parent will hire you. Hiring depends on your communication skills and demo performance.</li>
                <li><strong>Zero Commission:</strong> Once you are hired via a Direct lead, you keep 100% of your earnings. Tutor49 will never ask for a percentage of your salary.</li>
                <li><strong>Code of Conduct:</strong> Any harassment, spamming, or unprofessional behavior toward parents will result in an immediate, permanent ban from the platform.</li>
              </ul>
            </section>

            {/* Section 4: Refund Policy (Highlighted) */}
            <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 relative">
              <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <RefreshCcw className="w-5 h-5" />
                4. The Refund Policy
              </h2>
              <div className="space-y-3 text-indigo-800 leading-relaxed text-sm">
                <p>
                  We stand by the quality of our leads. If you pay ₹49 to unlock a requirement, you are eligible for a refund with nominal deductions under the following conditions:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-2 font-medium">
                  <li>The parent declines to take a free demo from you.</li>
                  <li>The parent does not respond to your calls or messages within 48 hours.</li>
                  <li>The phone number provided is invalid or unreachable within 48 hours.</li>
                </ul>
                <p className="pt-2 text-xs opacity-80">
                  * Note: Refunds are not provided if the parent takes your demo but decides not to hire you based on performance, or if the lead is explicitly marked as a "Classic" 50% commission lead.
                </p>
              </div>
            </section>

            {/* Section 5: Data & Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-slate-400" />
                5. Privacy Policy
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  We treat your data with the utmost respect. 
                </p>
                <ul className="space-y-3 list-disc list-outside ml-5 marker:text-slate-400">
                  <li><strong>Number Masking:</strong> Parent contact numbers are masked securely on our database and are only revealed to verified tutors who execute a successful unlock transaction.</li>
                  <li><strong>No Third-Party Selling:</strong> We do not sell your personal data, email addresses, or phone numbers to third-party marketing agencies.</li>
                  <li><strong>Payment Security:</strong> All transactions are handled securely by Razorpay. Tutor49 does not store your credit card or UPI details on our servers.</li>
                </ul>
              </div>
            </section>

          </div>
        </div>

        <div className="text-center mt-12 mb-8">
          <p className="text-slate-500 text-sm">
            Questions about these terms? Email us at <a href="mailto:tutor49.official@gmail.com" className="text-indigo-600 font-medium hover:underline">tutor49.official@gmail.com</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Terms;