import { writable } from 'svelte/store';
import type { ProjectData } from '../types/projectType';
import { site } from '$lib/config';
import { mineraiReadme } from '$lib/projects/minerai';
import { smartpriorReadme } from '$lib/projects/smartprior';
import { smartpriorMTReadme } from '$lib/projects/smartpriorMT';
import { portfolioReadme } from '$lib/projects/portfolio';

const gh = (repo: string) => ({
  githubUrl: `${site.githubUrl}/${repo}`,
  // README is loaded from the repo's default branch (change 'main' if yours is 'master')
  readmeUrl: `https://raw.githubusercontent.com/${site.githubUsername}/${repo}/main/README.md`,
});

// Add your GitHub repositories here — they appear in the Projects app
// and in the terminal under `ls projects`.
// icon options: 'svelte' | 'go' | 'wails' (anything else shows a generic icon)
const initialProjects: ProjectData[] = [
  {
    id: 'minerai',
    name: 'MinerAI — Graduation Thesis',
    icon: 'minerai',
    shortDescription:
      'Graduation thesis: machine learning that maps where gold is likely to be underground, using drill-hole data.',
    ...gh('minerai'),
    readme: mineraiReadme,
    technologies: ['Python', 'scikit-learn', 'XGBoost', 'LightGBM', 'Geostatistics'],
    type: 'thesis',
  },
  {
    id: 'smartprior',
    name: 'SmartPrior',
    icon: 'smartprior',
    shortDescription:
      'A neural network that predicts rock properties in 3D from drill holes and shows how certain it is.',
    ...gh('SmartPrior'),
    readme: smartpriorReadme,
    technologies: ['Julia', 'Lux.jl', 'Deep Learning', 'Geostatistics'],
    type: 'research',
  },
  {
    id: 'smartprior-mt',
    name: 'SmartPriorMT',
    icon: 'smartprior-mt',
    shortDescription:
      'A neural network that gives underground imaging a smarter starting point, so it fits the data faster.',
    ...gh('SmartPriorMT'),
    readme: smartpriorMTReadme,
    technologies: ['Julia', 'Lux.jl', 'Geophysics', 'Inversion'],
    type: 'research',
  },
  {
    id: 'macos-portfolio',
    name: 'macOS Portfolio',
    icon: 'svelte',
    shortDescription:
      'This website: an interactive macOS-style desktop with a terminal, apps and a mobile version.',
    ...gh('hayrunnisayildiz.github.io'),
    readme: portfolioReadme,
    technologies: ['Svelte', 'TypeScript', 'TailwindCSS'],
    type: 'application',
  },
  // {
  //   id: 'my-project',
  //   name: 'My Project',
  //   icon: 'code',
  //   shortDescription: 'One sentence about what it does.',
  //   ...gh('my-project'),
  //   technologies: ['Python'],
  //   type: 'application', // or 'library'
  // },
];

export const projects = writable<ProjectData[]>(initialProjects);

// Set to a project id to open that project in the Projects app (e.g. from Contacts).
export const requestedProject = writable<string | null>(null);
