import type { HTMLAttributes } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type AvatarRecipeProps = {
  size?: RecipeProps<"avatar">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type AvatarRootSlotProps = HTMLChakraProps<"div", AvatarRecipeProps>;

// ============================================================
// MAIN PROPS
// ============================================================

export type AvatarProps = AvatarRootSlotProps &
  HTMLAttributes<HTMLDivElement> & {
    firstName: string;
    lastName: string;
    src?: string;
    alt?: string;
    isDisabled?: boolean;
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };
