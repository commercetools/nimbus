import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "simple-grid",
  draw: ({ panel, pill }) => [
    ...[14, 38, 62].flatMap((x) =>
      [26, 50].map((y) => [
        panel({ x, y, w: 20, h: 20, radius: "200" }),
        pill({ x: x + 5, y: y + 8.5, w: 10, fill: "text" }),
      ])
    ),
  ],
});
