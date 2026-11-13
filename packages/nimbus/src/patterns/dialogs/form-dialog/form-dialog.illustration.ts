import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "form-dialog",
  draw: ({ panel, pill, stroke, field, icons }) => [
    panel({
      x: 12,
      y: 16,
      w: 72,
      h: 64,
      radius: "300",
      tone: "track",
      shadow: false,
    }),
    panel({ x: 20, y: 20, w: 56, h: 56, radius: "300" }),
    pill({ x: 26, y: 27, w: 20, fill: "textStrong" }),
    stroke(icons.close(69, 28.5, 0.8), { color: "icon", w: 0.85 }),
    field({ x: 26, y: 35, w: 44, h: 10, radius: "100", text: 14 }),
    field({ x: 26, y: 49, w: 44, h: 10, radius: "100", text: 20 }),
    panel({
      x: 52,
      y: 64,
      w: 18,
      h: 8,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 56, y: 67.5, w: 10, fill: "onStrong" }),
  ],
});
