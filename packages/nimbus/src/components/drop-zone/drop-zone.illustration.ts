import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "drop-zone",
  draw: ({ pill, stroke, dashed, icons }) => [
    dashed({ x: 16, y: 24, w: 64, h: 48, radius: "300", color: "icon" }),
    stroke(icons.upload(48, 40), { color: "icon", w: 1.25 }),
    pill({ x: 36, y: 53, w: 24, fill: "onBg" }),
    pill({ x: 40, y: 59, w: 16, h: 2.5, fill: "muted" }),
  ],
});
