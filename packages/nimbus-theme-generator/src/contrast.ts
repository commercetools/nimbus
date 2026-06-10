import { parse, rgb } from "culori";

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const color = rgb(parse(hex));
  if (!color) throw new Error(`Invalid color: ${hex}`);
  const r = srgbToLinear(color.r);
  const g = srgbToLinear(color.g);
  const b = srgbToLinear(color.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(color1: string, color2: string): number {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function calculateContrastColor(color: string): "#ffffff" | "#000000" {
  const whiteRatio = getContrastRatio(color, "#ffffff");
  const blackRatio = getContrastRatio(color, "#000000");
  return whiteRatio >= blackRatio ? "#ffffff" : "#000000";
}
