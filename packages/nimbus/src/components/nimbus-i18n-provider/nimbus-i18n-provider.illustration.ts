import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "nimbus-i18n-provider",
  draw: ({ panel, stroke, icons, pill }) => [
    panel({ x: 12, y: 16, w: 72, h: 64, radius: "300" }),
    stroke(icons.globe(27, 30), { color: "icon", w: 0.85 }),
    pill({ x: 38, y: 28.5, w: 28, fill: "textStrong" }),
    pill({ x: 22, y: 46, w: 52, fill: "text" }),
    pill({ x: 22, y: 54, w: 44, fill: "text" }),
    pill({ x: 22, y: 62, w: 48, fill: "text" }),
  ],
});
