import React from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  ['Is posting a parent requirement free?', 'Yes. Parents can submit a requirement for free. Tutor registration and contact-unlock charges are separate. The parent and tutor agree the tuition fee directly.'],
  ['Can I request a particular class, board or subject?', 'Describe it in the requirement, including any exam preparation or topics that need help. The team can review the request, but Tutor49 does not promise a teacher is available for every class or subject in Mawaiyya.'],
  ['How much will home tuition cost?', 'The fee depends on the class, subjects, how often lessons happen, travel and the tutor. State a monthly budget and agree the final terms directly with the tutor. This page does not quote a local market price.'],
];

export default function MawaiyyaTuition() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-12 pb-28 pl-4 pr-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-sm font-medium text-slate-500 mb-8">
          <Link to="/" className="hover:text-indigo-600 underline">Home</Link> <span aria-hidden="true">/</span> Home tuition in Mawaiyya
        </nav>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Find a home tutor in Mawaiyya, Lucknow</h1>
        <p className="text-lg text-slate-700 leading-relaxed mb-8">
          Looking for a home tutor in Mawaiyya, also written Mawaiya? Share what your child needs with Tutor49. Posting a parent requirement is free. Our team reviews it before sharing it with tutors. A match depends on the subjects, travel distance and available teaching times, so posting does not guarantee a tutor or an immediate reply.
        </p>
        <Link to="/parent" className="inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 mb-12">Post a requirement free</Link>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Help a tutor judge the journey and timetable</h2>
          <p className="text-slate-700 leading-relaxed">
            Give your exact Mawaiyya locality or a nearby public landmark, not just Lucknow. Include the class and board, subjects, preferred days and time, and monthly budget. Travel time and a workable schedule matter when arranging home tuition. Keep a child's full address and other private details out of a public description. Share visit details privately when needed.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">How a parent requirement works</h2>
          <ol className="list-decimal pl-6 space-y-2 text-slate-700 leading-relaxed">
            <li>Post the class, subjects, locality, schedule and monthly budget through the free parent form.</li>
            <li>Tutor49 reviews the submission before it appears for tutors.</li>
            <li>Interested tutors may choose to unlock the contact after payment verification, then discuss the requirement directly.</li>
            <li>Parent and tutor agree the teaching plan and final tuition fee themselves.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Before you agree to tuition</h2>
          <p className="text-slate-700 leading-relaxed">
            Discuss the tutor's qualifications and experience, how lessons will be planned, travel and timing, and the final fee. Ask about any demo terms before booking one. Tutor49 admin approval is not a guarantee of teaching ability or suitability for a particular child.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Questions parents ask</h2>
          <div className="space-y-5">
            {faqs.map(([q, a]) => (
              <div key={q}>
                <h3 className="font-bold text-lg">{q}</h3>
                <p className="text-slate-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <Link to="/parent" className="inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700">Post a requirement free</Link>
      </div>
    </main>
  );
}
