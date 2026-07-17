import { chakra } from "@chakra-ui/react/styled-system";
import { Popover } from "../../../components/popover/popover-compound";
import { CollapsibleMotion } from "../../../components/collapsible-motion/collapsible-motion";
import { Button } from "../../../components/button/button";
import { Icon } from "../../../components/icon/icon";
import { ExpandMore } from "@commercetools/nimbus-icons";
import type {
  FilterMenuRootProps,
  FilterMenuTriggerProps,
  FilterMenuContentProps,
  FilterMenuSectionProps,
  FilterMenuOptionProps,
  FilterMenuClearActionProps,
} from "./filter-menu.types";

const FilterMenuRoot = (props: FilterMenuRootProps) => {
  return <Popover.Root {...props} />;
};
FilterMenuRoot.displayName = "FilterMenu.Root";

const FilterMenuTrigger = (props: FilterMenuTriggerProps) => {
  return <Popover.Trigger {...props} />;
};
FilterMenuTrigger.displayName = "FilterMenu.Trigger";

const FilterMenuContent = ({
  children,
  width,
  ...props
}: FilterMenuContentProps) => {
  return (
    <Popover.Content width={width} {...props}>
      <chakra.div display="flex" flexDirection="column" gap="200">
        {children}
      </chakra.div>
    </Popover.Content>
  );
};
FilterMenuContent.displayName = "FilterMenu.Content";

const FilterMenuSection = ({
  children,
  label,
  defaultExpanded = true,
}: FilterMenuSectionProps) => {
  return (
    <CollapsibleMotion.Root defaultExpanded={defaultExpanded}>
      <CollapsibleMotion.Trigger asChild>
        <Button
          variant="ghost"
          size="2xs"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="full"
          fontWeight="semibold"
          fontSize="250"
          color="fg"
          padding="0"
        >
          {label}
          <Icon size="sm">
            <ExpandMore />
          </Icon>
        </Button>
      </CollapsibleMotion.Trigger>
      <CollapsibleMotion.Content>
        <chakra.div display="flex" flexDirection="column" gap="100" pt="100">
          {children}
        </chakra.div>
      </CollapsibleMotion.Content>
    </CollapsibleMotion.Root>
  );
};
FilterMenuSection.displayName = "FilterMenu.Section";

const FilterMenuOption = ({
  children,
  isSelected,
  onSelect,
  ...props
}: FilterMenuOptionProps) => {
  return (
    <chakra.button
      type="button"
      display="flex"
      alignItems="center"
      width="full"
      cursor="pointer"
      bg={isSelected ? "primary.2" : "transparent"}
      _hover={{ bg: "neutral.3" }}
      borderRadius="100"
      padding="50 100"
      fontSize="250"
      border="none"
      color="fg"
      textAlign="start"
      data-selected={isSelected ? "true" : undefined}
      onClick={onSelect}
      {...props}
    >
      {children}
    </chakra.button>
  );
};
FilterMenuOption.displayName = "FilterMenu.Option";

const FilterMenuClearAction = ({
  children,
  onPress,
  ...props
}: FilterMenuClearActionProps) => {
  return (
    <chakra.button
      type="button"
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="full"
      cursor="pointer"
      bg="transparent"
      border="none"
      color="critical.11"
      fontSize="250"
      fontWeight="medium"
      padding="100"
      borderRadius="100"
      _hover={{ bg: "critical.2" }}
      onClick={onPress}
      {...props}
    >
      {children}
    </chakra.button>
  );
};
FilterMenuClearAction.displayName = "FilterMenu.ClearAction";

export const FilterMenu = {
  Root: FilterMenuRoot,
  Trigger: FilterMenuTrigger,
  Content: FilterMenuContent,
  Section: FilterMenuSection,
  Option: FilterMenuOption,
  ClearAction: FilterMenuClearAction,
};

export {
  FilterMenuRoot as _FilterMenuRoot,
  FilterMenuTrigger as _FilterMenuTrigger,
  FilterMenuContent as _FilterMenuContent,
  FilterMenuSection as _FilterMenuSection,
  FilterMenuOption as _FilterMenuOption,
  FilterMenuClearAction as _FilterMenuClearAction,
};
