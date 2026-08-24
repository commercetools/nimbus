import {
  AccordionRoot,
  AccordionHeader,
  AccordionContent,
  AccordionItem,
  AccordionHeaderRightContent,
} from "./components";

/**
 * # Accordion
 *
 * An interactive component that allows users to show and hide sections of content.
 * Supports single or multiple item expansion, and provides keyboard navigation and WCAG 2.1 AA accessibility.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/accordion}
 *
 * @example
 * ```tsx
 * <Accordion.Root>
 *   <Accordion.Item value="item-1">
 *     <Accordion.Header>First Section</Accordion.Header>
 *     <Accordion.Content>Content for first section</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="item-2">
 *     <Accordion.Header>Second Section</Accordion.Header>
 *     <Accordion.Content>Content for second section</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion.Root>
 * ```
 */
export const Accordion = {
  /**
   * # Accordion.Root
   *
   * The root container for the accordion component.
   * Provides context and configuration for all accordion items.
   *
   * @example
   * ```tsx
   * <Accordion.Root>
   *   <Accordion.Item>
   *     <Accordion.Header>Title</Accordion.Header>
   *     <Accordion.Content>Content</Accordion.Content>
   *   </Accordion.Item>
   * </Accordion.Root>
   * ```
   */
  Root: AccordionRoot,

  /**
   * # Accordion.Item
   *
   * An individual accordion item containing a header and collapsible content.
   * Multiple items can be placed within an Accordion.Root.
   *
   * @example
   * ```tsx
   * <Accordion.Item value="item-1">
   *   <Accordion.Header>Title</Accordion.Header>
   *   <Accordion.Content>Content</Accordion.Content>
   * </Accordion.Item>
   * ```
   */
  Item: AccordionItem,

  /**
   * # Accordion.Header
   *
   * The clickable header that expands/collapses the accordion content.
   * Handles keyboard and mouse interactions for accordion activation.
   *
   * @example
   * ```tsx
   * <Accordion.Header>
   *   Click to expand
   * </Accordion.Header>
   * ```
   */
  Header: AccordionHeader,

  /**
   * # Accordion.Content
   *
   * The collapsible content area that is shown/hidden when the header is activated.
   * Contains the main content of the accordion item.
   *
   * @example
   * ```tsx
   * <Accordion.Content>
   *   <p>This content will be shown when expanded.</p>
   * </Accordion.Content>
   * ```
   */
  Content: AccordionContent,

  /**
   * # Accordion.HeaderRightContent
   *
   * Optional content that appears on the right side of the accordion header.
   * Useful for adding actions, badges, or additional information.
   *
   * @example
   * ```tsx
   * <Accordion.Header>
   *   Title
   *   <Accordion.HeaderRightContent>
   *     <Button>Action</Button>
   *   </Accordion.HeaderRightContent>
   * </Accordion.Header>
   * ```
   */
  HeaderRightContent: AccordionHeaderRightContent,
};

export {
  AccordionRoot as _AccordionRoot,
  AccordionItem as _AccordionItem,
  AccordionHeader as _AccordionHeader,
  AccordionContent as _AccordionContent,
  AccordionHeaderRightContent as _AccordionHeaderRightContent,
};
