import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "icon-toggle-button",
  draw: ({ panel, stroke, icons }) => [
    panel({ x: 20, y: 34, w: 28, h: 28, radius: "200" }),
    stroke(icons.star(34, 48), { color: "icon", w: 1 }),
    panel({ x: 52, y: 34, w: 28, h: 28, radius: "200", tone: "strong" }),
    stroke(icons.star(66, 48), { color: "onStrong", w: 1.2 }),
  ],
});
