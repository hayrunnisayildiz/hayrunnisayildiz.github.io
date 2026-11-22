<script lang="ts">
  import { closeWindow, toggleMinimize, toggleMaximize, addWindow } from '../stores/windowStore';
  import { projects, requestedProject } from '../stores/projectStore';
  import type { wType } from '../types/wType';
  import { site } from '$lib/config';
  import Avatar from './Avatar.svelte';
  import ProjectIcons from './ProjectIcons.svelte';

  export let startDrag: (e: MouseEvent, id: string, action: 'move' | 'resize') => void;
  export let window: wType;

  const c = site.contact;
  const strip = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  const rows = [
    c.email && { label: 'Email', value: c.email, href: `mailto:${c.email}`, icon: 'mail' },
    { label: 'GitHub', value: strip(site.githubUrl), href: site.githubUrl, icon: 'github' },
    c.linkedin && { label: 'LinkedIn', value: strip(c.linkedin), href: c.linkedin, icon: 'linkedin' },
    c.website && { label: 'Website', value: strip(c.website), href: c.website, icon: 'globe' },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: string }[];

  let query = '';
  $: matches = site.fullName.toLocaleLowerCase('tr-TR').includes(query.trim().toLocaleLowerCase('tr-TR'));

  function openProject(id: string) {
    requestedProject.set(id);
    addWindow('projects');
  }
</script>

<div class="bg-white h-full rounded-lg flex flex-col overflow-hidden font-sans text-gray-900">
  <!-- Title bar -->
  <div
    class="bg-gray-100 px-2 py-2 flex items-center cursor-move border-b border-gray-200"
    on:mousedown={(e) => startDrag(e, window.id, 'move')}
  >
    <div class="flex space-x-2 mr-4">
      <button aria-label="Close" class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none" on:click={() => closeWindow(window.id)}></button>
      <button aria-label="Minimize" class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 focus:outline-none" on:click={() => toggleMinimize(window.id)}></button>
      <button aria-label="Maximize" class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none" on:click={() => toggleMaximize(window.id)}></button>
    </div>
    <div class="flex-grow text-center font-semibold">Contacts</div>
    <div class="w-14"></div>
  </div>

  <div class="flex flex-1 min-h-0">
    <!-- Sidebar -->
    <aside class="w-56 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div class="p-3">
        <input
          type="search"
          placeholder="Search"
          bind:value={query}
          class="w-full rounded-md bg-gray-200/70 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {#if matches}
        <div class="mx-2 rounded-md bg-blue-500 text-white px-3 py-2 flex items-center gap-2">
          <Avatar size={30} />
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{site.fullName}</p>
            <p class="text-[11px] text-white/80 truncate">{c.headline}</p>
          </div>
        </div>
      {:else}
        <p class="px-4 text-sm text-gray-500">No Results</p>
      {/if}
    </aside>

    <!-- Card -->
    <section class="flex-1 overflow-y-auto">
      <div class="max-w-xl mx-auto px-8 py-8">
        <div class="flex flex-col items-center text-center">
          <Avatar size={104} />
          <h1 class="mt-4 text-2xl font-bold">{site.fullName}</h1>
          <p class="text-gray-600 mt-1">{c.headline}</p>
          {#if c.location}<p class="text-sm text-gray-500 mt-1">{c.location}</p>{/if}
        </div>

        <h2 class="mt-8 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</h2>
        <div class="rounded-xl border border-gray-200 divide-y divide-gray-200">
          {#each rows as row}
            <a href={row.href} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
              <span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                {#if row.icon === 'mail'}
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                {:else if row.icon === 'github'}
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></svg>
                {:else if row.icon === 'linkedin'}
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>
                {:else}
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
                {/if}
              </span>
              <span class="min-w-0">
                <span class="block text-xs text-gray-500">{row.label}</span>
                <span class="block text-sm text-blue-600 truncate">{row.value}</span>
              </span>
            </a>
          {/each}
        </div>

        {#if c.experience.length}
          <h2 class="mt-8 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Experience</h2>
          <div class="rounded-xl border border-gray-200 divide-y divide-gray-200">
            {#each c.experience as e}
              <div class="px-4 py-3">
                <div class="flex justify-between gap-4">
                  <p class="font-medium">{e.role}</p>
                  {#if e.years}<p class="text-sm text-gray-500 whitespace-nowrap">{e.years}</p>{/if}
                </div>
                <p class="text-sm text-gray-600">{e.company}</p>
                {#if e.note}<p class="text-sm text-gray-500 mt-1">{e.note}</p>{/if}
              </div>
            {/each}
          </div>
        {/if}

        {#if c.education.length}
          <h2 class="mt-8 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Education</h2>
          <div class="rounded-xl border border-gray-200 divide-y divide-gray-200">
            {#each c.education as e}
              <div class="px-4 py-3">
                <div class="flex justify-between gap-4">
                  <p class="font-medium">{e.degree}</p>
                  {#if e.years}<p class="text-sm text-gray-500 whitespace-nowrap">{e.years}</p>{/if}
                </div>
                <p class="text-sm text-gray-600">{e.school}</p>
                {#if e.note}<p class="text-sm text-gray-500 mt-1">{e.note}</p>{/if}
              </div>
            {/each}
          </div>
        {/if}

        <h2 class="mt-8 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Projects</h2>
        <div class="rounded-xl border border-gray-200 divide-y divide-gray-200">
          {#each $projects as p}
            <button class="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-50" on:click={() => openProject(p.id)}>
              <span class="w-8 h-8 shrink-0"><ProjectIcons iconName={p.icon} /></span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-medium">{p.name}</span>
                <span class="block text-xs text-gray-500 truncate">{p.shortDescription}</span>
              </span>
              <span class="text-gray-400" aria-hidden="true">›</span>
            </button>
          {/each}
        </div>
      </div>
    </section>
  </div>
</div>
