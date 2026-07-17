import type { OmitInternalProps } from "../../../type-utils/omit-props";
import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";
import type { PopoverRootProps } from "../../../components/popover/popover.types";

export type FilterMenuRootProps = PopoverRootProps;

export type FilterMenuTriggerProps = OmitInternalProps<
  HTMLChakraProps<"button">
> & {
  children: React.ReactNode;
  asChild?: boolean;
  isDisabled?: boolean;
  ref?: React.RefObject<HTMLButtonElement>;
};

export type FilterMenuContentProps = OmitInternalProps<
  HTMLChakraProps<"div">
> & {
  children: React.ReactNode;
  width?: string;
};

export type FilterMenuSectionProps = {
  children: React.ReactNode;
  label: string;
  defaultExpanded?: boolean;
  /** Layout direction for section content */
  direction?: "row" | "column";
};

export type FilterMenuOptionProps = OmitInternalProps<
  HTMLChakraProps<"button">
> & {
  children: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
};

export type FilterMenuClearActionProps = OmitInternalProps<
  HTMLChakraProps<"button">
> & {
  children: React.ReactNode;
  onPress: () => void;
};
