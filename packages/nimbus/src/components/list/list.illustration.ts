import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "list",
  draw: ({ pill, dot }) => [
    ...[30, 42, 54, 66].map((cy, i) => [
      dot({ cx: 22, cy, r: 2, fill: "strong" }),
      pill({ x: 30, y: cy - 1.5, w: [40, 48, 36, 44][i], fill: "onBg" }),
    ]),
  ],
});
