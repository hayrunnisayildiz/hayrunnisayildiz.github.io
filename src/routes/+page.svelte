<script lang="ts">
  import { onMount } from "svelte";
  import Desktop from "./../lib/components/Desktop.svelte";
  import Dock from "../lib/components/Dock.svelte";
  import Window from "../lib/components/Window.svelte";
  import Launchpad from "../lib/components/Launchpad.svelte";
  import MobileHome from "$lib/components/MobileHome.svelte";
  import { site } from "$lib/config";
  import type { AppType } from "$lib/types/wType";
  import { windows, addWindow, isAppRunning, isAppMinimized } from "../lib/stores/windowStore";

  let isLaunchpadOpen = false;

  // Phones get a simple scrolling page; tablets and computers get the desktop.
  const MOBILE_QUERY = "(max-width: 767px)";
  let mounted = false;
  let isMobile = false;

  onMount(() => {
    document.title = `${site.fullName} | Portfolio`;
    const mq = window.matchMedia(MOBILE_QUERY);
    isMobile = mq.matches;
    mounted = true;
    if (!isMobile) addWindow("terminal");
    const onChange = (e: MediaQueryListEvent) => {
      isMobile = e.matches;
      if (!isMobile && !isAppRunning("terminal")) addWindow("terminal");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  });

  function handleOpenLaunchpad() {
    isLaunchpadOpen = true;
  }

  function handleLaunchApp(event: CustomEvent<string>) {
    addWindow(event.detail as AppType | "github");
    isLaunchpadOpen = false;
  }
</script>

{#if !mounted}
  <!-- brief placeholder until we know the screen size -->
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800"></div>
{:else if isMobile}
  <MobileHome />
{:else}
<main class="min-h-screen font-mono relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800 opacity-80"></div>
  
  <Desktop />
  
  {#each $windows as window (window.id)}
    <Window {window} />
  {/each}
  
  <Dock {isAppRunning} {isAppMinimized} {addWindow} on:openLaunchpad={handleOpenLaunchpad} />
  
  <Launchpad isOpen={isLaunchpadOpen} on:launchApp={handleLaunchApp} on:closeLaunchpad={() => isLaunchpadOpen = false} />
</main>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
