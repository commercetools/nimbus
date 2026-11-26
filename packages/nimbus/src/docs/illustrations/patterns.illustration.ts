import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "patterns",
  draw: ({ panel, pill, line }) => [
    // the composition
    panel({ x: 18, y: 16, w: 60, h: 64, radius: "200" }),
    // a heading and two fields
    pill({ x: 26, y: 24.5, w: 22, fill: "textStrong" }),
    panel({
      x: 26,
      y: 34,
      w: 44,
      h: 10,
      radius: "100",
      tone: "track",
      shadow: false,
    }),
    pill({ x: 30, y: 37.5, w: 16, fill: "text" }),
    panel({
      x: 26,
      y: 48,
      w: 44,
      h: 10,
      radius: "100",
      tone: "track",
      shadow: false,
    }),
    pill({ x: 30, y: 51.5, w: 10, fill: "text" }),
    // an action bar with a secondary and a primary action
    line({ x1: 18, y1: 64, x2: 78, y2: 64 }),
    panel({
      x: 44,
      y: 68,
      w: 12,
      h: 6,
      radius: "100",
      tone: "track",
      shadow: false,
    }),
    panel({
      x: 58,
      y: 68,
      w: 12,
      h: 6,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
  ],
});
