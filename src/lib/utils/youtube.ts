import { site } from '$lib/config';

const id = site.music.youtubeId;

export const youtube = {
  id,
  watchUrl: `https://www.youtube.com/watch?v=${id}`,
  // Thumbnail of the video (album artwork for most music uploads)
  coverUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  // Plain embed (used on mobile and as a fallback); loop=1 needs playlist=<id>
  embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1&loop=1&playlist=${id}`,
};

let apiPromise: Promise<any> | null = null;

/** Loads YouTube's IFrame Player API once and resolves with window.YT. */
export function loadYouTubeApi(timeoutMs = 8000): Promise<any> {
  const w = window as any;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(w.YT);
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = () => reject(new Error('YouTube API failed to load'));
    document.head.appendChild(s);
    setTimeout(() => reject(new Error('YouTube API timed out')), timeoutMs);
  });
  apiPromise.catch(() => (apiPromise = null));
  return apiPromise;
}
