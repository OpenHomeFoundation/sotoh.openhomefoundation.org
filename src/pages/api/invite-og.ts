import type { APIRoute } from "astro";

export const prerender = false;

const IMAGES = [
  "/sotoh-share-attending-1.webp",
  "/sotoh-share-attending-2.webp",
  "/sotoh-share-attending-3.webp",
  "/sotoh-share-attending-4.webp",
  "/sotoh-share-attending-5.webp",
  "/sotoh-share-attending-6.webp",
  "/sotoh-share-attending-7.webp",
  "/sotoh-share-attending-8.webp",
];

export const GET: APIRoute = ({ request }) => {
  const randomIndex = Math.floor(Math.random() * IMAGES.length);
  const selectedImage = IMAGES[randomIndex];
  const origin = new URL(request.url).origin;
  const imageUrl = `${origin}${selectedImage}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: imageUrl,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
};
