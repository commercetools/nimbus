import React from "react";
import { useIntl } from "react-intl";
import { Button } from "@/components/button";
import { IconButton } from "@/components/icon-button";
import { Menu } from "@/components/menu";
import { Icon } from "@/components/icon";
import type { SplitButtonProps } from "./split-button.types";
import {
  SplitButtonRootSlot,
  SplitButtonButtonGroupSlot,
  SplitButtonPrimaryButtonSlot,
  SplitButtonTriggerSlot,
} from "./split-button.slots";
import { messages } from "./split-button.i18n";
import { KeyboardArrowDown } from "@commercetools/nimbus-icons";

// Re-export types
export type * from "./split-button.types";

/**
 * # SplitButton
 *
 * A split-button component that combines a primary action button with a dropdown menu.
 *
 * Shows a primary action button + dropdown trigger. The primary button automatically
 * executes the first enabled Menu.Item action, while the dropdown trigger opens a menu
 * with all available options.
 *
 * Use with Menu.Item, Menu.Section, and Separator components for content.
 */
export const SplitButton = (props: SplitButtonProps) => {
  const intl = useIntl();
  const {
    size = "md",
    variant = "solid",
    tone,
    isDisabled = false,
    "aria-label": ariaLabel,
    onAction,
    isOpen,
    defaultOpen,
    onOpenChange,
    icon,
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
  type MenuItemProps = {
    id: string;
    children: React.ReactNode;
    isDisabled?: boolean;
    isCritical?: boolean;
  };

  type ComponentWithChildren = {
    children: React.ReactNode;
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

  // All children are menu items
  const menuItems = props.children;

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
   * Find the primary Menu.Item using the same logic as the original PrimaryActionDropdown.
   * Selects the first enabled Menu.Item, or falls back to the first Menu.Item if all are disabled.
   */
  const findPrimaryMenuItem = () => {
    const allMenuItems: Array<{
      content: React.ReactNode;
      isDisabled: boolean;
      actionId: string | null;
    }> = [];

    // Recursively collect all Menu.Items from children (including nested ones)
    const collectMenuItems = (children: React.ReactNode): void => {
      React.Children.forEach(children, (child) => {
        if (isMenuItemWithId(child)) {
          allMenuItems.push({
            content: child.props.children,
            isDisabled: child.props.isDisabled || false,
            actionId: child.props.id,
          });
        }

        // Recurse into Menu.Section or any component with children
        if (hasChildren(child)) {
          collectMenuItems(child.props.children);
        }
      });
    };

    collectMenuItems(menuItems);

    // Find first enabled Menu.Item, or fallback to first Menu.Item
    const primaryMenuItem =
      allMenuItems.find((item) => !item.isDisabled) || allMenuItems[0];

    return (
      primaryMenuItem || {
        content: intl.formatMessage(messages.noActionsAvailable),
        isDisabled: true,
        actionId: null,
      }
    );
  };

  // Check if there are any actionable menu items for dropdown functionality
  const hasActionableItems = hasActionableMenuItems(menuItems);

  // Get the primary button content using smart selection
  const buttonContent = findPrimaryMenuItem();

  const executePrimaryAction = () => {
    if (!buttonContent.isDisabled && buttonContent.actionId && onAction) {
      onAction(buttonContent.actionId);
    }
  };

  const isPrimaryDisabled = isDisabled || buttonContent.isDisabled;
  const isDropdownTriggerDisabled = isDisabled || !hasActionableItems;

  return (
    <SplitButtonRootSlot variant={variant} data-mode="split">
      <SplitButtonButtonGroupSlot>
        {/* Primary Action Button */}
        <SplitButtonPrimaryButtonSlot asChild>
          <Button
            {...buttonProps}
            isDisabled={isPrimaryDisabled}
            onPress={executePrimaryAction}
          >
            {icon && <Icon>{icon}</Icon>}
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
    </SplitButtonRootSlot>
  );
};

SplitButton.displayName = "SplitButton";

// Export for internal use by react-docgen
export { SplitButton as _SplitButton };
