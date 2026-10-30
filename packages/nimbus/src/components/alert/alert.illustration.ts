import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "alert",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({ x: 12, y: 34, w: 72, h: 28, radius: "200" }),
    stroke(icons.warning(24, 48), { color: "strong", w: 1 }),
    pill({ x: 34, y: 42, w: 28, fill: "textStrong" }),
    pill({ x: 34, y: 49, w: 40, h: 2.5, fill: "text" }),
    stroke(icons.close(76, 41, 0.8), { color: "icon", w: 0.85 }),
  ],
});
