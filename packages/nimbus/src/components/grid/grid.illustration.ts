import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "grid",
  draw: ({ panel }) => [
    // one cell spans two columns
    panel({ x: 20, y: 20, w: 36, h: 16, radius: "200", tone: "strong" }),
    panel({ x: 60, y: 20, w: 16, h: 16, radius: "200" }),
    ...[40, 60].flatMap((y) =>
      [20, 40, 60].map((x) => panel({ x, y, w: 16, h: 16, radius: "200" }))
    ),
  ],
});
