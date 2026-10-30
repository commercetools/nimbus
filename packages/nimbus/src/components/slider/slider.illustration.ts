import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "slider",
  draw: ({ bubble, pill, circle }) => [
    bubble({ x: 40, y: 28, w: 20, h: 10, radius: "100" }),
    pill({ x: 46, y: 31.5, w: 8, fill: "onStrong" }),
    pill({ x: 16, y: 45, w: 64, h: 6, fill: "track" }),
    pill({ x: 16, y: 45, w: 34, h: 6, fill: "strong" }),
    circle({ cx: 50, cy: 48, r: 6, fill: "surface", stroke: "strong", w: 1.5 }),
    pill({ x: 16, y: 62, w: 10, fill: "onBg" }),
    pill({ x: 70, y: 62, w: 10, fill: "onBg" }),
  ],
});
