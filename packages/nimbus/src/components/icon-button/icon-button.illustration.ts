import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "icon-button",
  draw: ({ panel, stroke, cursor, icons }) => [
    panel({ x: 34, y: 34, w: 28, h: 28, radius: "200", tone: "strong" }),
    stroke(icons.plus(48, 48, 2.5), { color: "onStrong", w: 2 }),
    cursor({ x: 56, y: 56 }),
  ],
});
