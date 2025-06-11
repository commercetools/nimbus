import { avatarRecipe } from "@/components/avatar/avatar.recipe";
import { buttonRecipe } from "@/components/button/button.recipe";
import { codeRecipe } from "@/components/code/code.recipe";
import { headingRecipe } from "@/components/heading/heading.recipe";

import { kbdRecipe } from "@/components/kbd/kbd.recipe";
import { linkRecipe } from "@/components/link/link.recipe";
import { tooltipRecipe } from "@/components/tooltip/tooltip.recipe";
import { textInputRecipe } from "@/components/text-input/text-input.recipe";
import { radioInputSlotRecipe } from "@/components/radio-input/radio-input.recipe";

export const recipes = {
  avatar: avatarRecipe,
  button: buttonRecipe,
  code: codeRecipe,
  heading: headingRecipe,
  kbd: kbdRecipe,
  link: linkRecipe,
  tooltip: tooltipRecipe,
  textInput: textInputRecipe,
  radioInput: radioInputSlotRecipe,
};
