import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "search-input",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({ x: 16, y: 40, w: 64, h: 16, radius: "200" }),
    stroke(icons.search(25, 48), { color: "icon", w: 0.85 }),
    pill({ x: 34, y: 46.5, w: 24, fill: "textStrong" }),
    stroke(icons.close(72, 48, 0.8), { color: "icon", w: 0.85 }),
  ],
});
