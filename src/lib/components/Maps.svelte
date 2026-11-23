<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { closeWindow, toggleMinimize, toggleMaximize } from '../stores/windowStore';
  import type { wType } from '../types/wType';
  import { places, photosFor, type Place } from '$lib/travel';
  import { fold } from '$lib/utils/search';
  import earthTexture from '$lib/assets/maps/earth-blue-marble.jpg';
  import earthBump from '$lib/assets/maps/earth-topology.jpg';

  export let startDrag: (e: MouseEvent, id: string, action: 'move' | 'resize') => void;
  export let window: wType;

  let container: HTMLDivElement;
  let globe: any;
  let ro: ResizeObserver | undefined;
  let loadError = false;
  let ready = false;
  let rotating = true;

  let query = '';
  let selected: Place | null = null;
  let lightbox = -1; // index into selected place's photos, -1 = closed

  $: filtered = places.filter((p) => fold(`${p.name} ${p.country}`).includes(fold(query)));
  // group the list by country, in the order countries first appear
  $: groups = filtered.reduce((acc, p) => {
    const g = acc.find((x) => x.country === p.country);
    g ? g.items.push(p) : acc.push({ country: p.country, items: [p] });
    return acc;
  }, [] as { country: string; items: Place[] }[]);
  $: photos = selected ? photosFor(selected.id) : [];
  $: countries = new Set(places.map((p) => p.country)).size;

  // Opening view: centred on the places (Europe)
  const HOME_VIEW = { lat: 47, lng: 24, altitude: 2.2 };

  function pinElement(p: Place): HTMLElement {
    const thumb = photosFor(p.id)[0]?.src;
    const el = document.createElement('button');
    el.className = 'map-pin';
    el.setAttribute('aria-label', `${p.name}, ${p.country}`);
    el.dataset.id = p.id;
    el.innerHTML = `
      <span class="map-pin__inner">
        <span class="map-pin__label">${p.name}</span>
        <svg class="map-pin__marker" viewBox="0 0 26 36" width="26" height="36" aria-hidden="true">
          <path d="M13 1C6.4 1 1 6.3 1 12.9 1 21.6 13 35 13 35s12-13.4 12-22.1C25 6.3 19.6 1 13 1z"/>
          ${thumb
            ? `<clipPath id="pc-${p.id}"><circle cx="13" cy="13" r="8"/></clipPath><image href="${thumb}" x="5" y="5" width="16" height="16" preserveAspectRatio="xMidYMid slice" clip-path="url(#pc-${p.id})"/>`
            : `<circle cx="13" cy="13" r="4.6" fill="#fff"/>`}
        </svg>
      </span>`;
    // Keep the globe's drag controls from capturing the pointer, so the click reaches the pin
    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener('pointerdown', stop);
    el.addEventListener('mousedown', stop);
    el.addEventListener('touchstart', stop, { passive: true });
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      select(p);
    });
    return el;
  }

  function setRotation(on: boolean) {
    rotating = on;
    if (globe) globe.controls().autoRotate = on;
  }

  function select(p: Place) {
    selected = p;
    lightbox = -1;
    setRotation(false);
    globe?.pointOfView({ lat: p.lat, lng: p.lng, altitude: 0.28 }, 1200);
    document.querySelectorAll('.map-pin').forEach((el) =>
      el.classList.toggle('is-active', (el as HTMLElement).dataset.id === p.id)
    );
  }

  function closePlace() {
    selected = null;
    lightbox = -1;
    document.querySelectorAll('.map-pin.is-active').forEach((el) => el.classList.remove('is-active'));
  }

  function resetView() {
    closePlace();
    globe?.pointOfView(HOME_VIEW, 1000);
    setRotation(true);
  }

  function onKey(e: KeyboardEvent) {
    if (!selected) return;
    if (lightbox >= 0) {
      if (e.key === 'Escape') lightbox = -1;
      else if (e.key === 'ArrowRight') lightbox = (lightbox + 1) % photos.length;
      else if (e.key === 'ArrowLeft') lightbox = (lightbox - 1 + photos.length) % photos.length;
    } else if (e.key === 'Escape') closePlace();
  }

  onMount(async () => {
    try {
      const { default: Globe } = await import('globe.gl');
      await tick();
      if (!container) return;
      globe = new Globe(container, { animateIn: true })
        .globeImageUrl(earthTexture)
        .bumpImageUrl(earthBump)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('#8fb8ff')
        .atmosphereAltitude(0.18)
        .htmlElementsData(places)
        .htmlLat((d: any) => d.lat)
        .htmlLng((d: any) => d.lng)
        .htmlAltitude(0)
        .htmlElement((d: any) => pinElement(d))
        .htmlElementVisibilityModifier((el: HTMLElement, visible: boolean) => {
          el.style.opacity = visible ? '1' : '0';
          el.classList.toggle('is-hidden', !visible);
        })
        .onGlobeClick(() => selected && closePlace())
        .width(container.clientWidth)
        .height(container.clientHeight)
        .pointOfView(HOME_VIEW, 0);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.minDistance = 130;
      controls.maxDistance = 600;
      // stop spinning once the visitor grabs the globe
      controls.addEventListener('start', () => setRotation(false));
      // pins shrink when the globe is far away so nearby cities don't pile up
      const updatePinScale = () => {
        const alt = globe.pointOfView().altitude;
        const scale = Math.max(0.5, Math.min(1, 1.15 - alt * 0.3));
        container.style.setProperty('--pin-scale', scale.toFixed(3));
      };
      controls.addEventListener('change', updatePinScale);
      updatePinScale();

      ro = new ResizeObserver(() => {
        if (container && globe) globe.width(container.clientWidth).height(container.clientHeight);
      });
      ro.observe(container);
      ready = true;
    } catch (e) {
      console.warn('Maps: 3D globe could not start', e);
      loadError = true;
    }
  });

  onDestroy(() => {
    ro?.disconnect();
    try { globe?._destructor(); } catch { /* already gone */ }
  });
