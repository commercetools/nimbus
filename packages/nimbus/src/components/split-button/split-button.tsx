import React from "react";
import { Button } from "@/components/button";
import { IconButton } from "@/components/icon-button";
import { Menu } from "@/components/menu";
import type { SplitButtonProps } from "./split-button.types";
import {
  SplitButtonRootSlot,
  SplitButtonButtonGroupSlot,
  SplitButtonPrimaryButtonSlot,
  SplitButtonTriggerSlot,
} from "./split-button.slots";
import { KeyboardArrowDown } from "@commercetools/nimbus-icons";

// Re-export types
export type * from "./split-button.types";

/**
 * # SplitButton
 *
 * A split-button component that combines a primary action button with a dropdown menu.
 *
 * Supports two modes:
 * - Split button mode: When `defaultAction` is provided, shows primary action + dropdown trigger
 * - Regular button mode: When no `defaultAction`, entire button opens dropdown
 *
 * Use with Menu.Item, Menu.Section, and Menu.Separator components for content.
 */
export const SplitButton = (props: SplitButtonProps) => {
  const {
    size = "md",
    variant = "solid",
    tone,
    defaultAction,
    isDisabled = false,
    "aria-label": ariaLabel,
    onAction,
    isOpen,
    defaultOpen,
    onOpenChange,
    children,
  } = props;

  const buttonProps = { size, variant, tone };

  /**
   * CORE CONCEPT: In split button mode, we need to populate the primary button
   * with content from a Menu.Item (specified by defaultAction prop).
   *
   * Why this complexity exists:
   * - Users define actions as <Menu.Item id="save">Save Document</Menu.Item>
   * - We need to extract "Save Document" text to show on the primary button
   * - Menu.Items can be nested inside Menu.Section components
   * - We need to handle disabled states and fallbacks
   */

  // Type guards for safe prop access
  interface MenuItemProps {
    id: string;
    children: React.ReactNode;
    isDisabled?: boolean;
    isCritical?: boolean;
  }

  interface SlotProps {
    slot: string;
    children?: React.ReactNode;
  }

  interface ComponentWithChildren {
    children: React.ReactNode;
  }

  // Helper to check if element has slot prop
  const hasSlotProp = (
    element: React.ReactNode
  ): element is React.ReactElement<SlotProps> => {
    if (!React.isValidElement(element)) return false;
    if (
      !element.props ||
      typeof element.props !== "object" ||
      element.props === null
    )
      return false;
    return "slot" in element.props;
  };

  // Check if element is a Menu.Item with required props
  const isMenuItemWithId = (
    element: React.ReactNode
  ): element is React.ReactElement<MenuItemProps> => {
    if (!React.isValidElement(element) || !element.props) return false;
    const props = element.props as Record<string, unknown>;
    return "id" in props && typeof props.id === "string";
  };

  // Check if element has children prop
  const hasChildren = (
    element: React.ReactNode
  ): element is React.ReactElement<ComponentWithChildren> => {
    if (!React.isValidElement(element) || !element.props) return false;
    const props = element.props as Record<string, unknown>;
    return "children" in props;
  };

  /**
   * Separate icon/label slots from menu items.
   * This allows users to provide Icon components with slot="icon" and Text components with slot="label"
   * alongside their Menu.Item components.
   */
  const separateSlots = (children: React.ReactNode) => {
    const childArray = React.Children.toArray(children);
    return {
      iconElement: childArray.find(
        (child) => hasSlotProp(child) && child.props.slot === "icon"
      ),
      labelElement: childArray.find(
        (child) => hasSlotProp(child) && child.props.slot === "label"
      ),
      menuItems: childArray.filter(
        (child) =>
          !hasSlotProp(child) ||
          (child.props.slot !== "icon" && child.props.slot !== "label")
      ),
    };
  };

  const { iconElement, labelElement, menuItems } = separateSlots(children);

  /**
   * Find a specific Menu.Item by ID to populate the primary button content in split mode.
   * This searches through Menu.Items (including those nested in Menu.Sections).
   *
   * @param children - The menu children to search through
   * @param targetId - The ID of the Menu.Item we want to find
   * @returns The Menu.Item content and properties, or null if not found
   */
  const findMenuItemById = (
    children: React.ReactNode,
    targetId: string
  ): {
    content: React.ReactNode;
    isDisabled: boolean;
    isCritical: boolean;
  } | null => {
    let found: {
      content: React.ReactNode;
      isDisabled: boolean;
      isCritical: boolean;
    } | null = null;

    React.Children.forEach(children, (child) => {
      if (found) return;

      // Direct Menu.Item match
      if (isMenuItemWithId(child) && child.props.id === targetId) {
        found = {
          content: child.props.children,
          isDisabled: child.props.isDisabled || false,
          isCritical: child.props.isCritical || false,
        };
        return;
      }

      // Recurse into Menu.Section or any component with children
      if (hasChildren(child)) {
        found = findMenuItemById(child.props.children, targetId);
      }
    });

    return found;
  };

  /**
   * Check if there are any actionable (enabled) Menu.Items in the children.
   * This is used to determine if the dropdown trigger should be disabled.
   */
  const hasActionableMenuItems = (children: React.ReactNode): boolean => {
    let hasActionable = false;

    React.Children.forEach(children, (child) => {
      if (hasActionable) return;

      // Check if this is an enabled Menu.Item
      if (isMenuItemWithId(child) && !child.props.isDisabled) {
        hasActionable = true;
        return;
      }

      // Recurse into Menu.Section or any component with children
      if (hasChildren(child)) {
        hasActionable = hasActionableMenuItems(child.props.children);
      }
    });

    return hasActionable;
  };

  /**
   * Get the primary button content for split mode.
   * Uses defaultAction if provided, otherwise shows standard fallback text.
   * This is the main function that resolves "what should the primary button show?".
   */
  const getPrimaryButtonContent = (): {
    content: React.ReactNode;
    isDisabled: boolean;
    actionId: string | null;
  } => {
    // If defaultAction is specified, try to use it directly
    if (defaultAction) {
      const item = findMenuItemById(menuItems, defaultAction);
      if (item) {
        return {
          content: item.content,
          isDisabled: item.isDisabled || false,
          actionId: defaultAction,
        };
      }
    }

    // If no defaultAction found or no defaultAction specified, show standard fallback
    return {
      // TODO: localize this
      content: "No actions available",
      isDisabled: true,
      actionId: null,
    };
  };

  // Determine if we're in "split button" mode (with defaultAction) or "regular button" mode (no defaultAction)
  const isSplitButtonMode = defaultAction !== undefined;

  // Check if there are any actionable menu items for dropdown functionality
  const hasActionableItems = hasActionableMenuItems(menuItems);

  /**
   * Resolve what content to show on the primary button based on the current mode:
   * - Split mode: Use Menu.Item content (from defaultAction or first available)
   * - Regular mode: Use label slot content
   */
  const buttonContent = isSplitButtonMode
    ? getPrimaryButtonContent()
    : {
        content:
          labelElement && hasSlotProp(labelElement)
            ? labelElement.props.children
            : // TODO: localize this
              "Select an option",
        isDisabled: false,
        actionId: null,
      };

  const executePrimaryAction = () => {
    if (buttonContent.actionId && !buttonContent.isDisabled && onAction) {
      onAction(buttonContent.actionId);
    }
  };

  const isPrimaryDisabled = isDisabled || buttonContent.isDisabled;

  // In regular mode, if there are no actionable items, the entire button should be disabled
  // In split mode, only disable the dropdown trigger if there are no actionable items
  const isDropdownTriggerDisabled = isDisabled || !hasActionableItems;
  const isRegularButtonDisabled = isSplitButtonMode
    ? isPrimaryDisabled
    : isDropdownTriggerDisabled;

  return (
    <SplitButtonRootSlot
      variant={variant}
      data-mode={isSplitButtonMode ? "split" : "regular"}
    >
      {isSplitButtonMode ? (
        // Split Button Mode: Separate primary button + dropdown trigger
        <SplitButtonButtonGroupSlot>
          {/* Primary Action Button - Internal to component */}
          <SplitButtonPrimaryButtonSlot asChild>
            <Button
              {...buttonProps}
              isDisabled={isPrimaryDisabled}
              onPress={executePrimaryAction}
            >
              {iconElement}
              {buttonContent.content}
            </Button>
          </SplitButtonPrimaryButtonSlot>

          {/* Menu Trigger and Dropdown */}
          <Menu.Root
            trigger="press"
            isOpen={isOpen}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            placement="bottom end"
            selectionMode="none"
            onAction={onAction ? (key) => onAction(String(key)) : undefined}
          >
            <Menu.Trigger asChild>
              <SplitButtonTriggerSlot asChild>
                <IconButton
                  {...buttonProps}
                  aria-label={ariaLabel}
                  isDisabled={isDropdownTriggerDisabled}
                >
                  <KeyboardArrowDown />
                </IconButton>
              </SplitButtonTriggerSlot>
            </Menu.Trigger>

            <Menu.Content>{menuItems}</Menu.Content>
          </Menu.Root>
        </SplitButtonButtonGroupSlot>
      ) : (
        // Regular Button Mode: Single button that opens dropdown on click
        <Menu.Root
          trigger="press"
          isOpen={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          placement="bottom start"
          selectionMode="none"
          onAction={onAction ? (key) => onAction(String(key)) : undefined}
        >
          <Menu.Trigger asChild>
            <SplitButtonPrimaryButtonSlot asChild>
              <Button
                {...buttonProps}
                isDisabled={isRegularButtonDisabled}
                aria-label={ariaLabel}
              >
                {iconElement}
                {buttonContent.content}
                <KeyboardArrowDown />
              </Button>
            </SplitButtonPrimaryButtonSlot>
          </Menu.Trigger>

          <Menu.Content>{menuItems}</Menu.Content>
        </Menu.Root>
      )}
    </SplitButtonRootSlot>
  );
};

SplitButton.displayName = "SplitButton";

// Export for internal use by react-docgen
export { SplitButton as _SplitButton };
