// Define type for agenda items
interface AgendaItem {
  title: string;
  speakers?: string[];
  segments?: AgendaItem[];
}

export const agenda: { time: string; items: AgendaItem[] }[] = [
  {
    time: "18:00 - 19:30",
    items: [
      {
        title: "Meet and greet and casual dinner",
      },
    ],
  },
  {
    time: "19:00",
    items: [
      {
        title: "Online livestream begins",
      },
    ],
  },
  {
    time: "19:30 - 21:30",
    items: [
      {
        title: "Why building in the open matters",
        speakers: ["Paulus Schoutsen", "Melissa Thermidor", "Missy Quarry"],
      },
      {
        title: "How we build in the open",
        segments: [
          {
            title: "With Home Assistant Labs",
            speakers: ["Franck Nijhof", "Jean-Loïc Pouffier"],
          },
          {
            title: "With Sendspin",
            speakers: ["Kevin Ahrendt", "Marcel van der Veldt"],
          },
          {
            title: "With partners",
            speakers: ["Carl Olof Albertsson", "Trevor Schirmer"],
          },
        ],
      },
      {
        title: "Be part of what we build next",
        speakers: [
          "Matthias de Baat",
          "Franck Nijhof",
          "Laura Palombi",
          "Jean-Loïc Pouffier",
        ],
      },
    ],
  },
  {
    time: "21:30 - 22:30",
    items: [
      {
        title: "Networking and drinks",
      },
    ],
  },
];
