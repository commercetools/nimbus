import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "chat-message-list",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({ x: 16, y: 20, w: 44, h: 12, radius: "300" }),
    pill({ x: 22, y: 24.5, w: 24, fill: "text" }),
    panel({ x: 36, y: 38, w: 44, h: 12, radius: "300", tone: "strong" }),
    pill({ x: 42, y: 42.5, w: 28, fill: "onStrong" }),
    panel({ x: 16, y: 56, w: 36, h: 12, radius: "300" }),
    pill({ x: 22, y: 60.5, w: 20, fill: "text" }),
    panel({ x: 58, y: 66, w: 22, h: 10, radius: "full", tone: "strong" }),
    stroke(icons.chevronDown(69, 71), { color: "onStrong", w: 0.85 }),
  ],
});
