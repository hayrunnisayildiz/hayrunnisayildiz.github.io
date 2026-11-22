export interface ProjectData {
  id: string;
  name: string;
  icon: string;
  shortDescription: string;
  githubUrl: string;
  readmeUrl: string;
  technologies: string[];
  type: string;
  /** Optional local markdown shown instead of fetching the GitHub README */
  readme?: string;
  }