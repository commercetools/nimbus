import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "info-dialog",
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
    panel({ x: 22, y: 28, w: 52, h: 40, radius: "300" }),
    stroke(icons.info(32, 38), { color: "strong", w: 1 }),
    pill({ x: 42, y: 36.5, w: 20, fill: "textStrong" }),
    pill({ x: 28, y: 46, w: 36, fill: "text" }),
    panel({
      x: 56,
      y: 56,
      w: 14,
      h: 8,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 59, y: 59.5, w: 8, fill: "onStrong" }),
  ],
});
