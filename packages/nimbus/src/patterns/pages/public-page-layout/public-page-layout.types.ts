import type { ReactNode } from "react";
import type { FlexProps } from "@/components/flex/flex.types";

/**
 * Props specific to the PublicPageLayout pattern (before merging with style
 * props from the outer `<main>` wrapper).
 */
type PublicPageLayoutOwnProps = {
  /**
   * Main content rendered in the center of the layout (e.g., a login form).
   */
  children: ReactNode;

  /**
   * Brand logo rendered at the top of the layout. When omitted, the logo
   * area is not rendered.
   */
  logo?: ReactNode;

  /**
   * Welcome heading displayed below the logo. Renders inside a Heading
   * component. When omitted, the welcome heading area is not rendered.
   */
  welcomeMessage?: ReactNode;

  /**
   * Legal or footer content rendered at the bottom of the layout. When
   * omitted, the legal footer area is not rendered.
   */
  legalMessage?: ReactNode;

  /**
   * Controls the max-width of the main content area.
   * - `"normal"` — narrower width suited for single-column form content (~384px)
   * - `"wide"` — wider width for two-column or wider content (~742px)
   * @default "normal"
   */
  contentWidth?: "normal" | "wide";

  /**
   * Accessible label for the outer `<main>` landmark. Defaults to an i18n
   * message ("Public page"). Override when the page has a more specific
   * purpose (e.g., "Login page").
   */
  "aria-label"?: string;
};

/**
 * Props for the PublicPageLayout pattern.
 *
 * A pre-built, centered layout for public-facing pages (login, registration,
 * password reset) with slots for brand logo, welcome heading, main content,
 * and legal footer. Composes Flex, Stack, Heading, and Text internally.
 *
 * Style props (e.g., `bg`, `backgroundImage`, `padding`) are forwarded to the
 * outer `<main>` wrapper. For layouts that need a different structure, compose
 * Flex and Stack directly (see the "Escape hatch" section in the dev docs).
 */
export type PublicPageLayoutProps = Omit<
  FlexProps,
  keyof PublicPageLayoutOwnProps
> &
  PublicPageLayoutOwnProps;
