import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "dialog",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({
      x: 12,
      y: 16,
      w: 72,
      h: 64,
      radius: "300",
      tone: "track",
      shadow: false,
    }),
    panel({ x: 22, y: 26, w: 52, h: 44, radius: "300" }),
    pill({ x: 28, y: 33, w: 20, fill: "textStrong" }),
    stroke(icons.close(67, 34.5, 0.8), { color: "icon", w: 0.85 }),
    pill({ x: 28, y: 44, w: 36, fill: "text" }),
    pill({ x: 28, y: 50, w: 28, fill: "text" }),
    panel({
      x: 56,
      y: 58,
      w: 12,
      h: 8,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 38, y: 60.5, w: 12, fill: "text" }),
  ],
});
