import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "toast",
  draw: ({ panel, pill, dot, stroke, icons }) => [
    panel({
      x: 24,
      y: 32,
      w: 52,
      h: 18,
      radius: "200",
      tone: "track",
      shadow: false,
    }),
    panel({ x: 16, y: 44, w: 60, h: 20, radius: "200" }),
    dot({ cx: 28, cy: 54, r: 4, fill: "strong" }),
    stroke(icons.check(28, 54, 0.7), { color: "onStrong", w: 0.85 }),
    pill({ x: 40, y: 50, w: 24, fill: "textStrong" }),
    pill({ x: 40, y: 56, w: 16, h: 2.5, fill: "text" }),
    stroke(icons.close(68, 54, 0.7), { color: "icon", w: 0.85 }),
  ],
});
