import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "tag-group",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({
      x: 16,
      y: 34,
      w: 28,
      h: 12,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 21, y: 38.5, w: 12, fill: "onStrong" }),
    stroke(icons.close(38, 40, 0.6), { color: "onStrong", w: 0.75 }),
    panel({ x: 48, y: 34, w: 32, h: 12, radius: "100" }),
    pill({ x: 53, y: 38.5, w: 16, fill: "text" }),
    stroke(icons.close(74, 40, 0.6), { color: "icon", w: 0.75 }),
    panel({ x: 16, y: 50, w: 36, h: 12, radius: "100" }),
    pill({ x: 21, y: 54.5, w: 20, fill: "text" }),
    stroke(icons.close(46, 56, 0.6), { color: "icon", w: 0.75 }),
    panel({ x: 56, y: 50, w: 24, h: 12, radius: "100" }),
    pill({ x: 61, y: 54.5, w: 8, fill: "text" }),
    stroke(icons.close(74, 56, 0.6), { color: "icon", w: 0.75 }),
  ],
});
