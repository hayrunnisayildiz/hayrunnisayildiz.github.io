import type { ProjectData } from '../types/projectType';

/** Returns the markdown shown for a project: local showcase page, GitHub README, or a short fallback. */
export async function loadReadme(project: ProjectData): Promise<string> {
  if (project.readme) return project.readme;
  try {
    const response = await fetch(project.readmeUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch {
    return `# ${project.name}\n\n${project.shortDescription}\n\n[View on GitHub](${project.githubUrl})`;
  }
}
