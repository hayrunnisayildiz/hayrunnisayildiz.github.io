// ─────────────────────────────────────────────────────────────
//  Site-wide personal settings — edit this file to update the portfolio.
// ─────────────────────────────────────────────────────────────

export const site = {
  fullName: 'Hayrunnisa Yıldız',
  firstName: 'Hayrunnisa',
  // Shown in the terminal prompt as `<username>@macbook`
  username: 'hayrunnisa',
  githubUsername: 'hayrunnisayildiz',
  githubUrl: 'https://github.com/hayrunnisayildiz',

  // Optional — set to your deployed URL (e.g. 'https://hayrunnisayildiz.github.io')
  siteUrl: 'https://hayrunnisayildiz.github.io',

  // Apps that need extra content. Turn them on once you have it:
  //  - Photos: drop your images into src/lib/assets/photos/
  //  - Blog:   set a Dev.to username below and deploy a small API at /api/blog-posts
  apps: {
    photos: false,
    blog: false,
    contacts: true,
    maps: true,      // places & photos: src/lib/travel.ts
  },

  blog: {
    devto: '',     // e.g. 'https://dev.to/yourname'
    medium: '',    // e.g. 'https://medium.com/@yourname'
    hashnode: '',  // e.g. 'https://hashnode.com/@yourname'
  },

  photosCloudUrl: '', // e.g. your Pexels / Unsplash / Instagram profile

  // Music widget: a YouTube video embedded with YouTube's official player.
  // To change it, paste the id from the video URL (youtube.com/watch?v=<id>).
  music: {
    title: 'Northern Lights',
    artist: 'Asia Minor',
    album: 'Between Flesh and Divine (1980)',
    youtubeId: 'FViK9GM-ymI',
  },

  // Contacts app + mobile page. Empty fields are hidden automatically.
  contact: {
    headline: 'Machine Learning · Geostatistics · Geophysics',
    location: '',     // e.g. 'Istanbul, Türkiye'
    email: '',        // e.g. 'hayrunnisa@example.com'
    linkedin: 'https://www.linkedin.com/in/hayrunnisa-yildiz-hy',
    website: '',      // e.g. 'https://hayrunnisayildiz.github.io'
    // Profile photo: put it in static/images/ and set e.g. 'images/profile.jpg'.
    // Left empty, your initials are shown instead.
    photo: '',
    education: [
      // { school: 'Your University', degree: 'B.Sc. ...', years: '2021 – 2025', note: 'Graduation thesis: MinerAI' },
    ] as { school: string; degree: string; years?: string; note?: string }[],
    experience: [
      // { company: 'Company', role: 'Role', years: '2024 – present', note: 'What you did' },
    ] as { company: string; role: string; years?: string; note?: string }[],
  },
};
