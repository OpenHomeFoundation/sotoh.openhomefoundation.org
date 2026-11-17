import type { ArchiveEdition } from "./types";
import { acts } from "./2025-chapters";
import { rowsFromFolder } from "./gallery-folder";
import hero from "../../assets/archive/2025/hero.webp";
import poster from "../../assets/archive/2025/poster.webp";

// Drop photos into assets/archive/2025/gallery/ and they appear in the gallery.
const galleryPhotos = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/archive/2025/gallery/*.{webp,jpg,jpeg,png}",
  { eager: true },
);

const RECAP = "https://www.home-assistant.io/blog/2025/04/16/state-of-the-open-home-recap/";

export const edition2025: ArchiveEdition = {
  year: 2025,
  description:
    "Relive State of the Open Home 2025: watch the full livestream chapter by chapter as we look back on the Open Home Foundation’s first year and set out the 2025 roadmap.",
  hero: {
    image: hero,
    alt: "The State of the Open Home 2025 presenters together on the studio set",
    paragraphs: [
      "A year after the Open Home Foundation was founded, State of the Open Home 2025 looked back on a very big year: Home Assistant doubled to more than 2 million households, and Music Assistant and HACS became Foundation projects.",
      "Streamed live on April 12, the program celebrated our community, shared what’s next for the Works with Home Assistant program, and set out the 2025 roadmap, including plans for a new device database.",
    ],
  },
  livestream: {
    videoId: "o4Vctz1_KYE",
    poster,
    acts,
    defaultOpenAct: 1,
  },
  speakers: {
    intro: "The people who took to the stage to share what we’d been building.",
    photos: [], // TODO: picture-only speaker cards
  },
  gallery: {
    intro: "A look back at State of the Open Home 2025, on and behind the scenes.",
    rows: rowsFromFolder(galleryPhotos, 2025),
  },
  keepExploring: [
    {
      title: "Read the recap",
      description: "Paulus Schoutsen’s write-up, “2 million homes strong”, on the Home Assistant blog.",
      href: RECAP,
    },
    {
      title: "Explore the roadmap",
      description: "See what we’re working on now, and tell us what is missing.",
      href: "https://github.com/orgs/OpenHomeFoundation/projects/8",
    },
    {
      title: "Catch the newsletter",
      description: "“Big first year, bigger second”: a look back at the event, from the Open Home Foundation newsletter.",
      href: "https://newsletter.openhomefoundation.org/big-first-year-bigger-second/",
    },
  ],
  card: {
    image: hero,
    alt: "The State of the Open Home 2025 presenters together on the studio set",
    recapHref: RECAP,
  },
};
