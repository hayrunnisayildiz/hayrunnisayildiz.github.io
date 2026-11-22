<script lang="ts">
  import type { wType } from "../types/wType";
  import { closeWindow, toggleMinimize, toggleMaximize } from "../stores/windowStore";
  import { site } from "$lib/config";
  import githubIcon from "$lib/assets/icons/github.png";
  import GitHubPage from "./safari/GitHubPage.svelte";
  import LinkedInPage from "./safari/LinkedInPage.svelte";

  export let startDrag: (e: MouseEvent, id: string, action: 'move' | 'resize') => void;
  export let window: wType;

  type Page =
    | { kind: "home"; url: "" }
    | { kind: "github" | "linkedin" | "web"; url: string }
    | { kind: "blocked"; url: string; host: string };

  // Sites that refuse to be shown inside another website (X-Frame-Options / CSP)
  const BLOCKED = ["github.com", "linkedin.com", "google.com", "youtube.com", "x.com", "twitter.com",
    "instagram.com", "facebook.com", "reddit.com", "medium.com", "stackoverflow.com", "kaggle.com"];

  const linkedinPath = (() => {
    try { return new URL(site.contact.linkedin).pathname.replace(/\/$/, "").toLowerCase(); } catch { return ""; }
  })();

  function resolve(input: string): Page {
    let raw = input.trim();
    if (!raw) return { kind: "home", url: "" };
    if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
    let u: URL;
    try { u = new URL(raw); } catch { return { kind: "web", url: raw }; }
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    const path = u.pathname.replace(/\/$/, "").toLowerCase();

    if (host === "github.com" && (path === "" || path === "/" + site.githubUsername.toLowerCase())) {
      return { kind: "github", url: site.githubUrl };
    }
    if (host === "linkedin.com" && site.contact.linkedin && (path === "" || path === linkedinPath)) {
      return { kind: "linkedin", url: site.contact.linkedin };
    }
    if (BLOCKED.some((b) => host === b || host.endsWith("." + b))) {
      return { kind: "blocked", url: u.href, host };
    }
    return { kind: "web", url: u.href };
  }

  // Simple history so Back / Forward work for every kind of page
  let history: Page[] = [{ kind: "home", url: "" }];
  let index = 0;
  $: page = history[index];
  $: canGoBack = index > 0;
  $: canGoForward = index < history.length - 1;

  let url = "";
  let isLoading = false;
  let reloadKey = 0;
  let iframeElement: HTMLIFrameElement;


  // Show a history entry: update the address bar and loading state
  function show(i: number) {
    index = i;
    url = history[i].url;
    isLoading = history[i].kind === "web";
  }
  function go(p: Page) {
    history = [...history.slice(0, index + 1), p];
    show(history.length - 1);
  }
  const navigateTo = (input: string) => go(resolve(input));
  const handleSubmit = () => navigateTo(url);

  function goBack() { if (canGoBack) show(index - 1); }
  function goForward() { if (canGoForward) show(index + 1); }
  function goHome() { if (page.kind !== "home") go({ kind: "home", url: "" }); }
  function refresh() {
    if (page.kind === "web" && iframeElement) { isLoading = true; iframeElement.src = page.url; }
    else reloadKey += 1;
  }

  const favorites = [
    { label: "GitHub", sub: site.githubUsername, target: site.githubUrl, icon: "github" },
    ...(site.contact.linkedin ? [{ label: "LinkedIn", sub: site.fullName, target: site.contact.linkedin, icon: "linkedin" }] : []),
    { label: "Wikipedia", sub: "wikipedia.org", target: "https://www.wikipedia.org", icon: "wiki" },
    { label: "Endless Horse", sub: "endless.horse", target: "external:http://endless.horse/", icon: "horse" },
  ];

  function openFavorite(target: string) {
    if (target.startsWith("external:")) globalThis.window.open(target.slice(9), "_blank", "noopener");
    else navigateTo(target);
  }
</script>

