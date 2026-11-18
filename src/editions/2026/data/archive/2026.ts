import type { ArchiveEdition, GalleryPhoto } from "./types";
import { acts } from "./2026-chapters";
import { speakers } from "./2026-speakers";
import hero from "../../assets/archive/2026/hero.webp";
import poster from "../../assets/images/sotoh-highlights-placeholder.webp";
import card from "../../assets/images/what-is-state-of-the-open-home.webp";

// Gallery photos in the order used in Figma.
const photos = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/archive/2026/gallery/*.webp",
  { eager: true },
);
const photo = (name: string, alt: string, orientation: GalleryPhoto["orientation"]): GalleryPhoto => {
  const match = photos[`../../assets/archive/2026/gallery/${name}.webp`];
  if (!match) throw new Error(`Gallery photo not found: ${name}`);
  return { image: match.default, alt, orientation };
};

export const edition2026: ArchiveEdition = {
  year: 2026,
  description:
    "Relive State of the Open Home 2026 in Utrecht: watch the full livestream chapter by chapter, meet the speakers, and see photos from our first in-person event since 2019.",
  hero: {
    image: hero,
    alt: "A packed auditorium raising their hands towards the stage at State of the Open Home 2026",
    paragraphs: [
      "There was a big change to State of the Open Home this year, as we welcomed a live audience for the first time since 2019! And the buzz it created showed why meeting in person is so important.",
      "This year’s theme was all about building in the open, with a program that didn’t just show you how we work, but invited you to help build what’s next…",
    ],
  },
  showTicket: true,
  showFeedback: true,
  livestream: {
    videoId: "XyAL1to3Lm4",
    poster,
    acts,
    defaultOpenAct: 1, // the act the main program starts in, as in the design
  },
  speakers: {
    intro:
      "Some fresh faces joined familiar names from the foundation to share how we’re building in the open together.",
    cards: speakers,
  },
  gallery: {
    intro:
      "Turns out building in the open is a lot more fun when you do it together! From the action on stage to lively chat over food and drinks, the venue was alive with good vibes and passion for our projects.",
    rows: [
      [
        photo("crowd-green-booth", "A packed foyer of attendees chatting next to the Home Assistant Green stand", "landscape"),
        photo("sliders-served", "Attendees helping themselves to sliders from a serving board", "landscape"),
        photo("foyer-conversation", "Two attendees deep in conversation in the busy foyer", "portrait"),
        photo("drinks-and-laughs", "A group sharing a laugh over drinks", "landscape"),
        photo("foyer-conversation", "Two attendees deep in conversation in the busy foyer", "portrait"),
        photo("green-booth-chat", "Attendees talking in front of the Home Assistant Green banner", "landscape"),
      ],
      [
        photo("lounge-break", "Attendees relaxing on lounge seating with food", "landscape"),
        photo("packed-foyer", "A crowded foyer before the show", "landscape"),
        photo("backpack-hello", "Friends greeting each other among the plants in the foyer", "portrait"),
        photo("pasta-bowls", "Bowls of pasta lined up at the food counter", "portrait"),
        photo("foyer-from-above", "The foyer seen from above, full of attendees and demo stands", "portrait"),
        photo("swapping-cards", "Attendees swapping stickers and cards", "landscape"),
      ],
    ],
  },
  keepExploring: [
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
  ],
  card: {
    image: card,
    alt: "The audience watching the stage at State of the Open Home 2026 in Utrecht",
    recapHref:
      "https://www.openhomefoundation.org/blog/building-whats-next-state-of-the-open-home-2026/",
  },
};
