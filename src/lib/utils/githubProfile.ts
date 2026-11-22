// Public GitHub data for the Safari "GitHub" page (no token needed; 60 requests/hour per visitor).

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

export interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

export interface GitHubProfile {
  user: GitHubUser;
  repos: GitHubRepo[];
}

const CACHE_MINUTES = 15;

export async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
  const key = `gh-profile:${username}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (cached && Date.now() - cached.at < CACHE_MINUTES * 60_000) return cached.data;
  } catch {
    /* storage unavailable */
  }

  const api = 'https://api.github.com';
  const headers = { Accept: 'application/vnd.github+json' };
  const [userRes, reposRes] = await Promise.all([
    fetch(`${api}/users/${username}`, { headers }),
    fetch(`${api}/users/${username}/repos?per_page=100&sort=pushed`, { headers }),
  ]);
  if (!userRes.ok || !reposRes.ok) {
    const status = !userRes.ok ? userRes.status : reposRes.status;
    throw new Error(status === 403 || status === 429 ? 'rate-limit' : `http-${status}`);
  }
  const user: GitHubUser = await userRes.json();
  const repos: GitHubRepo[] = (await reposRes.json())
    .filter((r: GitHubRepo) => !r.fork)
    .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count || b.pushed_at.localeCompare(a.pushed_at));

  const data = { user, repos };
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage unavailable */
  }
  return data;
}

// Colours GitHub uses for common languages
export const languageColors: Record<string, string> = {
  Python: '#3572A5',
  Julia: '#a270ba',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Svelte: '#ff3e00',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'Jupyter Notebook': '#DA5B0B',
  R: '#198CE7',
  MATLAB: '#e16737',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  TeX: '#3D6117',
};

export function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}
