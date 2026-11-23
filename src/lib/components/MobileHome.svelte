<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import SvelteMarkdown from 'svelte-markdown';
  import 'github-markdown-css/github-markdown-light.css';
  import { site } from '$lib/config';
  import { youtube } from '$lib/utils/youtube';
  import { experience, education } from '$lib/experience';
  import { developer } from '$lib/utils/devInfo';
  import { projects } from '$lib/stores/projectStore';
  import { loadReadme } from '$lib/utils/readme';
  import { getTagColor, getTypeColor } from '$lib/utils/tagColors';
  import type { ProjectData } from '$lib/types/projectType';
  import Avatar from './Avatar.svelte';
  import ProjectIcons from './ProjectIcons.svelte';
  import CodeBlockWrapper from './CodeBlockWrapper.svelte';

  const c = site.contact;
  const strip = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  // Terminal text → plain prose (drop line breaks and the "Try `ls` …" hint)
  const about = developer.about
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s*Try `[^]*$/, '')
    .trim();

  const links = [
    { label: 'GitHub', value: strip(site.githubUrl), href: site.githubUrl },
    c.email && { label: 'Email', value: c.email, href: `mailto:${c.email}` },
    c.linkedin && { label: 'LinkedIn', value: strip(c.linkedin), href: c.linkedin },
    c.website && { label: 'Website', value: strip(c.website), href: c.website },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  // Desktop notice (dismissed once per browser session)
  let showNotice = false;
  onMount(() => {
    try {
      showNotice = sessionStorage.getItem('desktop-notice') !== 'dismissed';
    } catch {
      showNotice = true;
    }
  });
  function dismissNotice() {
    showNotice = false;
    try { sessionStorage.setItem('desktop-notice', 'dismissed'); } catch { /* storage unavailable */ }
  }

  // Project detail sheet
  let openProject: ProjectData | null = null;
  let readme = '';
  let loading = false;
  let sheet: HTMLDivElement;
  let scrollY = 0;

  async function showProject(p: ProjectData) {
    scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    openProject = p;
    loading = !p.readme;
    readme = '';
    const content = await loadReadme(p);
    if (openProject === p) readme = content;
    loading = false;
    await tick();
    sheet?.scrollTo(0, 0);
  }
  async function closeProject() {
    document.body.style.overflow = '';
    openProject = null;
    await tick();
    window.scrollTo(0, scrollY);
  }

  const renderers = { code: CodeBlockWrapper };
  const year = new Date().getFullYear();
  let coverFailed = false;
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && openProject && closeProject()} />

<div class="min-h-screen font-sans text-white bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800">
  {#if showNotice}
    <div class="sticky top-0 z-30 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-start gap-3" transition:fade={{ duration: 150 }}>
      <svg viewBox="0 0 24 24" class="w-5 h-5 mt-0.5 shrink-0 text-white/80" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
      <p class="text-sm text-white/90 flex-1">
        On a computer, this site opens as an interactive macOS-style desktop with a terminal and draggable windows.
      </p>
      <button class="text-sm font-medium px-2 py-1 -my-1 rounded-md hover:bg-white/10" on:click={dismissNotice} aria-label="Dismiss">OK</button>
    </div>
  {/if}

  <main class="max-w-xl mx-auto px-5 pb-12">
    <!-- Hero -->
    <header class="pt-10 pb-8 flex flex-col items-center text-center">
      <Avatar size={104} />
      <h1 class="mt-5 text-3xl font-bold leading-tight">{site.fullName}</h1>
      <p class="mt-2 text-white/75">{c.headline}</p>
      {#if c.location}<p class="mt-1 text-sm text-white/60">{c.location}</p>{/if}
      <div class="mt-5 flex flex-wrap justify-center gap-2">
        {#each links as l}
          <a href={l.href} target="_blank" rel="noopener noreferrer"
             class="min-h-[44px] inline-flex items-center px-4 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-sm font-medium">
            {l.label}
          </a>
        {/each}
      </div>
    </header>

    <!-- About -->
    <section class="card">
      <h2 class="label">About</h2>
      <p class="leading-relaxed text-white/90">{about}</p>
    </section>

    <!-- Projects -->
    <section class="mt-6">
      <h2 class="label px-1">Projects</h2>
      <div class="space-y-3">
        {#each $projects as p}
          <button class="card w-full text-left active:scale-[0.99] transition-transform" on:click={() => showProject(p)}>
            <div class="flex items-start gap-3">
              <span class="w-11 h-11 shrink-0 rounded-xl bg-white p-1.5"><ProjectIcons iconName={p.icon} /></span>
              <div class="min-w-0 flex-1">
                <p class="font-semibold leading-snug">{p.name}</p>
                <p class="mt-1 text-sm text-white/75 leading-snug">{p.shortDescription}</p>
              </div>
              <svg viewBox="0 0 24 24" class="w-5 h-5 mt-3 shrink-0 text-white/50" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg>
            </div>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span class="chip capitalize {getTypeColor(p.type)}">{p.type}</span>
              {#each p.technologies as t}<span class="chip {getTagColor(t)}">{t}</span>{/each}
            </div>
          </button>
        {/each}
      </div>
    </section>

    <!-- Skills -->
    <section class="card mt-6">
      <h2 class="label">Skills</h2>
      <p class="text-sm text-white/60 mb-2">Languages</p>
      <div class="flex flex-wrap gap-1.5 mb-4">
        {#each developer.code as s}<span class="chip bg-white/15 text-white">{s}</span>{/each}
      </div>
      <p class="text-sm text-white/60 mb-2">Libraries & tools</p>
      <div class="flex flex-wrap gap-1.5 mb-4">
        {#each developer.toolsUsed as s}<span class="chip bg-white/15 text-white">{s}</span>{/each}
      </div>
      <p class="text-sm text-white/60 mb-2">Interests</p>
      <ul class="space-y-1 text-white/90">
        {#each developer.interests as s}<li class="flex gap-2"><span class="text-teal-300">•</span>{s}</li>{/each}
      </ul>
    </section>

    {#if experience.length}
      <section class="card mt-6">
        <h2 class="label">Experience</h2>
        <div class="space-y-4">
          {#each experience as e}
            <div>
              <p class="font-medium">{e.role}</p>
              <p class="text-sm text-white/75">{e.company}{e.dates ? ` · ${e.dates}` : ''}</p>
              {#if e.summary}<p class="text-sm text-white/60 mt-1">{e.summary}</p>{/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if education.length}
      <section class="card mt-6">
        <h2 class="label">Education</h2>
        <div class="space-y-4">
          {#each education as e}
            <div>
              <p class="font-medium">{e.degree}</p>
              <p class="text-sm text-white/75">{e.school} · {e.dates}</p>
              {#if e.note}<p class="text-sm text-white/60 mt-1">{e.note}</p>{/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Music -->
    <section class="card mt-6">
      <h2 class="label">Now Playing</h2>
      <div class="flex items-center gap-4 mb-4">
        {#if coverFailed}
          <div class="w-16 h-16 rounded-full shadow-lg shrink-0 vinyl flex items-center justify-center" aria-hidden="true">
            <span class="w-4 h-4 rounded-full bg-black/80 ring-2 ring-white/40"></span>
          </div>
        {:else}
          <img src={youtube.coverUrl} alt="{site.music.artist} — {site.music.title}"
               class="w-16 h-16 rounded-lg object-cover scale-100 bg-neutral-900 text-transparent shadow-lg shrink-0"
               on:error={() => (coverFailed = true)} />
        {/if}
        <div class="min-w-0 flex-1">
          <p class="font-semibold truncate">{site.music.title}</p>
          <p class="text-sm text-white/70 truncate">{site.music.artist}</p>
          <p class="text-xs text-white/50 truncate">{site.music.album}</p>
        </div>
        <a href={youtube.watchUrl} target="_blank" rel="noopener noreferrer"
           class="min-h-[44px] inline-flex items-center px-3 rounded-full bg-white/15 border border-white/20 text-xs font-medium whitespace-nowrap">YouTube</a>
      </div>
      <div class="rounded-xl overflow-hidden bg-black/40 aspect-video">
        <iframe
          title="{site.music.artist} — {site.music.title} on YouTube"
          src={youtube.embedUrl}
          class="w-full h-full"
          frameborder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
    </section>

    <footer class="mt-10 text-center text-xs text-white/50 space-y-1">
      <p>© {year} {site.fullName}</p>
      <p>Based on <a class="underline" href="https://github.com/ansxuman/macOS-Themed-Portfolio" target="_blank" rel="noopener noreferrer">macOS-Themed-Portfolio</a> by ansxuman</p>
    </footer>
  </main>
</div>

<!-- Project detail sheet -->
{#if openProject}
  <div class="fixed inset-0 z-40 bg-white text-gray-900 flex flex-col" transition:fly={{ y: 40, duration: 200 }} role="dialog" aria-modal="true" aria-label={openProject.name}>
    <div class="shrink-0 flex items-center gap-2 px-2 h-14 border-b border-gray-200 bg-white/95 backdrop-blur">
      <button class="min-h-[44px] inline-flex items-center gap-1 px-2 text-blue-600 font-medium" on:click={closeProject}>
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m15 6-6 6 6 6"/></svg>
        Back
      </button>
      <p class="flex-1 text-center font-semibold truncate font-sans">{openProject.name}</p>
      <a href={openProject.githubUrl} target="_blank" rel="noopener noreferrer"
         class="min-h-[44px] inline-flex items-center px-2 text-blue-600 font-medium font-sans">GitHub</a>
    </div>
    <div class="flex-1 overflow-y-auto overscroll-contain" bind:this={sheet}>
      {#if loading}
        <div class="flex justify-center py-20"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div></div>
      {:else}
        <article class="markdown-body mobile-md">
          <SvelteMarkdown source={readme} {renderers} />
        </article>
      {/if}
    </div>
  </div>
{/if}

<style>
  .card {
    display: block;
    border-radius: 1rem;
    padding: 1.25rem;
    background: rgb(255 255 255 / 0.1);
    border: 1px solid rgb(255 255 255 / 0.12);
    backdrop-filter: blur(12px);
  }
  .label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgb(255 255 255 / 0.6);
    margin-bottom: 0.75rem;
  }
  .chip {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
  }
  .vinyl {
    background: repeating-radial-gradient(circle at center, #111 0 2px, #1d1d1d 2px 4px), #111;
  }
  :global(.mobile-md.markdown-body) {
    padding: 20px 16px 48px;
    font-size: 15px;
  }
  :global(.mobile-md table) {
    display: block;
    overflow-x: auto;
    font-size: 13px;
  }
  :global(.mobile-md img) {
    border-radius: 8px;
  }
</style>
