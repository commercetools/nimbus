import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "badge",
  draw: ({ panel, pill }) => [
    panel({
      x: 20,
      y: 36,
      w: 28,
      h: 12,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 25, y: 40.5, w: 18, fill: "onStrong" }),
    panel({ x: 52, y: 36, w: 24, h: 12, radius: "100" }),
    pill({ x: 57, y: 40.5, w: 14, fill: "textStrong" }),
    panel({ x: 20, y: 52, w: 20, h: 12, radius: "100" }),
    pill({ x: 25, y: 56.5, w: 10, fill: "text" }),
    panel({
      x: 44,
      y: 52,
      w: 12,
      h: 12,
      radius: "full",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 48, y: 56.5, w: 4, fill: "onStrong" }),
    panel({ x: 60, y: 52, w: 16, h: 12, radius: "100" }),
    pill({ x: 64, y: 56.5, w: 8, fill: "text" }),
  ],
});
