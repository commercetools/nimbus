import { getContrastRatio } from "./contrast";
import type {
  ColorPaletteWithModes,
  ValidationResult,
  ValidationWarning,
} from "./types";

const WCAG_AA_NORMAL = 4.5;

export function validatePalette(
  palette: ColorPaletteWithModes
): ValidationResult {
  const warnings: ValidationWarning[] = [];

  for (const mode of ["light", "dark"] as const) {
    const scale = palette[mode];

    const contrastRatio = getContrastRatio(scale["9"], scale.contrast);
    if (contrastRatio < WCAG_AA_NORMAL) {
      warnings.push({
        step: "contrast",
        contrastRatio,
        required: WCAG_AA_NORMAL,
        message: `${mode} mode: contrast color does not meet WCAG AA (${contrastRatio.toFixed(2)}:1 < ${WCAG_AA_NORMAL}:1) against step 9`,
      });
    }

    const textRatio = getContrastRatio(scale["11"], scale["1"]);
    if (textRatio < WCAG_AA_NORMAL) {
      warnings.push({
        step: "11",
        contrastRatio: textRatio,
        required: WCAG_AA_NORMAL,
        message: `${mode} mode: step 11 does not meet WCAG AA (${textRatio.toFixed(2)}:1 < ${WCAG_AA_NORMAL}:1) against step 1`,
      });
    }

    const step12Ratio = getContrastRatio(scale["12"], scale["1"]);
    if (step12Ratio < WCAG_AA_NORMAL) {
      warnings.push({
        step: "12",
        contrastRatio: step12Ratio,
        required: WCAG_AA_NORMAL,
        message: `${mode} mode: step 12 does not meet WCAG AA (${step12Ratio.toFixed(2)}:1 < ${WCAG_AA_NORMAL}:1) against step 1`,
      });
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
    errors: [],
  };
}
