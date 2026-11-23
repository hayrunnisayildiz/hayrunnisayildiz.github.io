// Short showcase page for this portfolio site (Projects app + mobile page).
import { site } from '$lib/config';
import desktop from '$lib/assets/projects/portfolio/desktop.jpg';

export const portfolioReadme = `
# macOS Portfolio

*Personal website · This site*

An interactive portfolio that **looks and works like a macOS desktop**: a working terminal, draggable windows,
a dock and small apps. On phones it switches to a simple scrolling page, so it's easy to read anywhere.

![The portfolio desktop with the terminal open](${desktop})

**What I did**

- Started from an open-source template and personalised it with my own projects and content
- Added a Contacts app, a mobile page, GitHub and LinkedIn pages in Safari, and a YouTube music player
- Tested every feature and set up automatic publishing to GitHub Pages

**Built with:** SvelteKit · TypeScript · TailwindCSS · GitHub Actions

[Code on GitHub →](${site.githubUrl}/${site.githubUsername}.github.io)
`;
