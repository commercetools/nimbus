import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "kbd",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({ x: 20, y: 38, w: 20, h: 20, radius: "100" }),
    pill({ x: 26, y: 46.5, w: 8, fill: "text" }),
    stroke(icons.plus(48, 48), { color: "icon", w: 1 }),
    panel({ x: 56, y: 38, w: 20, h: 20, radius: "100" }),
    pill({ x: 62, y: 46.5, w: 8, fill: "text" }),
  ],
});
