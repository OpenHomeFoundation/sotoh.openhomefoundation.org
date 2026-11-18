import { edition2026 } from "./archive/2026";
import { archiveEditions, archiveHref, watchHref } from "./archive";

export interface NavLink {
  label: string;
  /** null = destination doesn't exist yet; rendered as a disabled link. */
  href: string | null;
}

export interface NavGroup {
  label: string;
  /** Optional: groups without a href render their label as a plain heading. */
  href?: string;
  items: NavLink[];
}

export const LIVESTREAM_URL = watchHref(edition2026);

export const homeNav: NavGroup = {
  label: "Home",
  href: "/",
  items: [
    { label: "What is State of the Open Home?", href: "/#what-is-state-of-the-open-home" },
    { label: "Why we’re building in the open", href: "/#building-in-the-open" },
    { label: "Be part of the conversation", href: "/#the-conversation-continues" },
  ],
};

export const archiveNav: NavGroup = {
  label: "Archive",
  items: archiveEditions.map((edition) => ({
    label: String(edition.year),
    href: archiveHref(edition),
  })),
};

export const siteNav: NavGroup[] = [homeNav, archiveNav];

export const socialLinks: NavLink[] = [
  { label: "Mastodon", href: "https://fosstodon.org/@openhomefoundation" },
  { label: "Bluesky", href: "https://bsky.app/profile/openhomefoundation.org" },
  { label: "Instagram", href: "https://www.instagram.com/openhomefoundation/" },
  { label: "Facebook", href: "https://www.facebook.com/p/Open-Home-Foundation-61558575472603/" },
];
