// "Where the magic happens" photo rows, in the order used in Figma.
const photos = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/archive/gallery/*.webp",
  { eager: true },
);

function photo(name: string): ImageMetadata {
  const match = photos[`../assets/archive/gallery/${name}.webp`];
  if (!match) throw new Error(`Gallery photo not found: ${name}`);
  return match.default;
}

export interface GalleryPhoto {
  image: ImageMetadata;
  alt: string;
  orientation: "landscape" | "portrait";
}

export const galleryRows: GalleryPhoto[][] = [
  [
    { image: photo("crowd-green-booth"), alt: "A packed foyer of attendees chatting next to the Home Assistant Green stand", orientation: "landscape" },
    { image: photo("sliders-served"), alt: "Attendees helping themselves to sliders from a serving board", orientation: "landscape" },
    { image: photo("foyer-conversation"), alt: "Two attendees deep in conversation in the busy foyer", orientation: "portrait" },
    { image: photo("drinks-and-laughs"), alt: "A group sharing a laugh over drinks", orientation: "landscape" },
    { image: photo("foyer-conversation"), alt: "Two attendees deep in conversation in the busy foyer", orientation: "portrait" },
    { image: photo("green-booth-chat"), alt: "Attendees talking in front of the Home Assistant Green banner", orientation: "landscape" },
  ],
  [
    { image: photo("lounge-break"), alt: "Attendees relaxing on lounge seating with food", orientation: "landscape" },
    { image: photo("packed-foyer"), alt: "A crowded foyer before the show", orientation: "landscape" },
    { image: photo("backpack-hello"), alt: "Friends greeting each other among the plants in the foyer", orientation: "portrait" },
    { image: photo("pasta-bowls"), alt: "Bowls of pasta lined up at the food counter", orientation: "portrait" },
    { image: photo("foyer-from-above"), alt: "The foyer seen from above, full of attendees and demo stands", orientation: "portrait" },
    { image: photo("swapping-cards"), alt: "Attendees swapping stickers and cards", orientation: "landscape" },
  ],
];
