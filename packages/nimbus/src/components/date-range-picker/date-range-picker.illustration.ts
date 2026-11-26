import { defineIllustration } from "@/illustration-kit";

const RANGE_ROW = 1;
const FROM = 1;
const TO = 5;
const DAY_ROWS = [0, 1, 2, 3];
const DAY_COLS = [0, 1, 2, 3, 4, 5, 6];

export default defineIllustration({
  name: "date-range-picker",
  draw: ({ panel, pill, stroke, icons, band, dot, circle }) => [
    // field: start - end + calendar button
    panel({ x: 16, y: 16, w: 64, h: 12, radius: "200" }),
    pill({ x: 21, y: 20.5, w: 14, fill: "text" }),
    pill({ x: 38, y: 21.25, w: 3, h: 1.5, fill: "text" }),
    pill({ x: 44, y: 20.5, w: 14, fill: "text" }),
    stroke(icons.calendar(71.5, 22), { color: "icon", w: 0.75 }),
    // calendar popover
    panel({ x: 16, y: 32, w: 64, h: 48, radius: "300" }),
    stroke(icons.chevronLeft(23, 38.5), { color: "icon", w: 0.85 }),
    pill({ x: 38, y: 37, w: 20, fill: "textStrong" }),
    stroke(icons.chevronRight(73, 38.5), { color: "icon", w: 0.85 }),
    band({
      x: 24 + FROM * 8,
      y: 50 + RANGE_ROW * 8 - 3.5,
      w: (TO - FROM) * 8,
      h: 7,
    }),
    ...DAY_ROWS.flatMap((row) =>
      DAY_COLS.map((col) => {
        const cx = 24 + col * 8;
        const cy = 50 + row * 8;
        const inRange = row === RANGE_ROW && col >= FROM && !(col > TO);
        const isEdge = row === RANGE_ROW && (col === FROM || col === TO);
        return isEdge
          ? circle({ cx, cy, r: 3.5, fill: "strong" })
          : dot({ cx, cy, r: 2.2, fill: inRange ? "text" : "muted" });
      })
    ),
  ],
});
