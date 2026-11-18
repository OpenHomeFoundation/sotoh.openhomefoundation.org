// Livestream chapters for State of the Open Home 2024.
// Source: the YouTube video description. Grouping into acts is ours.

import type { Act } from "./types";

export const acts: Act[] = [
  {
    title: "A new foundation",
    summary: "The unveiling of the Open Home Foundation, and the projects joining it.",
    sessions: [
      { time: "0:00", title: "Countdown" },
      { time: "0:11", title: "Introduction video" },
      { time: "1:12", title: "Opening" },
      {
        time: "2:36",
        title: "Announcing the Open Home Foundation",
        speakers: ["Paulus Schoutsen"],
      },
      {
        time: "18:31",
        title: "Panel with Open Home Foundation collaborators",
        summary: "With the founders of WLED, Zigbee2MQTT, Rhasspy and Z-Wave JS.",
      },
    ],
  },
  {
    title: "What we’ve been building",
    summary: "Updates on voice, Home Assistant and hardware.",
    sessions: [
      { time: "36:31", title: "Voice", speakers: ["Michael Hansen"] },
      { time: "53:08", title: "Home Assistant", speakers: ["Franck Nijhof"] },
      { time: "1:21:37", title: "Hardware", speakers: ["Uwe Bernitt"] },
    ],
  },
  {
    title: "Open standards and the future",
    summary: "The state of open standards, and what comes next.",
    sessions: [
      {
        time: "1:40:21",
        title: "Panel on open standards",
        summary: "Zigbee, Z-Wave, Matter and Bluetooth.",
      },
      { time: "2:07:29", title: "Future", speakers: ["Madelena Mak"] },
      { time: "2:37:33", title: "Closing" },
      { time: "2:39:22", title: "Stream end" },
    ],
  },
];
