import edition2025 from "../assets/archive/edition-2025.webp";
import edition2024 from "../assets/archive/edition-2024.webp";

export interface ArchiveLink {
  title: string;
  description?: string;
  /** null = URL still outstanding; LinkCard renders it disabled + warns at build. */
  href: string | null;
}

export const keepExploring: ArchiveLink[] = [
  {
    title: "Read the recap",
    description:
      "Paulus Schoutsen’s write-up of the evening on the Open Home Foundation blog.",
    href: "https://www.openhomefoundation.org/blog/building-whats-next-state-of-the-open-home-2026/",
  },
  {
    title: "Explore the roadmap",
    description:
      "The public roadmap shown on stage. Open the cards and tell us what is missing.",
    href: "https://github.com/orgs/OpenHomeFoundation/projects/8",
  },
  {
    title: "Discover Sendspin",
    description:
      "The open protocol for synchronized, multi-room music that Kevin and Marcel presented.",
    href: "https://www.sendspin-audio.com/",
  },
  {
    title: "Catch the newsletter",
    description:
      "A look back at the event, from the Open Home Foundation newsletter.",
    href: "https://newsletter.openhomefoundation.org/building-an-open-future-for-everyone/",
  },
];

export interface PastEdition {
  year: number;
  image: ImageMetadata;
  imageAlt: string;
  /** This edition's archive page. Also feeds the site nav's "Archive" menu.
   * null = page doesn't exist yet (rendered as a disabled link + build warning). */
  archiveHref: string | null;
  rewatchHref: string;
  recapHref: string;
}

export const pastEditions: PastEdition[] = [
  {
    year: 2025,
    image: edition2025,
    imageAlt:
      "The State of the Open Home 2025 presenters together on the studio set",
    archiveHref: null, // TODO: add when a 2025 archive page exists
    rewatchHref: "https://www.youtube.com/watch?v=o4Vctz1_KYE",
    recapHref:
      "https://www.home-assistant.io/blog/2025/04/16/state-of-the-open-home-recap/",
  },
  {
    year: 2024,
    image: edition2024,
    imageAlt: "The State of the Open Home 2024 studio set during the broadcast",
    archiveHref: null, // TODO: add when a 2024 archive page exists
    rewatchHref: "https://www.youtube.com/watch?v=oa__fLArsFk",
    recapHref:
      "https://www.home-assistant.io/blog/2024/04/24/state-of-the-open-home-2024/",
  },
];

/** The three link cards shown for a past edition. */
export const pastEditionLinks = (edition: PastEdition): ArchiveLink[] => [
  { title: "Visit the archive", href: edition.archiveHref },
  { title: "Rewatch the event", href: edition.rewatchHref },
  { title: "Read the recap", href: edition.recapHref },
];
