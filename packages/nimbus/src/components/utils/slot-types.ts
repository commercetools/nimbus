/**
 * Utility types for slot components to avoid TS2742 warnings
 *
 * These types provide explicit return type annotations for slot components
 * to prevent TypeScript from inferring non-portable types that reference
 * internal Chakra UI recipe types.
 */

/**
 * Slot component type for withProvider
 *
 * Use this as the explicit return type for slot components created with withProvider.
 *
 * @template TElement - The HTML element type (e.g., HTMLDivElement, HTMLButtonElement)
 * @template TProps - The props type for the slot component
 *
 * @example
 * ```typescript
 * export const AccordionRootSlot: SlotComponent<HTMLDivElement, AccordionRootSlotProps> =
 *   withProvider<HTMLDivElement, AccordionRootSlotProps>("div", "root");
 * ```
 */
export type SlotComponent<
  TElement = Element,
  TProps = Record<string, unknown>,
> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TProps> & React.RefAttributes<TElement>
>;
