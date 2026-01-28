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

export const recipes = {
  group: groupRecipe,
  loadingSpinner: loadingSpinnerRecipe,
  popover: popoverRecipe,
  radioInput: radioInputSlotRecipe,
  separator: separatorRecipe,
  toggleButton: toggleButtonRecipe,
  toolbar: toolbarRecipe,
  tooltip: tooltipRecipe,
  /**
   * These recipe keys are prefixed with `nimbus` to avoid collisions with Chakra's built-in recipe names.
   *
   * Without this prefix, the generated TypeScript interfaces (e.g. `DrawerVariant`) would collide with
   * Chakra's default interfaces, causing incorrect type inference in consumer applications.
   * */
  nimbusAvatar: avatarRecipe,
  nimbusBadge: badgeRecipe,
  nimbusButton: buttonRecipe,
  nimbusCode: codeRecipe,
  nimbusHeading: headingRecipe,
  nimbusIcon: iconRecipe,
  nimbusKbd: kbdRecipe,
  nimbusLink: linkRecipe,
};