</script>

<svelte:window on:keydown={onKey} />

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
    <div class="flex-grow text-center font-semibold">Maps</div>
    <div class="w-14"></div>
  </div>

  <div class="flex flex-1 min-h-0">
    <!-- Sidebar -->
    <aside class="w-64 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col min-h-0">
      <div class="p-3">
        <input
          type="search"
          placeholder="Search places"
          bind:value={query}
          class="w-full rounded-md bg-gray-200/70 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <p class="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {places.length} {places.length === 1 ? 'place' : 'places'}{countries ? ` · ${countries} ${countries === 1 ? 'country' : 'countries'}` : ''}
      </p>
      <div class="flex-1 overflow-y-auto px-2 pb-3">
        {#each groups as g (g.country)}
          <p class="sticky top-0 z-10 bg-gray-50/95 backdrop-blur px-2 pt-3 pb-1 text-xs font-semibold text-gray-500">
            {g.country} <span class="font-normal">· {g.items.length}</span>
          </p>
          <ul class="space-y-0.5">
            {#each g.items as p (p.id)}
              {@const thumb = photosFor(p.id)[0]?.src}
              <li>
                <button
                  class="w-full flex items-center gap-3 rounded-md px-2 py-1.5 text-left {selected?.id === p.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200/70'}"
                  on:click={() => select(p)}
                >
                  {#if thumb}
                    <img src={thumb} alt="" class="w-8 h-8 rounded-md object-cover shrink-0" />
                  {:else}
                    <svg viewBox="0 0 26 36" class="w-4 h-5 shrink-0 {selected?.id === p.id ? 'text-white' : 'text-red-500'}" fill="currentColor" aria-hidden="true">
                      <path d="M13 1C6.4 1 1 6.3 1 12.9 1 21.6 13 35 13 35s12-13.4 12-22.1C25 6.3 19.6 1 13 1z"/>
                      <circle cx="13" cy="13" r="4.6" fill={selected?.id === p.id ? '#3b82f6' : '#fff'}/>
                    </svg>
                  {/if}
                  <span class="min-w-0 text-sm font-medium truncate">{p.name}</span>
                  {#if p.date}<span class="ml-auto text-xs shrink-0 {selected?.id === p.id ? 'text-white/80' : 'text-gray-400'}">{p.date}</span>{/if}
                </button>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="px-3 py-6 text-sm text-gray-500 text-center">{places.length ? 'No matching places' : 'No places added yet'}</p>
        {/each}
      </div>
    </aside>

    <!-- Globe -->
    <section class="relative flex-1 min-w-0 space-bg overflow-hidden">
      <div bind:this={container} class="absolute inset-y-0 left-0 transition-[right] duration-300" style="right:{selected && photos.length ? '21.5rem' : '0px'}"></div>

      {#if !ready && !loadError}
        <div class="absolute inset-0 flex items-center justify-center text-white/70 text-sm pointer-events-none" out:fade={{ duration: 300 }}>
          Loading globe…
        </div>
      {/if}
      {#if loadError}
        <div class="absolute inset-0 flex items-center justify-center p-8 text-center text-white/80 text-sm">
          The 3D globe couldn't start in this browser. Pick a place from the list to see its photos.
        </div>
      {/if}

      <!-- Controls -->
      <div class="absolute top-3 right-3 flex gap-2 z-10">
        <button class="ctrl" on:click={() => setRotation(!rotating)} aria-pressed={rotating} title={rotating ? 'Stop rotating' : 'Rotate'}>
          {#if rotating}
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
          {:else}
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/></svg>
          {/if}
        </button>
        <button class="ctrl" on:click={resetView} title="Show the whole world">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
        </button>
      </div>

      <!-- Place panel -->
      {#if selected && !photos.length}
        <div class="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur rounded-xl shadow-2xl px-4 py-3 flex items-start gap-3 max-w-[18rem]"
             transition:fly={{ y: -10, duration: 180 }}>
          <svg viewBox="0 0 26 36" class="w-5 h-7 mt-0.5 shrink-0 text-red-500" fill="currentColor" aria-hidden="true">
            <path d="M13 1C6.4 1 1 6.3 1 12.9 1 21.6 13 35 13 35s12-13.4 12-22.1C25 6.3 19.6 1 13 1z"/><circle cx="13" cy="13" r="4.6" fill="#fff"/>
          </svg>
          <div class="min-w-0 flex-1">
            <h2 class="text-base font-bold leading-tight">{selected.name}</h2>
            <p class="text-sm text-gray-500">{selected.country}{selected.date ? ` · ${selected.date}` : ''}</p>
            {#if selected.note}<p class="text-sm text-gray-700 mt-1">{selected.note}</p>{/if}
          </div>
          <button class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 shrink-0" on:click={closePlace} aria-label="Close">
            <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
      {/if}

      {#if selected && photos.length}
        <div class="absolute top-3 right-3 bottom-3 w-80 max-w-[calc(100%-1.5rem)] z-20 bg-white/95 backdrop-blur rounded-xl shadow-2xl flex flex-col overflow-hidden"
             transition:fly={{ x: 40, duration: 200 }}>
          <div class="px-4 pt-4 pb-3 border-b border-gray-200 flex items-start gap-2">
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-bold leading-tight">{selected.name}</h2>
              <p class="text-sm text-gray-500">{selected.country}{selected.date ? ` · ${selected.date}` : ''}</p>
            </div>
            <button class="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600" on:click={closePlace} aria-label="Close">
              <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            {#if selected.note}<p class="text-sm text-gray-700 mb-3">{selected.note}</p>{/if}
            {#if photos.length}
              <div class="grid grid-cols-2 gap-2">
                {#each photos as ph, i}
                  <button class="aspect-square rounded-lg overflow-hidden bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" on:click={() => (lightbox = i)}>
                    <img src={ph.src} alt="{selected.name} photo {i + 1}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </button>
                {/each}
              </div>
            {:else}
              <p class="text-sm text-gray-500">No photos for this place yet.</p>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Lightbox -->
      {#if selected && lightbox >= 0 && photos[lightbox]}
        <div class="absolute inset-0 z-30 bg-black/90 flex items-center justify-center" transition:fade={{ duration: 150 }}
             on:click|self={() => (lightbox = -1)} role="dialog" aria-label="Photo viewer">
          <img src={photos[lightbox].src} alt="{selected.name} photo {lightbox + 1}" class="max-w-[85%] max-h-[85%] object-contain rounded-md shadow-2xl" />
          <button class="lb-btn left-3" on:click={() => (lightbox = (lightbox - 1 + photos.length) % photos.length)} aria-label="Previous photo">‹</button>
          <button class="lb-btn right-3" on:click={() => (lightbox = (lightbox + 1) % photos.length)} aria-label="Next photo">›</button>
          <button class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center" on:click={() => (lightbox = -1)} aria-label="Close photo">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
          <p class="absolute bottom-3 left-0 right-0 text-center text-sm text-white/80">
            {selected.name} · {lightbox + 1} / {photos.length}
          </p>
        </div>
      {/if}
    </section>
  </div>
</div>

<style>
  .space-bg {
    background: radial-gradient(ellipse at 50% 45%, #1b2a4a 0%, #0b1224 55%, #05070f 100%);
  }
  .ctrl {
    width: 34px;
    height: 34px;
    border-radius: 9999px;
    background: rgb(255 255 255 / 0.15);
    border: 1px solid rgb(255 255 255 / 0.25);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
  }
  .ctrl:hover { background: rgb(255 255 255 / 0.25); }
  .lb-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    background: rgb(255 255 255 / 0.15);
    color: white;
    font-size: 28px;
    line-height: 1;
  }
  .lb-btn:hover { background: rgb(255 255 255 / 0.3); }

  /* pins are created by the globe library, outside this component.
     The library centres each element on its location, so the marker is
     shifted up by half its height to put the tip on the spot. */
  :global(.map-pin) {
    position: relative;
    width: 26px;
    height: 36px;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    transition: opacity 0.25s;
    /* only the visible marker shape is clickable, so shrunken pins don't cover their neighbours */
    pointer-events: none;
  }
  :global(.map-pin__marker) { pointer-events: visiblePainted; }
  :global(.map-pin.is-hidden .map-pin__marker) { pointer-events: none; }
  :global(.map-pin__inner) {
    position: absolute;
    inset: 0;
    transform: translateY(-50%);
  }
  /* the label is positioned from the marker's tip */
  :global(.map-pin__label) { top: auto; }
  :global(.map-pin__marker) {
    display: block;
    filter: drop-shadow(0 2px 3px rgb(0 0 0 / 0.55));
    transform-origin: 50% 100%;
    transform: scale(var(--pin-scale, 1));
    transition: transform 0.15s;
  }
  :global(.map-pin__marker path) { fill: #ef4444; stroke: #fff; stroke-width: 1.5; }
  :global(.map-pin__label) {
    position: absolute;
    bottom: calc(36px * var(--pin-scale, 1) + 4px);
    left: 50%;
    transform: translateX(-50%);
    padding: 1px 6px;
    border-radius: 4px;
    background: rgb(0 0 0 / 0.7);
    color: white;
    font: 500 11px/1.4 -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s;
  }
  :global(.map-pin:hover .map-pin__marker), :global(.map-pin.is-active .map-pin__marker) { transform: scale(calc(var(--pin-scale, 1) * 1.3)); }
  :global(.map-pin:hover .map-pin__label), :global(.map-pin.is-active .map-pin__label) { opacity: 1; }
  :global(.map-pin.is-active .map-pin__marker path) { fill: #2563eb; }
  :global(.map-pin:hover) { z-index: 1000 !important; }
</style>
