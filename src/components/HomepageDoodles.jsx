import React from 'react';
import { BookDoodle, GradCapDoodle } from './Doodles';

// Static, non-interactive line drawings. Scoped to homepage section whitespace.
export const Pencil = ({ className }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 44 43 10a5 5 0 0 1 7-1l5 4a5 5 0 0 1 1 7L29 54 13 59l3-15Z" />
    <path d="m39 15 13 10M18 44l11 10M13 59l3-9M23 43l24-30" />
    <path d="M7 19h10M12 14v10M43 49h10" strokeWidth="1.8" />
  </svg>
);
export const Notebook = ({ className }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="15" y="9" width="37" height="47" rx="5" />
    <path d="M23 9v47M11 19h8M11 29h8M11 39h8M11 49h8M30 22h14M30 30h14M30 38h9" />
  </svg>
);

export default function HomepageDoodles({ variant }) {
  const pairs = {
    connect: [BookDoodle, GradCapDoodle],
    stories: [Pencil, BookDoodle],
    questions: [Notebook, Pencil],
    contact: [GradCapDoodle, Notebook],
  };
  const [Left, Right] = pairs[variant];
  return (
    <div aria-hidden="true" className="pointer-events-none select-none absolute inset-x-0 top-0 h-20 overflow-hidden" data-homepage-doodles={variant}>
      <Left className="absolute left-6 sm:left-12 top-4 w-10 h-10 sm:w-12 sm:h-12 -rotate-12 text-indigo-400 opacity-40" />
      <Right className="absolute right-6 sm:right-12 top-4 w-10 h-10 sm:w-12 sm:h-12 rotate-12 text-violet-400 opacity-40" />
    </div>
  );
}

// Mobile-only decorative drawings for the hero side gaps. Static and non-interactive.
export function HeroSideDoodles() {
  const cls = 'absolute text-violet-400 opacity-45';
  return (
    <div aria-hidden="true" className="md:hidden pointer-events-none select-none absolute inset-0 overflow-hidden z-0" data-hero-side-doodles>
      <GradCapDoodle className={`${cls} left-2 top-[5.5rem] w-9 h-9 -rotate-12`} />
      <Pencil className={`${cls} right-2 top-[5.5rem] w-8 h-8 rotate-12`} />
      <Notebook className={`${cls} left-1 top-[11rem] w-8 h-8 -rotate-6`} />
      <BookDoodle className={`${cls} right-1 top-[11rem] w-9 h-9 rotate-6`} />
      <Pencil className={`${cls} left-2 top-[16.5rem] w-8 h-8 rotate-[35deg]`} />
      <GradCapDoodle className={`${cls} right-2 top-[16.5rem] w-8 h-8 rotate-12`} />
    </div>
  );
}
