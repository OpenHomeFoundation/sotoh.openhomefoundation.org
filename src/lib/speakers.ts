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
    role: "President of the OHF",
    image: getImage("paulus.webp"),
    variant: 1,
    theme: "dark",
  },
  {
    firstName: "Franck",
    lastName: "Nijhof",
    role: "Lead of Home Assistant",
    image: getImage("franck.webp"),
    variant: 2,
    theme: "dark",
  },
  {
    firstName: "Jean-Loïc",
    lastName: "Pouffier",
    role: "Lead of Product & UX",
    image: getImage("jlo.webp"),
    variant: 3,
    theme: "dark",
  },
  {
    firstName: "Marcel",
    lastName: "van der Veldt",
    role: "Lead of Ecosystem",
    image: getImage("marcel.webp"),
    variant: 4,
    theme: "light",
  },
  {
    firstName: "TBC",
    lastName: "tbc",
    role: "TBC",
    image: "",
    variant: 5,
    theme: "dark",
  },
  {
    firstName: "Carl",
    lastName: "Olof Albertsson",
    role: "VP of commercial at Nabu Casa",
    image: getImage("carl.webp"),
    variant: 6,
    theme: "light",
  },
  {
    firstName: "Trevor",
    lastName: "Schirmer",
    role: "Technical Lead at Apollo",
    image: getImage("trevor.webp"),
    variant: 7,
    theme: "light",
  },
  {
    firstName: "Laura",
    lastName: "Palombi",
    role: "Product Manager at OHf",
    image: getImage("laura.webp"),
    variant: 8,
    theme: "dark",
  },
  {
    firstName: "Matthias",
    lastName: "de Baat",
    role: "UX Designer at OHf",
    image: getImage("matthias.webp"),
    variant: 8,
    theme: "dark",
  },
];
