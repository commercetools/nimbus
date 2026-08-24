import { CardRoot, CardHeader, CardBody, CardFooter } from "./components";

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
 *   <Card.Body>Card content goes here</Card.Body>
 *   <Card.Footer>Card actions</Card.Footer>
 * </Card.Root>
 * ```
 */
export const Card = {
  /**
   * # Card.Root
   *
   * The root component that provides styling for the card.
   * Must wrap all card parts (Header, Body, Footer).
   * Accepts `variant` and `size` props for visual treatment and spacing.
   *
   * @example
   * ```tsx
   * <Card.Root variant="outlined" size="md">
   *   <Card.Header>Title</Card.Header>
   *   <Card.Body>Content</Card.Body>
   * </Card.Root>
   * ```
   */
  Root: CardRoot,
  /**
   * # Card.Header
   *
   * The header section of the card, typically containing the card title
   * or primary heading. Renders directly in DOM order.
   *
   * @example
   * ```tsx
   * <Card.Root>
   *   <Card.Header>Card Title</Card.Header>
   *   <Card.Body>Content here</Card.Body>
   * </Card.Root>
   * ```
   */
  Header: CardHeader,
  /**
   * # Card.Body
   *
   * The main content area of the card. Contains the primary information,
   * body text, or interactive elements.
   *
   * @example
   * ```tsx
   * <Card.Root>
   *   <Card.Header>Title</Card.Header>
   *   <Card.Body>
   *     <Text>This is the main card content.</Text>
   *   </Card.Body>
   * </Card.Root>
   * ```
   */
  Body: CardBody,
  /**
   * # Card.Footer
   *
   * The footer section of the card for actions and metadata.
   *
   * @example
   * ```tsx
   * <Card.Root>
   *   <Card.Header>Title</Card.Header>
   *   <Card.Body>Content</Card.Body>
   *   <Card.Footer>
   *     <Button>Action</Button>
   *   </Card.Footer>
   * </Card.Root>
   * ```
   */
  Footer: CardFooter,
};

export {
  CardRoot as _CardRoot,
  CardHeader as _CardHeader,
  CardBody as _CardBody,
  CardFooter as _CardFooter,
};
