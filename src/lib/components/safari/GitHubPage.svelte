<script lang="ts">
  import { onMount } from 'svelte';
  import { site } from '$lib/config';
  import { projects, requestedProject } from '$lib/stores/projectStore';
  import { addWindow } from '$lib/stores/windowStore';
  import { fetchGitHubProfile, languageColors, timeAgo, type GitHubProfile } from '$lib/utils/githubProfile';

  export let reloadKey = 0;

  let data: GitHubProfile | null = null;
  let error = '';
  let loading = true;

  async function load() {
    loading = true;
    error = '';
    try {
      data = await fetchGitHubProfile(site.githubUsername);
    } catch (e) {
      error = (e as Error).message;
    }
    loading = false;
  }

  onMount(load);
  $: if (reloadKey) load();

  // Repos that have a showcase page in the Projects app
  $: showcase = new Map(
    $projects.map((p) => [p.githubUrl.split('/').pop()?.toLowerCase() ?? '', p.id])
  );

  function openShowcase(id: string) {
    requestedProject.set(id);
    addWindow('projects');
  }
</script>

<div class="h-full overflow-y-auto bg-white text-gray-900">
  {#if loading}
    <div class="max-w-5xl mx-auto p-8 flex gap-8 animate-pulse">
      <div class="w-56 shrink-0 space-y-3">
        <div class="w-48 h-48 rounded-full bg-gray-200"></div>
        <div class="h-6 w-40 bg-gray-200 rounded"></div>
        <div class="h-4 w-28 bg-gray-200 rounded"></div>
      </div>
      <div class="flex-1 grid grid-cols-2 gap-4">
        {#each Array(6) as _}<div class="h-28 rounded-lg bg-gray-100"></div>{/each}
      </div>
    </div>
  {:else if error || !data}
    <div class="h-full flex items-center justify-center p-8">
      <div class="max-w-md text-center">
        <p class="text-lg font-semibold">Couldn't load the GitHub profile</p>
        <p class="mt-2 text-sm text-gray-600">
          {error === 'rate-limit'
            ? 'GitHub limits how often its public data can be loaded. Try again in a few minutes.'
            : 'GitHub could not be reached right now.'}
        </p>
        <div class="mt-5 flex justify-center gap-2">
          <button class="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50" on:click={load}>Try again</button>
          <a class="px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-700" href={site.githubUrl} target="_blank" rel="noopener noreferrer">Open on GitHub ↗</a>
        </div>
      </div>
    </div>
  {:else}
    {@const u = data.user}
    <div class="max-w-5xl mx-auto px-8 py-8 flex gap-8 items-start">
      <!-- Profile -->
      <aside class="w-56 shrink-0">
        <img src={u.avatar_url} alt={u.login} class="w-48 h-48 rounded-full border border-gray-200 bg-gray-100" />
        <h1 class="mt-4 text-2xl font-semibold leading-tight">{u.name || site.fullName}</h1>
        <p class="text-lg text-gray-500 font-light">{u.login}</p>
        {#if u.bio}<p class="mt-3 text-sm">{u.bio}</p>{/if}
        <a href={u.html_url} target="_blank" rel="noopener noreferrer"
           class="mt-4 block text-center text-sm font-medium px-3 py-1.5 rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200">
          Open on GitHub ↗
        </a>
        <p class="mt-4 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">{u.followers}</span> followers ·
          <span class="font-semibold text-gray-900">{u.following}</span> following
        </p>
        {#if u.location}<p class="mt-2 text-sm text-gray-600">📍 {u.location}</p>{/if}
      </aside>

      <!-- Repositories -->
      <section class="flex-1 min-w-0">
        <h2 class="text-base font-semibold mb-3">
          Repositories <span class="ml-1 text-xs font-medium bg-gray-100 rounded-full px-2 py-0.5">{data.repos.length}</span>
        </h2>
        {#if data.repos.length === 0}
          <p class="text-sm text-gray-500">No public repositories yet.</p>
        {:else}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {#each data.repos as r}
              {@const pid = showcase.get(r.name.toLowerCase())}
              <div class="border border-gray-200 rounded-lg p-4 flex flex-col">
                <div class="flex items-center gap-2 min-w-0">
                  <a href={r.html_url} target="_blank" rel="noopener noreferrer" class="font-semibold text-blue-600 hover:underline truncate">{r.name}</a>
                  <span class="text-xs text-gray-500 border border-gray-300 rounded-full px-2 shrink-0">{r.archived ? 'Archived' : 'Public'}</span>
                </div>
                <p class="mt-1 text-sm text-gray-600 flex-1">{r.description || ''}</p>
                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 whitespace-nowrap">
                  {#if r.language}
                    <span class="flex items-center gap-1">
                      <span class="w-3 h-3 rounded-full" style="background:{languageColors[r.language] || '#8b949e'}"></span>{r.language}
                    </span>
                  {/if}
                  {#if r.stargazers_count}<span>★ {r.stargazers_count}</span>{/if}
                  <span>Updated {timeAgo(r.pushed_at)}</span>
                  {#if pid}
                    <button class="ml-auto text-blue-600 font-medium hover:underline whitespace-nowrap" on:click={() => openShowcase(pid)}>Showcase →</button>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    </div>
  {/if}
</div>
