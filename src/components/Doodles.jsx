import React from 'react';

/* ============================================================
   Minimal outline figures for Tutor49
   Style: thin rounded strokes, currentColor (set text-* color
   + opacity on the wrapper). Nothing filled, nothing busy.
   ============================================================ */

export const GradCapDoodle = ({ className = '', style }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M6 24L32 12l26 12-26 12L6 24z" />
    <path d="M16 29v11c0 4 7 8 16 8s16-4 16-8V29" />
    <path d="M54 28v13" />
    <circle cx="54" cy="45" r="2.2" />
  </svg>
);

export const BookDoodle = ({ className = '', style }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M32 18c-5-4-12-5-20-5v34c8 0 15 1 20 5 5-4 12-5 20-5V13c-8 0-15 1-20 5z" />
    <path d="M32 18v34" />
    <path d="M18 22h8M18 29h8M38 22h8M38 29h8" strokeWidth="2" />
  </svg>
);

export const ShieldDoodle = ({ className = '', style }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M32 6l20 7v14c0 14-8.5 24.5-20 31C20.5 51.5 12 41 12 27V13l20-7z" />
    <path d="M23 31l6.5 6.5L42 25" />
  </svg>
);

export const SparkleDoodle = ({ className = '', style }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M32 8l4.5 15.5L52 28l-15.5 4.5L32 48l-4.5-15.5L12 28l15.5-4.5L32 8z" />
    <path d="M50 44l1.8 6.2L58 52l-6.2 1.8L50 60l-1.8-6.2L42 52l6.2-1.8L50 44z" strokeWidth="2" />
  </svg>
);

export const RupeeDoodle = ({ className = '', style }) => (
  <svg viewBox="0 0 48 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M13 12h22" />
    <path d="M13 21h22" />
    <path d="M13 12h8c7.5 0 12 3.7 12 9.5S28.5 31 21 31h-6l17 21" />
  </svg>
);

export const RupeeCoinDoodle = ({ className = '', style }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="32" cy="32" r="24" />
    <circle cx="32" cy="32" r="18.5" strokeDasharray="2 5" strokeWidth="2" />
    <path d="M25 24h14M25 30h14M25 24h5c4.5 0 7.5 2.3 7.5 6S34.5 36 30 36h-4l10 12" strokeWidth="2.6" />
  </svg>
);

/* One clean parent-and-child figure (for the Parent side) */
export const ParentChildFigure = ({ className = '', style }) => (
  <svg viewBox="0 0 150 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    {/* adult */}
    <circle cx="48" cy="30" r="13" />
    <path d="M24 96c0-20 11-33 24-33s24 13 24 33" />
    {/* child */}
    <circle cx="100" cy="54" r="9" />
    <path d="M83 96c0-14 7.5-23 17-23s17 9 17 23" />
    {/* heart between them */}
    <path d="M75 24c-1.6-4-7.6-4-7.6 .8 0 3.2 3.8 5.4 7.6 8.4 3.8-3 7.6-5.2 7.6-8.4 0-4.8-6-4.8-7.6-.8z" />
    {/* ground */}
    <path d="M16 106h118" strokeDasharray="2 9" />
  </svg>
);

/* One clean young-tutor figure: grad cap + open book (for the Tutor side) */
export const YoungTutorFigure = ({ className = '', style }) => (
  <svg viewBox="0 0 130 130" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    {/* head */}
    <circle cx="64" cy="48" r="14" />
    {/* grad cap */}
    <path d="M40 38l24-11 24 11-24 11-24-11z" />
    <path d="M53 43v9c0 3.2 5 5.4 11 5.4s11-2.2 11-5.4v-9" />
    <path d="M88 38v13" />
    {/* shoulders */}
    <path d="M36 112c0-18 12.5-29 28-29s28 11 28 29" />
    {/* open book */}
    <path d="M64 104c-5.5-3.8-12-4.5-18-4.5V82.5c6 0 12.5.7 18 4.5 5.5-3.8 12-4.5 18-4.5v17c-6 0-12.5.7-18 4.5z" />
    <path d="M64 87v17" />
  </svg>
);
