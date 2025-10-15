/**
 * Utility type helpers for Nimbus components
 */

/**
 * Excludes polymorphic props (`as` and `asChild`) from a type.
 *
 * **Use case:** For components that use the polymorphic `as` and `asChild` props
 * internally, but do not make them available to the consumer.
 *
 * **Background:**
 * React-Aria's components cannot be configured to use `as` and `asChild` internally,
 * and cannot be directly styled by Chakra's styledSystem. Therefore components
 * from `react-aria-components` should be wrapped in a Chakra `withContext`
 * root component to set the styles onto the `r-a-c` component using `asChild`.
 * This means that we need to allow polymorphism internally, but should not
 * allow it in the external props API since it would not work.
 *
 * @template T - The type to exclude polymorphic props from
 *
 * @example
 * ```typescript
 * export type AccordionItemProps = ExcludePolymorphicFromProps<
 *   RaDisclosureProps & HTMLChakraProps<"div">
 * > & {
 *   children: ReactNode;
 * };
 * ```
 */
export type ExcludePolymorphicFromProps<T> = Omit<T, "as" | "asChild">;
