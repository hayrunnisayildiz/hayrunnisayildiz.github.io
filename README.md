# Hayrunnisa Yıldız — Portfolio

An interactive, macOS-inspired portfolio: a desktop with a status bar, widgets, a dock, Launchpad and draggable windows.

**Apps:** Terminal (try `help`, `ls`, `cat about`, `cat projects/minerai`) · Projects · Contacts · Safari · GitHub link
**Widgets:** clock and a YouTube music player (Asia Minor — Northern Lights)

Built with [SvelteKit](https://kit.svelte.dev/), [TailwindCSS](https://tailwindcss.com/) and TypeScript.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in ./build
```

## Make it yours

| What | Where |
| --- | --- |
| Name, username, GitHub, links, which apps are shown | `src/lib/config.ts` |
| Contacts app & mobile page: email, LinkedIn, photo, education, experience | `src/lib/config.ts` → `contact` |
| Terminal `about` / `interests` text, languages, tools | `src/lib/utils/devInfo.ts` |
| Projects shown in the Projects app and terminal | `src/lib/stores/projectStore.ts` |
| Photos (then set `apps.photos: true`) | `src/lib/assets/photos/` |
| Music widget (any YouTube video id) | `src/lib/config.ts` → `music` |

## Deploy to GitHub Pages

The repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and publishes the site on every push to `main`.

1. Create a **public** repository named **`hayrunnisayildiz.github.io`** and push this project to its `main` branch.
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push (or run the workflow from the **Actions** tab). After about a minute the site is live at **https://hayrunnisayildiz.github.io**.

Using a different repository name (e.g. `portfolio`) also works: the workflow detects it and the site is served at `https://hayrunnisayildiz.github.io/portfolio/`.

To test the GitHub Pages build locally: `BASE_PATH=/portfolio npm run build && npx vite preview`.

## Mobile

Phones (screens narrower than 768px) get a simple scrolling page with the same content: about, projects (with the full project pages), skills, contact and music. Tablets and computers get the desktop.

## Credits

Based on [macOS-Themed-Portfolio](https://github.com/ansxuman/macOS-Themed-Portfolio) by ansxuman, licensed under Apache 2.0 (see `LICENSE`).
This version has been modified: personal content was replaced, the original author's photos, blog worker and deployment scripts were removed, and site settings were centralized in `src/lib/config.ts`.