<div class="bg-white h-full rounded-lg flex flex-col overflow-hidden font-sf">
  <!-- Safari Header -->
  <div class="bg-gray-100 px-2 py-2 flex items-center cursor-move border-b border-gray-200" on:mousedown={(e) => startDrag(e, window.id, "move")}>
    <div class="flex space-x-2 mr-4">
      <button class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none" on:click={() => closeWindow(window.id)}>
        <svg class="w-3 h-3 text-red-800 opacity-0 hover:opacity-100" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 focus:outline-none" on:click={() => toggleMinimize(window.id)}>
        <svg class="w-3 h-3 text-yellow-800 opacity-0 hover:opacity-100" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M20 12H4" />
        </svg>
      </button>
      <button class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none" on:click={() => toggleMaximize(window.id)}>
        <svg class="w-3 h-3 text-green-800 opacity-0 hover:opacity-100" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
        </svg>
      </button>
    </div>
    <div class="flex-grow flex items-center space-x-2">
      <button class="text-gray-600 hover:text-gray-800 disabled:opacity-50" on:click={goBack} disabled={!canGoBack}>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button class="text-gray-600 hover:text-gray-800 disabled:opacity-50" on:click={goForward} disabled={!canGoForward}>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button class="text-gray-600 hover:text-gray-800" on:click={refresh}>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      <button class="text-gray-600 hover:text-gray-800" on:click={goHome}>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>
      <form on:submit|preventDefault={handleSubmit} class="flex-grow">
        <input 
          type="text" 
          bind:value={url} 
          class="w-full px-3 py-1 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="Search or enter website name"
        />
      </form>
    </div>
  </div>

  <!-- Safari Body -->
  <div class="flex-grow relative min-h-0">
    {#if page.kind === "home"}
      <div class="h-full overflow-y-auto bg-gradient-to-br from-slate-100 to-slate-200">
        <div class="max-w-3xl mx-auto px-8 py-12">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">Favorites</h1>
          <div class="grid grid-cols-4 gap-6">
            {#each favorites as f}
              <button class="group flex flex-col items-center text-center focus:outline-none" on:click={() => openFavorite(f.target)}>
                <span class="w-20 h-20 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center group-hover:shadow-md group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-blue-500 transition">
                  {#if f.icon === "github"}
                    <img src={githubIcon} alt="" class="w-12 h-12" />
                  {:else if f.icon === "linkedin"}
                    <span class="w-12 h-12 rounded-xl bg-[#0a66c2] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>
                    </span>
                  {:else if f.icon === "wiki"}
                    <span class="text-4xl font-serif text-gray-800">W</span>
                  {:else}
                    <span class="text-4xl" aria-hidden="true">🐴</span>
                  {/if}
                </span>
                <span class="mt-2 text-sm font-medium text-gray-800">{f.label}</span>
                <span class="text-xs text-gray-500 truncate max-w-full">{f.sub}</span>
              </button>
            {/each}
          </div>
          <p class="mt-12 text-xs text-gray-500">Many websites can't be shown inside another page for security reasons. Those open in a new tab instead.</p>
        </div>
      </div>
    {:else if page.kind === "github"}
      <GitHubPage {reloadKey} />
    {:else if page.kind === "linkedin"}
      <LinkedInPage />
    {:else if page.kind === "blocked"}
      <div class="h-full flex items-center justify-center bg-gray-50 p-8">
        <div class="max-w-md text-center">
          <svg viewBox="0 0 24 24" class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 14l8 0"/></svg>
          <p class="mt-4 text-lg font-semibold text-gray-800">{page.host} can't be shown in this window</p>
          <p class="mt-2 text-sm text-gray-600">This website doesn't allow itself to be opened inside another page.</p>
          <div class="mt-5 flex justify-center gap-2">
            <button class="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-100" on:click={goBack}>Go back</button>
            <a class="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700" href={page.url} target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>
          </div>
        </div>
      </div>
    {:else}
      {#if isLoading}
        <div class="absolute inset-0 flex items-center justify-center bg-white">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      {/if}
      <iframe
        bind:this={iframeElement}
        src={page.url}
        title="browser-frame"
        class="w-full h-full border-none"
        on:load={() => (isLoading = false)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      ></iframe>
    {/if}
  </div>
</div>

<style>
  .font-sf {
    font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', sans-serif;
  }
</style>