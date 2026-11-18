import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "draggable-list",
  draw: ({ panel, pill, dot }) => [
    panel({ x: 16, y: 22, w: 64, h: 12, radius: "200" }),
    ...[25, 28, 31].flatMap((cy) => [
      dot({ cx: 22, cy, r: 0.8, fill: "icon" }),
      dot({ cx: 25, cy, r: 0.8, fill: "icon" }),
    ]),
    pill({ x: 32, y: 26.5, w: 28, fill: "text" }),
    panel({ x: 20, y: 40, w: 64, h: 14, radius: "200", tone: "strong" }),
    ...[44, 47, 50].flatMap((cy) => [
      dot({ cx: 26, cy, r: 0.8, fill: "onStrong" }),
      dot({ cx: 29, cy, r: 0.8, fill: "onStrong" }),
    ]),
    pill({ x: 36, y: 45.5, w: 32, fill: "onStrong" }),
    panel({ x: 16, y: 62, w: 64, h: 12, radius: "200" }),
    ...[65, 68, 71].flatMap((cy) => [
      dot({ cx: 22, cy, r: 0.8, fill: "icon" }),
      dot({ cx: 25, cy, r: 0.8, fill: "icon" }),
    ]),
    pill({ x: 32, y: 66.5, w: 24, fill: "text" }),
  ],
});
