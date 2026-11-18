import type { GalleryPhoto } from "./types";

type Glob = Record<string, { default: ImageMetadata }>;

/**
 * Turn every photo in a year's gallery folder into two marquee rows,
 * alternating between them in filename order (prefix names with 01-, 02-, …
 * to control the order). Orientation comes from each photo's dimensions.
 */
export function rowsFromFolder(photos: Glob, year: number): GalleryPhoto[][] {
  const rows: GalleryPhoto[][] = [[], []];
  Object.keys(photos)
    .sort()
    .forEach((path, i) => {
      const image = photos[path].default;
      rows[i % 2].push({
        image,
        alt: `Photo from State of the Open Home ${year}`,
        orientation: image.width >= image.height ? "landscape" : "portrait",
      });
    });
  return rows;
}
