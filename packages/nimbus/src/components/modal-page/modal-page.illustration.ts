import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "modal-page",
  draw: ({ panel, pill, stroke, icons, line }) => [
    panel({
      x: 20,
      y: 12,
      w: 60,
      h: 60,
      radius: "300",
      tone: "track",
      shadow: false,
    }),
    panel({ x: 16, y: 24, w: 64, h: 60, radius: "300" }),
    pill({ x: 24, y: 32.5, w: 24, h: 4, fill: "textStrong" }),
    stroke(icons.close(70, 34, 1.2), { color: "icon", w: 1 }),
    line({ x1: 16, y1: 42, x2: 80, y2: 42 }),
    pill({ x: 24, y: 50, w: 40, fill: "text" }),
    pill({ x: 24, y: 58, w: 32, fill: "text" }),
    pill({ x: 24, y: 66, w: 36, fill: "text" }),
  ],
});
