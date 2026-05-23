import React from 'react';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    // FULL PAGE VINTAGE WRAPPER
    <div className="min-h-screen bg-[#f3f1ec] text-[#2C1810] font-sans selection:bg-[#2C1810] selection:text-[#FDF8E7] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* VINTAGE BACK BUTTON */}
        <Link 
          to="/" 
          className="mb-8 inline-block px-5 py-2 border-2 border-[#2C1810] font-black uppercase tracking-widest text-[#2C1810] hover:bg-[#2C1810] hover:text-[#FDF8E7] transition-colors shadow-[2px_2px_0px_rgba(44,24,16,1)] hover:translate-y-px hover:shadow-[1px_1px_0px_rgba(44,24,16,1)]"
        >
          &larr; Back to Home
        </Link>

        {/* BRUTALIST DOCUMENT CONTAINER */}
        <div className="bg-[#f0e4cc] p-8 md:p-12 border-4 border-[#2C1810] shadow-[12px_12px_0px_rgba(44,24,16,1)] relative">
          
          {/* Vintage Stamp */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8 border-4 border-[#900606] px-2 py-1 transform rotate-6 opacity-80 hidden sm:block">
            <span className="font-black uppercase tracking-widest text-xs">LEGAL MANIFEST</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-[#8e1717] mb-12 border-b-8 border-[#751414] pb-4 inline-block">
            Terms & Conditions
          </h1>
          
          <div className="space-y-10">
            {/* Section 1 */}
            <section className="relative">
              <div className="absolute -left-4 top-1 w-2 h-full bg-[#2C1810]"></div>
              <div className="pl-4">
                <h2 className="text-xl font-black uppercase tracking-widest text-[#2C1810] mb-3">1. Introduction</h2>
                <p className="font-bold text-sm md:text-base tracking-wide leading-relaxed text-[#2C1810]/80">
                  Welcome to Tutor49. By using our platform, you agree to these terms. We act as a direct connection board between parents and independent tutors and other standard agencies.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="relative">
              <div className="absolute -left-4 top-1 w-2 h-full bg-[#2C1810]"></div>
              <div className="pl-4">
                <h2 className="text-xl font-black uppercase tracking-widest text-[#2C1810] mb-3">2. Services & Payments</h2>
                <p className="font-bold text-sm md:text-base tracking-wide leading-relaxed text-[#2C1810]/80">
                  We charge a nominal, non-refundable platform fee (₹49) for tutors to unlock contact details. Tutor49 does not charge any recurring agency fees or commissions on the tutor's salary for "Direct Leads." However, designated "Partner Leads" clearly marked on the dashboard are subject to a 50% first-month placement fee upon successful matching.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="relative">
              <div className="absolute -left-4 top-1 w-2 h-full bg-[#2C1810]"></div>
              <div className="pl-4">
                <h2 className="text-xl font-black uppercase tracking-widest text-[#2C1810] mb-3">3. Verification & Liability</h2>
                <p className="font-bold text-sm md:text-base tracking-wide leading-relaxed text-[#2C1810]/80">
                  While we manually verify Tutors, Tutor49 is a matching platform and is not liable for the conduct, safety, or academic outcomes of the engagements. Parents and tutors are explicitly expected to exercise their own due diligence before finalizing any home tuition agreements.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="relative">
              <div className="absolute -left-4 top-1 w-2 h-full bg-[#2C1810]"></div>
              <div className="pl-4">
                <h2 className="text-xl font-black uppercase tracking-widest text-[#2C1810] mb-3">4. Privacy Policy</h2>
                <p className="font-bold text-sm md:text-base tracking-wide leading-relaxed text-[#2C1810]/80">
                  We collect basic contact information to facilitate connections. Parent phone numbers are strictly encrypted and only shared with tutors who successfully complete the unlock payment. We do not sell your data to third parties.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="relative">
              <div className="absolute -left-4 top-1 w-2 h-full bg-[#2C1810]"></div>
              <div className="pl-4">
                <h2 className="text-xl font-black uppercase tracking-widest text-[#2C1810] mb-3">5. Refund Policy</h2>
                <p className="font-bold text-sm md:text-base tracking-wide leading-relaxed text-[#2C1810]/80">
                  Since the service provided is immediate access to digital contact information, the ₹49 unlock fee is strictly non-refundable once the contact details have been revealed and delivered to the tutor's dashboard.
                </p>
              </div>
            </section>
          </div>
          
          {/* Footer Signature Line */}
          <div className="mt-16 pt-8 border-t-4 border-dashed border-[#8b1818] flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]/50">DOCUMENT VERSION</p>
              <p className="font-bold tracking-widest">v1.0.2026</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]/50">PLATFORM</p>
              <p className="font-black uppercase tracking-widest">TUTO₹49 LUCKNOW</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Terms;