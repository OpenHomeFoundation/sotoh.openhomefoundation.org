// Livestream chapters for State of the Open Home 2026.
// Source: Figma "The program, chapter by chapter". Timestamps are positions
// in the full livestream.

import type { Act } from "./types";

export const acts: Act[] = [
  {
    title: "Pre-show",
    summary: "The stream opens before the main program begins.",
    sessions: [
      { time: "0:00", title: "Livestream start" },
      { time: "2:11", title: "Interview: Ed" },
      { time: "11:49", title: "Interview: Rens" },
      { time: "21:46", title: "Interview: Mick" },
    ],
  },
  {
    title: "Why building in the open matters",
    summary:
      "The opening act: the theme, and the people who will grow the community.",
    sessions: [
      { time: "29:46", title: "Program starts" },
      { time: "30:41", title: "Opening", speakers: ["Missy Quarry"] },
      {
        time: "33:20",
        title: "Why building in the open matters",
        speakers: ["Paulus Schoutsen"],
        summary:
          "The theme is more than a slogan: it is an invitation to help shape smart homes alongside the people who use them.",
      },
      {
        time: "37:23",
        title: "Introducing the Community department",
        speakers: ["Melissa Thermidor", "Missy Quarry"],
        summary:
          "The first thing shared was not a product but people: a new Community department led by Melissa Thermidor, focused on growing the community, not just maintaining it.",
      },
    ],
  },
  {
    title: "How we build in the open",
    summary:
      "Three examples of what building in the open looks like in practice.",
    sessions: [
      {
        time: "39:49",
        title: "Building in the open isn’t (always) easy",
        speakers: ["Franck Nijhof", "JLo"],
        summary:
          "Working in public takes vulnerability and coordination that closed-door teams rarely face. Franck and JLo talk about what that means day to day.",
      },
      {
        time: "46:50",
        title: "Home Assistant Labs",
        speakers: ["Franck Nijhof", "JLo"],
        summary:
          "An invitation to break, test, and influence ideas while they are still being shaped, with real-world feedback steering the design.",
      },
      { time: "57:51", title: "Easter egg reveal", speakers: ["Missy Quarry"] },
      {
        time: "1:01:12",
        title: "Sendspin protocol",
        speakers: ["Melissa Thermidor", "Kevin Ahrendt", "Marcel van der Veldt"],
        summary:
          "Opening up a new protocol while it is still evolving, with music demos along the way.",
      },
      {
        time: "1:18:34",
        title: "How we build in the open with partners",
        speakers: ["Missy Quarry", "Carl Olof Albertsson", "Trevor Schirmer"],
        summary:
          "Making it easier to find hardware you can trust, and giving people more choice.",
      },
      {
        time: "1:22:56",
        title: "ESPHome Starter Kit",
        speakers: ["Trevor Schirmer"],
        summary: "Apollo Automation presents the ESPHome Starter Kit.",
      },
      {
        time: "1:26:33",
        title: "Project Blast IR/RF controller",
        speakers: ["Carl Olof Albertsson"],
        summary:
          "A look at new infrared (IR) and radio frequency (RF) hardware from Nabu Casa.",
      },
      { time: "1:33:26", title: "How to support us", speakers: ["Paulus Schoutsen"] },
    ],
  },
  {
    title: "Be part of what we build next",
    summary: "The roadmap goes public, and everyone is invited to comment on it.",
    sessions: [
      {
        time: "1:36:55",
        title: "Be part of what we build next",
        speakers: ["Franck Nijhof", "JLo", "Matthias de Baat", "Laura Palombi"],
        summary:
          "Making projects more approachable for anyone: lower the floor without lowering the ceiling.",
      },
      {
        time: "1:54:59",
        title: "Roadmap",
        speakers: ["Laura Palombi", "Franck Nijhof", "JLo", "Matthias de Baat"],
        summary:
          "The roadmap is now public on GitHub, and it is meant to be a living thing people take part in, not just read.",
      },
      {
        time: "2:00:13",
        title: "Closing",
        speakers: ["Paulus Schoutsen", "Melissa Thermidor", "Missy Quarry"],
      },
    ],
  },
  {
    title: "Post-show Q&A",
    summary: "Questions from the audience after the main program.",
    sessions: [
      { time: "2:03:58", title: "Post-show Q&A: Paulus", speakers: ["Paulus Schoutsen"] },
      {
        time: "2:15:38",
        title: "Post-show Q&A: Laura & Matthias",
        speakers: ["Laura Palombi", "Matthias de Baat"],
      },
      { time: "2:25:40", title: "Post-show Q&A: Missy", speakers: ["Missy Quarry"] },
    ],
  },
];
