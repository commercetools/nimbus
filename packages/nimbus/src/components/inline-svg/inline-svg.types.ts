import type { IconProps } from "../icon/icon.types";

export interface InlineSvgProps extends Omit<IconProps, "children"> {
  /**
   * SVG markup as a string to render
   */
  data: string;
  /**
   * Optional title for accessibility (creates a <title> element inside SVG)
   */
  title?: string;
  /**
   * Optional description for accessibility (creates a <desc> element inside SVG)
   */
  description?: string;
  /**
   * Whether to preserve the original viewBox from the SVG data
   * @default true
   */
  preserveViewBox?: boolean;
  /**
   * Custom className to apply to the SVG element
   */
  className?: string;
}

export interface SanitizationOptions {
  /**
   * Whether to allow style attributes
   * @default false
   */
  allowStyles?: boolean;
  /**
   * Additional attributes to remove during sanitization
   */
  forbiddenAttributes?: string[];
  /**
   * Additional tags to remove during sanitization
   */
  forbiddenTags?: string[];
}
