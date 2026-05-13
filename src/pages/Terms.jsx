import React from 'react';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
        <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block font-semibold">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Terms & Conditions</h1>
        
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">1. Introduction</h2>
            <p>Welcome to Tutor Kart. By using our platform, you agree to these terms. We act as a connection board between parents and independent tutors.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">2. Services & Payments</h2>
            <p>We charge a nominal, non-refundable platform fee (₹49) for tutors to unlock contact details. Tutor Kart does not charge any recurring agency fees or commissions on the tutor's salary.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">3. Verification & Liability</h2>
            <p>While we manually verify college IDs, Tutor Kart is not liable for the conduct, safety, or academic outcomes of the engagements. Parents and tutors are expected to exercise their own due diligence before finalizing any agreements.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">4. Privacy Policy</h2>
            <p>We collect basic contact information to facilitate connections. Parent phone numbers are strictly encrypted and only shared with tutors who successfully complete the unlock payment. We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">5. Refund Policy</h2>
            <p>Since the service provided is immediate access to digital contact information, the ₹49 unlock fee is strictly non-refundable once the contact details have been revealed.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Terms;