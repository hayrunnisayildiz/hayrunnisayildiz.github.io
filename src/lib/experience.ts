// ─────────────────────────────────────────────────────────────
//  Internships, work experience and education.
//  Shown in the Experience app, the terminal (`cat experience`),
//  the Contacts app and the mobile page. Newest first.
// ─────────────────────────────────────────────────────────────

export interface Experience {
  company: string;
  role: string;
  dates: string;          // e.g. 'Jun – Aug 2024'
  location?: string;      // e.g. 'Istanbul, Türkiye'
  type?: string;          // e.g. 'Internship'
  summary?: string;       // one or two sentences
  highlights?: string[];  // 2–4 short bullet points
  tools?: string[];
  url?: string;           // company website
  project?: string;       // id of a related project in the Projects app
}

export const experience: Experience[] = [
  {
    company: 'Geological Survey of Finland (GTK)',
    role: 'Intern, Geophysical Solutions unit',
    dates: 'Jul – Oct 2026',
    location: 'Espoo, Finland',
    type: 'Erasmus+ Internship',
    summary: 'Applied machine learning to geophysics at the national geological survey of Finland.',
    highlights: [
      'Developed SmartPriorMT, a Julia tool that uses neural networks (Lux.jl) to build starting models for 2D magnetotelluric (MT) inversion from gravity and MT data, replacing the usual blank half-space start',
      'Gained practical knowledge of geophysical methods, especially MT inversion and gravity data interpretation',
      'Worked across disciplines, applying machine learning and AI to complex geophysical problems',
    ],
    tools: ['Julia', 'Lux.jl', 'Machine learning', 'Magnetotellurics', 'Gravity'],
    url: 'https://www.gtk.fi/en/',
    project: 'smartprior-mt',
  },
  {
    company: 'VHS Elektronik Yazılım',
    role: 'Intern',
    dates: 'Jul – Aug 2025',
    location: 'Ankara, Türkiye',
    type: 'Internship',
    highlights: ['Developed data reporting endpoints and user interfaces'],
    tools: ['.NET Core', 'Blazor', 'MSSQL'],
  },
  // {
  //   company: 'Company',
  //   role: 'Data Science Intern',
  //   dates: 'Jun – Aug 2024',
  //   location: 'Istanbul, Türkiye',
  //   type: 'Internship',
  //   summary: 'One or two sentences about the team and what you worked on.',
  //   highlights: ['What you built', 'What it changed'],
  //   tools: ['Python', 'SQL'],
  //   url: 'https://example.com',
  // },
];

// ── Education (newest first) ────────────────────────────────

export interface Education {
  school: string;
  degree: string;
  dates: string;
  location?: string;
  note?: string;
  project?: string;       // id of a related project in the Projects app
}

export const education: Education[] = [
  {
    school: 'Erciyes University',
    degree: 'B.Sc. in Computer Engineering',
    dates: '2023 – 2027 (expected)',
    location: 'Kayseri, Türkiye',
    note: "Bachelor's thesis: MinerAI, AI-based ore grade estimation and drillhole targeting",
    project: 'minerai',
  },
  {
    school: 'Ondokuz Mayıs University',
    degree: 'B.Sc. in Computer Engineering',
    dates: '2022 – 2023',
    location: 'Samsun, Türkiye',
  },
];
