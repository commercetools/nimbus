import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "file-trigger",
  draw: ({ panel, pill, stroke, cursor, icons }) => [
    panel({ x: 24, y: 40, w: 48, h: 16, radius: "200" }),
    stroke(icons.upload(35, 48), { color: "icon", w: 0.85 }),
    pill({ x: 44, y: 46.5, w: 20, fill: "textStrong" }),
    cursor({ x: 62, y: 52 }),
  ],
});
