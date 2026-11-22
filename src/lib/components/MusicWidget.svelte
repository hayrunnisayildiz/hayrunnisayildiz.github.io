<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { site } from '$lib/config';
  import { youtube, loadYouTubeApi } from '$lib/utils/youtube';

  const { title, artist, album } = site.music;

  let host: HTMLDivElement;
  let player: any;
  let isPlaying = false;
  let apiFailed = false;
  let coverFailed = false;

  // YouTube's IFrame API reports play/pause, so the record can spin with the music.
  // If the API can't load, a plain embed is shown instead.
  onMount(() => {
    let cancelled = false;
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !host) return;
        player = new YT.Player(host, {
          videoId: youtube.id,
          host: 'https://www.youtube-nocookie.com',
          width: '100%',
          height: '100%',
          playerVars: { rel: 0, playsinline: 1, loop: 1, playlist: youtube.id, modestbranding: 1 },
          events: {
            onStateChange: (e: any) => (isPlaying = e.data === YT.PlayerState.PLAYING),
            onError: () => (isPlaying = false),
          },
        });
      })
      .catch(() => {
        if (!cancelled) apiFailed = true;
      });
    return () => (cancelled = true);
  });

  onDestroy(() => player?.destroy?.());

  function togglePlay() {
    if (!player?.getPlayerState) return;
    isPlaying ? player.pauseVideo() : player.playVideo();
  }
</script>

<div class="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white w-full max-w-md">
  <div class="flex justify-between items-center mb-5">
    <h2 class="text-xl font-semibold">Now Playing</h2>
    <a
      href={youtube.watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 transition-colors"
    >
      Watch on YouTube
    </a>
  </div>

  <div class="flex items-center gap-5 mb-5">
    <button
      type="button"
      class="relative shrink-0 w-28 h-28 rounded-full shadow-xl ring-4 ring-black/30 overflow-hidden focus:outline-none"
      on:click={togglePlay}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {#if coverFailed}
        <div class="w-full h-full disc vinyl" class:spinning={isPlaying}></div>
      {:else}
        <!-- video thumbnail, cropped to the centre so it fills the record -->
        <img
          src={youtube.coverUrl}
          alt="{artist} — {title}"
          class="w-full h-full object-cover scale-[1.35] disc text-transparent bg-neutral-900"
          class:spinning={isPlaying}
          on:error={() => (coverFailed = true)}
        />
      {/if}
      <span class="absolute inset-0 m-auto w-5 h-5 rounded-full bg-black/80 ring-2 ring-white/40"></span>
    </button>

    <div class="min-w-0">
      <p class="text-2xl font-bold leading-tight truncate">{title}</p>
      <p class="text-white/80">{artist}</p>
      <p class="text-xs text-white/60 truncate">{album}</p>
      <div class="flex items-end gap-[3px] h-4 mt-2" aria-hidden="true">
        {#each [0, 1, 2, 3, 4] as i}
          <span class="w-1 bg-white/80 rounded-sm bar" class:playing={isPlaying} style="animation-delay: {i * 0.15}s"></span>
        {/each}
      </div>
    </div>
  </div>

  <!-- YouTube player (must stay visible, at least 200px tall) -->
  <div class="rounded-xl overflow-hidden bg-black/40 aspect-video min-h-[200px]">
    {#if apiFailed}
      <iframe
        title="{artist} — {title} on YouTube"
        src={youtube.embedUrl}
        class="w-full h-full"
        frameborder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
        loading="lazy"
      ></iframe>
    {:else}
      <div bind:this={host} class="w-full h-full"></div>
    {/if}
  </div>
</div>

<style>
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .disc { animation: spin 8s linear infinite; animation-play-state: paused; }
  .disc.spinning { animation-play-state: running; }
  /* keep the zoom while spinning */
  img.disc { animation-name: spin-zoom; }
  @keyframes spin-zoom {
    from { transform: scale(1.35) rotate(0deg); }
    to { transform: scale(1.35) rotate(360deg); }
  }

  @keyframes wave {
    0%, 100% { height: 25%; }
    50% { height: 100%; }
  }
  .bar { height: 25%; }
  .bar.playing { animation: wave 1s ease-in-out infinite; }
  .vinyl {
    background: repeating-radial-gradient(circle at center, #111 0 2px, #1d1d1d 2px 4px), #111;
  }
</style>
