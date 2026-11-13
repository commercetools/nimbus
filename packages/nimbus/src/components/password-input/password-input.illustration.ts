import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "password-input",
  draw: ({ panel, dot, stroke, icons }) => [
    panel({ x: 16, y: 40, w: 64, h: 16, radius: "200" }),
    ...[24, 30, 36, 42, 48].map((cx) =>
      dot({ cx, cy: 48, r: 1.3, fill: "textStrong" })
    ),
    stroke(icons.eye(71, 48), { color: "icon", w: 0.85 }),
    dot({ cx: 71, cy: 48, r: 0.9, fill: "icon" }),
  ],
});
