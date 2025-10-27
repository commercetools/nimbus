import { CardRoot, CardHeader, CardContent } from "./components";

/**
 * Card
 * ============================================================
 * A versatile container component that presents self-contained information
 * in a visually distinct way. Cards group related content and actions
 * together, making it easy to scan and interact with information.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/card}
 *
 * @example
 * ```tsx
 * <Card.Root>
 *   <Card.Header>Card Title</Card.Header>
 *   <Card.Content>Card content goes here</Card.Content>
 * </Card.Root>
 * ```
 */
export const Card = {
  /**
   * # Card.Root
   *
   * The root component that provides context and styling for the card.
   * Must wrap all card parts (Header, Content) to coordinate their behavior.
   * Accepts styling variants for padding, border, elevation, and background.
   *
   * @example
   * ```tsx
   * <Card.Root cardPadding="md" borderStyle="outlined" elevation="elevated">
   *   <Card.Header>Title</Card.Header>
   *   <Card.Content>Content</Card.Content>
   * </Card.Root>
   * ```
   */
  Root: CardRoot,
  /**
   * # Card.Header
   *
   * The header section of the card, typically containing the card title
   * or primary heading. Automatically positioned above the card content
   * in a consistent layout.
   *
   * @example
   * ```tsx
   * <Card.Root>
   *   <Card.Header>Card Title</Card.Header>
   *   <Card.Content>Content here</Card.Content>
   * </Card.Root>
   * ```
   */
  Header: CardHeader,
  /**
   * # Card.Content
   *
   * The main content area of the card. Contains the primary information,
   * body text, or interactive elements. Automatically positioned below
   * the card header in a consistent layout.
   *
   * @example
   * ```tsx
   * <Card.Root>
   *   <Card.Header>Title</Card.Header>
   *   <Card.Content>
   *     <Text>This is the main card content.</Text>
   *   </Card.Content>
   * </Card.Root>
   * ```
   */
  Content: CardContent,
};

export {
  CardRoot as _CardRoot,
  CardHeader as _CardHeader,
  CardContent as _CardContent,
};
