import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "password-input-field",
  draw: ({ panel, pill, dot, stroke, icons }) => [
    pill({ x: 16, y: 30, w: 24, fill: "textStrong" }),
    panel({ x: 16, y: 38, w: 64, h: 16, radius: "200" }),
    ...[24, 30, 36, 42, 48].map((cx) =>
      dot({ cx, cy: 46, r: 1.3, fill: "textStrong" })
    ),
    stroke(icons.eye(71, 46), { color: "icon", w: 0.85 }),
    dot({ cx: 71, cy: 46, r: 0.9, fill: "icon" }),
    pill({ x: 16, y: 60, w: 36, fill: "onBg" }),
  ],
});
