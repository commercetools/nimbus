import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "collapsible-motion",
  draw: ({ panel, pill, stroke, icons, dashed }) => [
    panel({ x: 16, y: 20, w: 64, h: 14, radius: "200" }),
    pill({ x: 24, y: 25.5, w: 24, fill: "textStrong" }),
    stroke(icons.chevronUp(72, 24.5), { color: "icon", w: 0.85 }),
    stroke(icons.chevronDown(72, 29.5), { color: "icon", w: 0.85 }),
    panel({ x: 16, y: 38, w: 64, h: 22, radius: "200" }),
    pill({ x: 24, y: 44, w: 40, fill: "text" }),
    pill({ x: 24, y: 51, w: 28, fill: "text" }),
    dashed({ x: 16, y: 64, w: 64, h: 12, radius: "200", color: "icon" }),
  ],
});
