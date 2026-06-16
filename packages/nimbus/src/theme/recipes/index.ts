import { avatarRecipe } from "@/components/avatar/avatar.recipe";
import { badgeRecipe } from "@/components/badge/badge.recipe";
import { buttonRecipe } from "@/components/button/button.recipe";
import { codeRecipe } from "@/components/code/code.recipe";
import { groupRecipe } from "@/components/group/group.recipe";
import { headingRecipe } from "@/components/heading/heading.recipe";
import { iconRecipe } from "@/components/icon/icon.recipe";
import { kbdRecipe } from "@/components/kbd/kbd.recipe";
import { linkRecipe } from "@/components/link/link.recipe";
import { loadingSpinnerRecipe } from "@/components/loading-spinner/loading-spinner.recipe";
import { popoverRecipe } from "@/components/popover/popover.recipe";
import { radioInputSlotRecipe } from "@/components/radio-input/radio-input.recipe";
import { separatorRecipe } from "@/components/separator/separator.recipe";
import { toggleButtonRecipe } from "@/components/toggle-button/toggle-button.recipe";
import { toolbarRecipe } from "@/components/toolbar/toolbar.recipe";
import { tooltipRecipe } from "@/components/tooltip/tooltip.recipe";

/**
 * Recipes for Nimbus Components
 *
 * IMPORTANT: All recipe keys are prefixed with `nimbus` to avoid naming collisions
 * with Chakra UI's built-in recipes. This ensures that Nimbus's custom variant types
 * are correctly generated and don't conflict with Chakra's default types.
 *
 * Without this prefix, generated TypeScript interfaces (e.g., `ButtonVariant`) would
 * collide with Chakra's defaults, causing incorrect type inference in consumer applications.
 *
 * @example
 * // Correct: Use nimbus prefix
 * nimbusButton: buttonRecipe
 *
 * // Wrong: No prefix causes collision
 * button: buttonRecipe  // ❌ Collides with Chakra's button
 */
export const recipes = {
  nimbusAvatar: avatarRecipe,
  nimbusBadge: badgeRecipe,
  nimbusButton: buttonRecipe,
  nimbusCode: codeRecipe,
  nimbusGroup: groupRecipe,
  nimbusHeading: headingRecipe,
  nimbusIcon: iconRecipe,
  nimbusKbd: kbdRecipe,
  nimbusLink: linkRecipe,
  nimbusLoadingSpinner: loadingSpinnerRecipe,
  nimbusPopover: popoverRecipe,
  nimbusRadioInput: radioInputSlotRecipe,
  nimbusSeparator: separatorRecipe,
  nimbusToggleButton: toggleButtonRecipe,
  nimbusToolbar: toolbarRecipe,
  nimbusTooltip: tooltipRecipe,
};
