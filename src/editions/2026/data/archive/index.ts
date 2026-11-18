import type { ArchiveEdition, ArchiveLink } from "./types";
import { youTubeWatchUrl } from "./types";
import { edition2026 } from "./2026";
import { edition2025 } from "./2025";
import { edition2024 } from "./2024";

export type { ArchiveEdition, ArchiveLink } from "./types";

/** Every archived edition, newest first. Each gets a page at /<year>/ and
 * appears in the nav, footer and other years' "past editions" section. */
export const archiveEditions: ArchiveEdition[] = [
  edition2026,
  edition2025,
  edition2024,
];

export const archiveHref = (edition: ArchiveEdition) => `/${edition.year}/`;
export const watchHref = (edition: ArchiveEdition) =>
  youTubeWatchUrl(edition.livestream.videoId);

/** The three link cards shown for an edition in "past editions". */
export const editionLinks = (edition: ArchiveEdition): ArchiveLink[] => [
  { title: "Visit the archive", href: archiveHref(edition) },
  { title: "Watch the event", href: watchHref(edition) },
  { title: "Read the recap", href: edition.card.recapHref },
];
