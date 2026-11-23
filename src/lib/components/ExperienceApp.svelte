<script lang="ts">
  import { closeWindow, toggleMinimize, toggleMaximize } from '../stores/windowStore';
  import type { wType } from '../types/wType';
  import { experience, education } from '$lib/experience';
  import { site } from '$lib/config';
  import { addWindow } from '../stores/windowStore';
  import { projects, requestedProject } from '../stores/projectStore';

  function openProject(id: string) {
    requestedProject.set(id);
    addWindow('projects');
  }

  export let startDrag: (e: MouseEvent, id: string, action: 'move' | 'resize') => void;
  export let window: wType;

  const internships = experience.filter((e) => /intern/i.test(`${e.type ?? ''} ${e.role}`)).length;
  const companies = new Set(experience.map((e) => e.company)).size;
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
    <div class="flex-grow text-center font-semibold">Experience</div>
    <div class="w-14"></div>
  </div>

  <div class="flex-1 overflow-y-auto">
    <div class="max-w-2xl mx-auto px-8 py-8">
      <header class="mb-8">
        <h1 class="text-2xl font-bold">Experience</h1>
        <p class="text-gray-500 mt-1">
          {#if experience.length}
            {#if internships === experience.length}
              {internships} {internships === 1 ? 'internship' : 'internships'}
            {:else}
              {experience.length} {experience.length === 1 ? 'position' : 'positions'}{internships ? ` · ${internships} ${internships === 1 ? 'internship' : 'internships'}` : ''}
            {/if}
            {#if companies > 1}at {companies} organisations{/if}
          {:else}
            {site.fullName}
          {/if}
        </p>
      </header>

      {#if experience.length === 0}
        <p class="text-gray-500">Nothing here yet.</p>
      {:else}
        <ol class="relative border-l-2 border-indigo-100 ml-2">
          {#each experience as e}
            <li class="relative pl-8 pb-8 last:pb-0">
              <span class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white" aria-hidden="true"></span>
              <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 class="text-lg font-semibold leading-snug">{e.role}</h2>
                <span class="text-sm text-gray-500 whitespace-nowrap">{e.dates}</span>
              </div>
              <p class="text-gray-700">
                {#if e.url}
                  <a href={e.url} target="_blank" rel="noopener noreferrer" class="font-medium text-indigo-600 hover:underline">{e.company} ↗</a>
                {:else}
                  <span class="font-medium">{e.company}</span>
                {/if}
                {#if e.location}<span class="text-gray-500"> · {e.location}</span>{/if}
                {#if e.type}<span class="ml-2 align-middle inline-block whitespace-nowrap text-[11px] font-medium uppercase tracking-wide bg-indigo-50 text-indigo-700 rounded-full px-2 py-0.5">{e.type}</span>{/if}
              </p>
              {#if e.summary}<p class="mt-2 text-gray-700 leading-relaxed">{e.summary}</p>{/if}
              {#if e.highlights?.length}
                <ul class="mt-2 space-y-1 text-gray-700">
                  {#each e.highlights as h}
                    <li class="flex gap-2"><span class="text-indigo-400 mt-0.5" aria-hidden="true">▸</span><span>{h}</span></li>
                  {/each}
                </ul>
              {/if}
              {#if e.tools?.length}
                <div class="mt-3 flex flex-wrap gap-1.5">
                  {#each e.tools as t}<span class="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-2.5 py-0.5">{t}</span>{/each}
                </div>
              {/if}
              {#if e.project}
                {@const proj = $projects.find((p) => p.id === e.project)}
                {#if proj}
                  <button class="mt-3 text-sm font-medium text-indigo-600 hover:underline" on:click={() => openProject(proj.id)}>
                    See project: {proj.name} →
                  </button>
                {/if}
              {/if}
            </li>
          {/each}
        </ol>
      {/if}

      {#if education.length}
        <h2 class="mt-12 mb-6 text-xl font-bold">Education</h2>
        <ol class="relative border-l-2 border-teal-100 ml-2">
          {#each education as e}
            <li class="relative pl-8 pb-8 last:pb-0">
              <span class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-teal-500 ring-4 ring-white" aria-hidden="true"></span>
              <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 class="text-lg font-semibold leading-snug">{e.degree}</h3>
                <span class="text-sm text-gray-500 whitespace-nowrap">{e.dates}</span>
              </div>
              <p class="text-gray-700">
                <span class="font-medium">{e.school}</span>
                {#if e.location}<span class="text-gray-500"> · {e.location}</span>{/if}
              </p>
              {#if e.note}<p class="mt-2 text-gray-700">{e.note}</p>{/if}
              {#if e.project}
                {@const proj = $projects.find((p) => p.id === e.project)}
                {#if proj}
                  <button class="mt-2 text-sm font-medium text-teal-700 hover:underline" on:click={() => openProject(proj.id)}>
                    See project: {proj.name} →
                  </button>
                {/if}
              {/if}
            </li>
          {/each}
        </ol>
      {/if}
    </div>
  </div>
</div>
