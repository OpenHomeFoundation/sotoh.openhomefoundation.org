import type { ArchiveEdition } from "./types";
import { acts } from "./2024-chapters";
import { rowsFromFolder } from "./gallery-folder";
import hero from "../../assets/archive/2024/hero.webp";
import poster from "../../assets/archive/2024/poster.webp";

// Drop photos into assets/archive/2024/gallery/ and they appear in the gallery.
const galleryPhotos = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/archive/2024/gallery/*.{webp,jpg,jpeg,png}",
  { eager: true },
);

const RECAP = "https://www.home-assistant.io/blog/2024/04/24/state-of-the-open-home-2024/";

export const edition2024: ArchiveEdition = {
  year: 2024,
  description:
    "Relive State of the Open Home 2024: watch the full livestream chapter by chapter, including the launch of the Open Home Foundation.",
  hero: {
    image: hero,
    alt: "The State of the Open Home 2024 studio set during the broadcast",
    paragraphs: [
      "State of the Open Home 2024 was the night we unveiled the Open Home Foundation: a new non-profit created to fight for privacy, choice, and sustainability in the smart home.",
      "Streamed live on April 20, it brought together the people behind Home Assistant, WLED, Zigbee2MQTT, Rhasspy and Z-Wave JS, celebrated an estimated 1 million Home Assistant installations, and shared a roadmap full of new features.",
    ],
  },
  livestream: {
    videoId: "oa__fLArsFk",
    poster,
    acts,
    defaultOpenAct: 0,
  },
  speakers: {
    intro: "The people who took to the stage to share what we’d been building.",
    photos: [], // TODO: picture-only speaker cards
  },
  gallery: {
    intro: "A look back at State of the Open Home 2024, on and behind the scenes.",
    rows: rowsFromFolder(galleryPhotos, 2024),
  },
  keepExploring: [
    {
      title: "Read the recap",
      description: "“Thinking Bigger”: the full write-up of the event on the Home Assistant blog.",
      href: RECAP,
    },
    {
      title: "Explore the roadmap",
      description: "See what we’re working on now, and tell us what is missing.",
      href: "https://github.com/orgs/OpenHomeFoundation/projects/8",
    },
    {
      title: "Catch the newsletter",
      description: "“Announcing the Open Home Foundation”: the newsletter sent the day after the event.",
      href: "https://newsletter.openhomefoundation.org/announcing-the-open-home-foundation/",
    },
  ],
  card: {
    image: hero,
    alt: "The State of the Open Home 2024 studio set during the broadcast",
    recapHref: RECAP,
  },
};
