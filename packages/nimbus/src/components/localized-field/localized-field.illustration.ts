import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "localized-field",
  draw: ({ stroke, icons, pill, panel }) => [
    stroke(icons.globe(22, 28), { color: "icon", w: 0.85 }),
    pill({ x: 32, y: 26.5, w: 20, fill: "textStrong" }),
    ...[38, 56].map((y, i) => [
      panel({ x: 16, y, w: 64, h: 14, radius: "200" }),
      panel({
        x: 20,
        y: y + 3,
        w: 12,
        h: 8,
        radius: "100",
        tone: "strong",
        shadow: false,
      }),
      pill({ x: 23, y: y + 6, w: 6, h: 2, fill: "onStrong" }),
      pill({ x: 38, y: y + 5.5, w: 28 - i * 6, fill: "text" }),
    ]),
  ],
});
