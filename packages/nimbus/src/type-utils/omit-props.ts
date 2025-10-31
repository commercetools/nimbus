/**
 * Utility type helpers for omitting props from consumer-facing component prop types
 */

/**
 * Omits polymorphic props (`as` and `asChild`) and CSS props from a type.
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
 */
export type OmitInternalProps<
  T,
  AdditionalExclusions extends string = never,
> = Omit<T, "as" | "asChild" | "elementType" | "css" | AdditionalExclusions>;
