<script lang="ts">
  import { site } from '$lib/config';
  import { projects } from '$lib/stores/projectStore';
  import Avatar from '../Avatar.svelte';

  const c = site.contact;
  const shortUrl = c.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
</script>

<div class="h-full overflow-y-auto bg-[#f4f2ee] text-gray-900">
  <div class="max-w-3xl mx-auto px-6 py-8 space-y-4">
    <!-- Profile card -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="h-28 bg-gradient-to-r from-sky-700 via-blue-600 to-teal-500"></div>
      <div class="px-6 pb-6">
        <div class="-mt-14 mb-3 inline-block rounded-full ring-4 ring-white">
          <Avatar size={112} />
        </div>
        <h1 class="text-2xl font-semibold">{site.fullName}</h1>
        <p class="text-gray-700">{c.headline}</p>
        {#if c.location}<p class="text-sm text-gray-500 mt-1">{c.location}</p>{/if}
        <p class="text-sm text-gray-500 mt-1">{shortUrl}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <a href={c.linkedin} target="_blank" rel="noopener noreferrer"
             class="px-4 py-1.5 rounded-full bg-[#0a66c2] text-white font-semibold text-sm hover:bg-[#004182]">
            Open LinkedIn profile ↗
          </a>
          <a href={site.githubUrl} target="_blank" rel="noopener noreferrer"
             class="px-4 py-1.5 rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold text-sm hover:bg-blue-50">
            GitHub ↗
          </a>
        </div>
      </div>
    </div>

    <!-- Projects -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold mb-3">Projects</h2>
      <ul class="divide-y divide-gray-100">
        {#each $projects as p}
          <li class="py-3">
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" class="font-medium hover:underline">{p.name}</a>
            <p class="text-sm text-gray-600">{p.shortDescription}</p>
          </li>
        {/each}
      </ul>
    </div>

    <p class="text-xs text-gray-500 text-center px-6">
      LinkedIn doesn't allow its pages to be shown inside other websites, so the full profile opens in a new tab.
    </p>
  </div>
</div>
