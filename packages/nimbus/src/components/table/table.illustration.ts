import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "table",
  draw: ({ panel, band, pill, line }) => [
    panel({ x: 12, y: 22, w: 72, h: 52, radius: "200" }),
    band({ x: 14, y: 24, w: 68, h: 10 }),
    line({ x1: 12, y1: 34, x2: 84, y2: 34 }),
    line({ x1: 12, y1: 46, x2: 84, y2: 46 }),
    line({ x1: 12, y1: 58, x2: 84, y2: 58 }),
    line({ x1: 40, y1: 22, x2: 40, y2: 74 }),
    line({ x1: 62, y1: 22, x2: 62, y2: 74 }),
    pill({ x: 18, y: 27.5, w: 14, h: 2.5, fill: "textStrong" }),
    pill({ x: 46, y: 27.5, w: 10, h: 2.5, fill: "textStrong" }),
    pill({ x: 68, y: 27.5, w: 8, h: 2.5, fill: "textStrong" }),
    ...[40, 52, 64].map((cy, i) => [
      pill({ x: 18, y: cy - 1.5, w: [20, 16, 18][i], fill: "text" }),
      pill({ x: 46, y: cy - 1.5, w: [12, 10, 14][i], fill: "text" }),
      pill({ x: 68, y: cy - 1.5, w: [8, 10, 6][i], fill: "text" }),
    ]),
  ],
});
