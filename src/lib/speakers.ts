const speakerImages = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/speakers/*.{webp,png,jpg,jpeg}",
  { eager: true },
);

function getImage(filename: string): ImageMetadata {
  const path = `../assets/speakers/${filename}`;
  const match = speakerImages[path];
  if (!match) throw new Error(`Speaker image not found: ${path}`);
  return match.default;
}

export const speakers = [
  {
    firstName: "Paulus",
    lastName: "Schoutsen",
    role: "President",
    company: "Open Home Foundation",
    image: getImage("paulus.webp"),
    variant: 1,
    theme: "light",
  },
  {
    firstName: "Franck",
    lastName: "Nijhof",
    role: "Lead of Home Assistant",
    company: "Open Home Foundation",
    image: getImage("franck.webp"),
    variant: 2,
    theme: "dark",
  },
  {
    firstName: "Jean-Loïc",
    lastName: "Pouffier",
    role: "Lead of Product & UX",
    company: "Open Home Foundation",
    image: getImage("jlo.webp"),
    variant: 3,
    theme: "dark",
  },
  {
    firstName: "Marcel",
    lastName: "van der Veldt",
    role: "Lead of Ecosystem",
    company: "Open Home Foundation",
    image: getImage("marcel.webp"),
    variant: 4,
    theme: "light",
  },
  {
    firstName: "Kevin",
    lastName: "Ahrendt",
    role: "Software Engineer",
    company: "Open Home Foundation",
    image: getImage("kevin.webp"),
    variant: 5,
    theme: "light",
  },
  {
    firstName: "Carl",
    lastName: "Olof Albertsson",
    role: "VP of Commercial",
    company: "Nabu Casa",
    image: getImage("carl.webp"),
    variant: 6,
    theme: "light",
  },
  {
    firstName: "Trevor",
    lastName: "Schirmer",
    role: "Technical Lead",
    company: "Apollo Automation",
    image: getImage("trevor.webp"),
    variant: 7,
    theme: "light",
  },
  {
    firstName: "Laura",
    lastName: "Palombi",
    role: "Product Manager",
    company: "Open Home Foundation",
    image: getImage("paulus.webp"),
    variant: 8,
    theme: "dark",
  },
  {
    firstName: "Matthias",
    lastName: "de Baat",
    role: "UX Designer",
    company: "Open Home Foundation",
    image: getImage("matthias.webp"),
    variant: 9,
    theme: "dark",
  },
  {
    firstName: "Missy",
    lastName: "Quarry",
    role: "Community Manager",
    company: "Open Home Foundation",
    image: getImage("missy.webp"),
    variant: 10,
    theme: "dark",
  },
  {
    firstName: "Melissa",
    lastName: "Thermidor",
    role: "Community Lead",
    company: "Open Home Foundation",
    image: getImage("paulus.webp"),
    variant: 11,
    theme: "light",
  },
];
