import { defineIllustration } from "@/illustration-kit";

const COLS = { box: 18, a: 28, b: 52, c: 68 };
const ROWS = [
  { a: 20, b: 12, c: 10, selected: false },
  { a: 16, b: 10, c: 8, selected: true },
  { a: 18, b: 12, c: 6, selected: false },
  { a: 14, b: 8, c: 10, selected: false },
];
const TOP = 18;
const HEADER = 12;
const ROW_HEIGHT = 12;

export default defineIllustration({
  name: "data-table",
  draw: ({ panel, pill, stroke, icons, line, band, checkbox }) => [
    panel({
      x: 12,
      y: TOP,
      w: 72,
      h: HEADER + ROWS.length * ROW_HEIGHT,
      radius: "200",
    }),
    pill({ x: COLS.a, y: TOP + 4.75, w: 14, h: 2.5, fill: "textStrong" }),
    stroke(icons.chevronDown(COLS.a + 18, TOP + 6), {
      color: "icon",
      w: 0.75,
    }),
    pill({ x: COLS.b, y: TOP + 4.75, w: 10, h: 2.5, fill: "textStrong" }),
    pill({ x: COLS.c, y: TOP + 4.75, w: 8, h: 2.5, fill: "textStrong" }),
    ...ROWS.map((row, i) => {
      const y = TOP + HEADER + i * ROW_HEIGHT;
      const cy = y + ROW_HEIGHT / 2;
      const fill = row.selected ? "textStrong" : "text";
      return [
        ...(row.selected
          ? [band({ x: 12.25, y, w: 71.5, h: ROW_HEIGHT })]
          : []),
        line({ x1: 12, y1: y, x2: 84, y2: y }),
        checkbox({ x: COLS.box, y: cy - 2.5, checked: row.selected }),
        pill({ x: COLS.a, y: cy - 1.5, w: row.a, fill }),
        pill({ x: COLS.b, y: cy - 1.5, w: row.b, fill }),
        pill({ x: COLS.c, y: cy - 1.5, w: row.c, fill }),
      ];
    }),
  ],
});
