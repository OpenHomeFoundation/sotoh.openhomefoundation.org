// Shape of one archived State of the Open Home edition. Each year's data file
// exports one of these; src/pages/[year]/index.astro renders it with the
// 2026 archive template.

export interface Session {
  time: string;
  title: string;
  speakers?: string[];
  summary?: string;
}

export interface Act {
  title: string;
  summary: string;
  sessions: Session[];
}

export interface ArchiveLink {
  title: string;
  description?: string;
  /** null = URL still outstanding; LinkCard renders it disabled + warns at build. */
  href: string | null;
}

export interface GalleryPhoto {
  image: ImageMetadata;
  alt: string;
  orientation: "landscape" | "portrait";
}

/** The illustrated 2026-style speaker card. */
export interface Speaker {
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  image: ImageMetadata;
  variant: number;
  theme: "light" | "dark";
}

/** A pre-designed, picture-only speaker card (used for 2024/2025). */
export interface SpeakerPhoto {
  image: ImageMetadata;
  /** Accessible name, e.g. "Paulus Schoutsen, President, Open Home Foundation". */
  name: string;
}

export interface ArchiveEdition {
  year: number;
  /** <meta name="description"> for the page. */
  description: string;
  hero: {
    image: ImageMetadata;
    alt: string;
    paragraphs: string[];
    /** Focal point when cropped on desktop. Defaults to "center". */
    objectPosition?: string;
  };
  /** Show the holo ticket (2026 was the in-person edition with tickets). */
  showTicket?: boolean;
  /** Link to that year's post-event feedback survey in the closing section. */
  showFeedback?: boolean;
  livestream: {
    videoId: string;
    poster: ImageMetadata;
    /** Chapters beside the video. Without them the video is shown on its own. */
    acts?: Act[];
    /** Index of the act that starts open. */
    defaultOpenAct?: number;
  };
  speakers: {
    intro: string;
    /** Illustrated cards (2026). */
    cards?: Speaker[];
    /** Picture-only cards. Empty → placeholder cards + build warning. */
    photos?: SpeakerPhoto[];
  };
  gallery: {
    intro: string;
    /** Two rows that scroll in opposite directions. Empty → placeholder. */
    rows: GalleryPhoto[][];
  };
  keepExploring: ArchiveLink[];
  /** How this year appears in other years' "past editions" section. */
  card: {
    image: ImageMetadata;
    alt: string;
    recapHref: string;
  };
}

export const youTubeWatchUrl = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`;
