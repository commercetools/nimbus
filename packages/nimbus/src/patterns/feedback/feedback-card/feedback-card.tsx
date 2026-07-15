import {
  FeedbackCardRoot,
  FeedbackCardContent,
  FeedbackCardAction,
} from "./components";

/**
 * # FeedbackCard
 *
 * An inline "soft confirmation" surface for agent-driven flows — embedded in a
 * chat feed after an agent suggestion is approved or rejected, prompting the
 * user to confirm or undo the action.
 *
 * FeedbackCard is a **layout-only pattern**: it composes existing Nimbus
 * primitives and positions consumer-provided content and a consumer-provided
 * action button in a responsive, wrapping row. It renders no text and no button
 * of its own, and it exposes **no `variant` prop** — all visual treatment (bg,
 * border, borderRadius, padding) is supplied by the consumer via standard
 * Chakra style props on `FeedbackCard.Root`.
 *
 * @see {@link https://nimbus-documentation.vercel.app/patterns/feedback/feedback-card}
 *
 * @example
 * ```tsx
 * <FeedbackCard.Root bg="positive.2" borderRadius="200" p="400">
 *   <FeedbackCard.Content>
 *     <Text fontWeight="600">Suggestion approved</Text>
 *     <Text color="neutral.11">Applied the recommended discount.</Text>
 *   </FeedbackCard.Content>
 *   <FeedbackCard.Action>
 *     <Button variant="outline" size="xs" onPress={handleUndo}>
 *       Undo
 *     </Button>
 *   </FeedbackCard.Action>
 * </FeedbackCard.Root>
 * ```
 */
export const FeedbackCard = {
  /**
   * # FeedbackCard.Root
   *
   * The layout container. Renders a responsive flex row (`flex-wrap`,
   * `space-between`, token gap) that positions the content and action. Accepts
   * all Chakra style props — set `bg`, `border`, `borderRadius`, and `padding`
   * to express the visual context. Neutral `div` with no implicit ARIA role;
   * pass `role="group"` + `aria-label` if you want it announced as a unit.
   *
   * @example
   * ```tsx
   * <FeedbackCard.Root bg="critical.2" borderRadius="200" p="400">
   *   <FeedbackCard.Content>...</FeedbackCard.Content>
   *   <FeedbackCard.Action>...</FeedbackCard.Action>
   * </FeedbackCard.Root>
   * ```
   */
  Root: FeedbackCardRoot,

  /**
   * # FeedbackCard.Content
   *
   * The text area. A vertical stack for consumer-provided children — typically
   * a title and subtitle composed from Nimbus primitives like `Text` and
   * `Heading`. Grows to fill the row and wraps cleanly on narrow widths.
   *
   * @example
   * ```tsx
   * <FeedbackCard.Content>
   *   <Text fontWeight="600">Suggestion rejected</Text>
   *   <Text color="neutral.11">No changes were applied.</Text>
   * </FeedbackCard.Content>
   * ```
   */
  Content: FeedbackCardContent,

  /**
   * # FeedbackCard.Action
   *
   * The layout slot for the action button. The consumer provides their own
   * Nimbus `Button`; this part handles positioning only and does not alter the
   * button's behavior.
   *
   * @example
   * ```tsx
   * <FeedbackCard.Action>
   *   <Button variant="outline" size="xs" onPress={handleUndo}>
   *     Undo
   *   </Button>
   * </FeedbackCard.Action>
   * ```
   */
  Action: FeedbackCardAction,
};

export {
  FeedbackCardRoot as _FeedbackCardRoot,
  FeedbackCardContent as _FeedbackCardContent,
  FeedbackCardAction as _FeedbackCardAction,
};
