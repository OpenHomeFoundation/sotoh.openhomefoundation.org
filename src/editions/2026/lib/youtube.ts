// Minimal typings for the parts of the YouTube IFrame API we use.
export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
}

interface YTNamespace {
  Player: new (
    el: HTMLIFrameElement,
    options?: { events?: Record<string, (e: { data: number }) => void> },
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | undefined;

/** Load the YouTube IFrame API once, however many players are on the page. */
export function loadYouTubeAPI(): Promise<YTNamespace> {
  apiPromise ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

export function youTubeEmbedUrl(
  videoId: string,
  params: Record<string, string | number> = {},
): string {
  const query = new URLSearchParams(
    Object.entries({ rel: 0, enablejsapi: 1, ...params }).map(([k, v]) => [
      k,
      String(v),
    ]),
  );
  return `https://www.youtube.com/embed/${videoId}?${query}`;
}

/** "1:02:03" | "29:46" → seconds */
export function timestampToSeconds(timestamp: string): number {
  return timestamp
    .split(":")
    .reduce((total, part) => total * 60 + Number(part), 0);
}
