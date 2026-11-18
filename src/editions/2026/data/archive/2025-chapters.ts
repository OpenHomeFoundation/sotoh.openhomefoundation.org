// Livestream chapters for State of the Open Home 2025.
// Source: the YouTube video description. Grouping into acts is ours.

import type { Act } from "./types";

export const acts: Act[] = [
  {
    title: "Pre-show",
    summary: "The stream opens before the main program begins.",
    sessions: [{ time: "0:00", title: "Livestream pre-opening" }],
  },
  {
    title: "The Open Home Foundation’s first year",
    summary: "A big first year for the Foundation, its projects and its supporters.",
    sessions: [
      { time: "10:00", title: "Opening", speakers: ["Paulus Schoutsen"] },
      { time: "20:35", title: "Open Home Foundation news" },
      { time: "22:53", title: "Nabu Casa", speakers: ["Ben Bangert"] },
      { time: "26:47", title: "Donations to the Open Home Foundation" },
      { time: "27:54", title: "A message from Espressif Systems", speakers: ["Teo Swee Ann"] },
      { time: "31:42", title: "Music Assistant", speakers: ["Marcel van der Veldt"] },
      { time: "35:33", title: "HACS", speakers: ["Joakim Sørensen"] },
      { time: "37:47", title: "Q&A", speakers: ["Ben Bangert", "Marcel van der Veldt"] },
    ],
  },
  {
    title: "Community",
    summary: "The people behind Home Assistant, and what they told us.",
    sessions: [
      { time: "46:33", title: "Community intro" },
      { time: "50:29", title: "Community", speakers: ["Franck Nijhof"] },
      { time: "1:02:53", title: "Demonstration video", speakers: ["Rúnar Björn Herrera"] },
      { time: "1:08:05", title: "User research", speakers: ["Annika Schulz"] },
      { time: "1:19:30", title: "Q&A", speakers: ["Franck Nijhof", "Annika Schulz"] },
    ],
  },
  {
    title: "Works with Home Assistant and voice",
    summary: "Partners building for Home Assistant, and the voice ecosystem.",
    sessions: [
      { time: "1:24:17", title: "Works with Home Assistant", speakers: ["Miranda Bishop"] },
      { time: "1:29:35", title: "A message from Apollo Automation" },
      { time: "1:35:09", title: "Voice ecosystem intro" },
      { time: "1:36:06", title: "Voice ecosystem", speakers: ["Mike Hansen"] },
      { time: "1:42:37", title: "Voice and LLM demonstration video", speakers: ["JLo Pouffier"] },
      { time: "1:48:08", title: "Q&A", speakers: ["Miranda Bishop", "Mike Hansen"] },
    ],
  },
  {
    title: "Open Home values and the roadmap",
    summary: "What the open home stands for, and where we’re heading next.",
    sessions: [
      { time: "1:54:28", title: "Mob Museum video from Shelly" },
      {
        time: "1:57:05",
        title: "Panel about Open Home values",
        speakers: ["Franck Nijhof", "Annika Schulz", "Madelena Mak"],
      },
      { time: "2:11:02", title: "Looking back on Roadmap 2024" },
      { time: "2:16:51", title: "Roadmap 2025", speakers: ["Madelena Mak"] },
      {
        time: "2:34:27",
        title: "Final Q&A",
        speakers: ["Paulus Schoutsen", "Franck Nijhof", "Madelena Mak"],
      },
    ],
  },
];
