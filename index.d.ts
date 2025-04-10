import { AriaButtonProps } from 'react-aria';
import { AriaCheckboxProps } from 'react-aria';
import { AriaLinkOptions } from 'react-aria';
import { Bleed } from '@chakra-ui/react';
import { BoxProps as BoxProps_2 } from '@chakra-ui/react';
import { Code } from '@chakra-ui/react';
import { ConditionalValue } from '@chakra-ui/react';
import { Dialog } from '@chakra-ui/react';
import { Dispatch } from 'react';
import { Em } from '@chakra-ui/react';
import { FC } from 'react';
import { Flex } from '@chakra-ui/react';
import { FocusableOptions } from 'react-aria';
import { ForwardRefExoticComponent } from 'react';
import { GridItemProps } from '@chakra-ui/react';
import { GridProps as GridProps_2 } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { Highlight as Highlight_2 } from '@chakra-ui/react';
import { HTMLAttributes } from 'react';
import { HTMLChakraProps } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { InputElementProps } from '@chakra-ui/react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { Kbd } from '@chakra-ui/react';
import { List } from '@chakra-ui/react';
import { ListBoxItemProps } from 'react-aria-components';
import { ListBoxProps } from 'react-aria-components';
import { ListBoxSectionProps } from 'react-aria-components';
import { LoadingSpinnerRootProps } from './loading-spinner.slots';
import { PropsWithChildren } from 'react';
import { ReactNode } from 'react';
import { RecipeDefinition } from '@chakra-ui/react';
import { RecipeProps } from '@chakra-ui/react';
import { RecipeVariantProps } from '@chakra-ui/react';
import { RecipeVariantRecord } from '@chakra-ui/react';
import { RefAttributes } from 'react';
import { SelectOptionGroupProps as SelectOptionGroupProps_2 } from './select.types';
import { SelectOptionProps as SelectOptionProps_2 } from './select.types';
import { SelectOptionsProps as SelectOptionsProps_2 } from './select.types';
import { SelectProps } from 'react-aria-components';
import { SelectRootProps as SelectRootProps_2 } from './select.types';
import { SetStateAction } from 'react';
import { SimpleGridProps as SimpleGridProps_2 } from '@chakra-ui/react';
import { SlotRecipeDefinition } from '@chakra-ui/react';
import { StackProps as StackProps_2 } from '@chakra-ui/react';
import { SystemContext } from '@chakra-ui/react';
import { Table } from '@chakra-ui/react';
import { TextFieldProps } from 'react-aria-components';
import { TextProps as TextProps_2 } from '@chakra-ui/react';
import { ThemeProviderProps } from 'next-themes';
import { TooltipProps as TooltipProps_2 } from 'react-aria-components';
import { TooltipTrigger as TooltipTrigger_2 } from 'react-aria-components';
import { TooltipTriggerComponentProps } from 'react-aria-components';
import { UnstyledProp } from '@chakra-ui/react';
import { useCopyToClipboard } from 'react-use';
import { useHotkeys } from 'react-hotkeys-hook';
import { VisuallyHiddenProps as VisuallyHiddenProps_2 } from 'react-aria';

/** Base Chakra styling props for the `actions` slot (`div`). */
export declare type AlertActionsProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Props for the `Alert.Description` sub-component (inherits from Text). */
export declare type AlertDescriptionProps = TextProps;

/** Props for the `Alert.DismissButton` sub-component (inherits from Button). */
export declare type AlertDismissButtonProps = ButtonProps;

/** Base Chakra styling props for the `icon` slot (`div`). */
export declare type AlertIconProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Final external props for the `<Alert>` component (variants + children + data-* attrs). */
export declare type AlertProps = PropsWithChildren<AlertVariantProps> & {
    [key: `data-${string}`]: unknown;
};

/**
 * Recipe configuration for the Alert component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
declare const alertRecipe: SlotRecipeDefinition<"title" | "description" | "icon" | "root" | "actions" | "dismissButton", {
tone: {
critical: {
root: {
colorPalette: "error";
};
};
info: {
root: {
colorPalette: "info";
};
};
warning: {
root: {
colorPalette: "amber";
};
};
positive: {
root: {
colorPalette: "success";
};
};
};
variant: {
flat: {};
outlined: {
root: {
border: "solid-25";
borderColor: "colorPalette.5";
backgroundColor: "colorPalette.2";
padding: "200";
borderRadius: "200";
};
};
};
}>;

/** Type signature for the main `Alert` component (using `forwardRef`). */
export declare type AlertRootComponent = ForwardRefExoticComponent<AlertProps & RefAttributes<HTMLDivElement>>;

/** Base Chakra styling props for the root `div` slot. */
export declare type AlertRootProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Props for the `Alert.Title` sub-component (inherits from Text). */
export declare type AlertTitleProps = TextProps;

/** Combined root props including Chakra styles and recipe variants. */
declare type AlertVariantProps = AlertRootProps & RecipeVariantProps<typeof alertRecipe>;

export declare const Avatar: ForwardRefExoticComponent<AvatarProps & RefAttributes<HTMLDivElement>>;

export declare interface AvatarComponentProps extends HTMLAttributes<HTMLDivElement>, RecipeVariantProps<typeof avatarRecipe> {
    /**
     * The first name used to show initials
     */
    firstName: string;
    /**
     * The last name used to show initials
     */
    lastName: string;
    /**
     * The image URL
     */
    src?: string;
    /**
     * Alt text for the avatar image
     */
    alt?: string;
    /**
     * If the avatar is disabled
     */
    isDisabled?: boolean;
}

export declare interface AvatarProps extends FunctionalAvatarProps {
    children?: React.ReactNode;
}

declare const avatarRecipe: RecipeDefinition<    {
size: {
md: {
width: number;
height: number;
textStyle: "sm";
};
xs: {
width: number;
height: number;
textStyle: "xs";
};
"2xs": {
width: number;
height: number;
textStyle: "xs";
};
};
}>;

declare interface AvatarRecipeProps extends RecipeProps<"div">, UnstyledProp {
}

declare interface AvatarRootProps extends HTMLChakraProps<"div", AvatarRecipeProps> {
}

/**
 * Badge
 * ============================================================
 * badge
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLSpanElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export declare const Badge: ForwardRefExoticComponent<BadgeProps & RefAttributes<HTMLSpanElement>>;

/**
 * Main props interface for the Badge component.
 * Extends BadgeVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export declare interface BadgeProps extends BadgeVariantProps {
    children?: React.ReactNode;
}

/**
 * Recipe configuration for the Badge component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
declare const badgeRecipe: RecipeDefinition<    {
size: {
"2xs": {
fontSize: "300";
gap: "100";
h: "600";
lineHeight: "350";
px: "200";
_icon: {
width: "400";
height: "400";
};
};
xs: {
fontSize: "350";
gap: "100";
h: "800";
lineHeight: "400";
px: "300";
_icon: {
width: "500";
height: "500";
};
};
md: {
fontSize: "400";
gap: "200";
h: "1000";
lineHeight: "500";
px: "400";
_icon: {
width: "600";
height: "600";
};
};
};
}>;

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the span element.
 */
export declare interface BadgeRecipeProps extends RecipeProps<"span">, UnstyledProp {
}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export declare interface BadgeRootProps extends HTMLChakraProps<"span", BadgeRecipeProps> {
}

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
declare type BadgeVariantProps = BadgeRootProps & RecipeVariantProps<typeof badgeRecipe> & {
    [key: `data-${string}`]: string;
};

export { Bleed }

export declare const Box: ForwardRefExoticComponent<BoxProps & RefAttributes<HTMLDivElement>>;

export declare interface BoxProps extends HTMLChakraProps<"div"> {
    children?: React.ReactNode;
}

export declare const Button: ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>;

export declare interface ButtonProps extends FunctionalButtonProps {
}

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the button element.
 */
declare interface ButtonRecipeProps extends RecipeProps<"button">, UnstyledProp {
}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
declare type ButtonRootProps = HTMLChakraProps<"button", ButtonRecipeProps>;

/**
 * Main props interface for the Card component.
 * Extends CardVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export declare interface CardProps extends CardVariantProps {
    children?: React.ReactNode;
}

/**
 * Recipe configuration for the Card component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
declare const cardRecipe: SlotRecipeDefinition<"content" | "header" | "root", {
cardPadding: {
sm: {
root: {
padding: "200";
};
};
md: {
root: {
padding: "400";
};
};
lg: {
root: {
padding: "600";
};
};
};
borderStyle: {
none: {};
outlined: {
root: {
border: "solid-25";
borderColor: "colorPalette.3";
};
};
};
elevation: {
none: {};
elevated: {
root: {
shadow: "1";
};
};
};
backgroundStyle: {
default: {
root: {
backgroundColor: "colorPalette.contrast";
};
};
muted: {
root: {
backgroundColor: "colorPalette.2";
};
};
};
}>;

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
declare interface CardRecipeProps extends RecipeProps<"div">, UnstyledProp {
}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
declare interface CardRootProps extends HTMLChakraProps<"div", CardRecipeProps> {
}

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
declare type CardVariantProps = CardRootProps & RecipeVariantProps<typeof cardRecipe> & {
    [key: `data-${string}`]: unknown;
};

/**
 * Checkbox
 * ============================================================
 * displays a checkbox and an associated label
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export declare const Checkbox: ForwardRefExoticComponent<CheckboxProps & RefAttributes<HTMLInputElement>>;

/**
 * Main props interface for the Checkbox component.
 * Extends CheckboxVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export declare interface CheckboxProps extends CheckboxVariantProps {
    children?: React.ReactNode;
}

declare interface CheckboxRootProps extends HTMLChakraProps<"label", RecipeVariantProps<typeof checkboxSlotRecipe>> {
}

/**
 * Recipe configuration for the Checkbox component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
declare const checkboxSlotRecipe: SlotRecipeDefinition<"label" | "root" | "indicator", {
size: {
md: {
label: {
fontSize: "350";
fontWeight: "400";
lineHeight: "400";
};
indicator: {
w: "400";
h: "400";
zIndex: number;
_after: {
position: "absolute";
content: "''";
width: "600";
height: "600";
zIndex: number;
};
};
};
};
}>;

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
declare type CheckboxVariantProps = CheckboxRootProps & RecipeVariantProps<typeof checkboxSlotRecipe> & AriaCheckboxProps;

export { Code }

export declare function ColorModeLabel(): "Light Theme" | "DarkTheme";

declare interface ColorModeProviderProps extends ThemeProviderProps {
}

export declare const DialogActionTrigger: ForwardRefExoticComponent<Dialog.ActionTriggerProps & RefAttributes<HTMLButtonElement>>;

export declare const DialogBackdrop: ForwardRefExoticComponent<Dialog.BackdropProps & RefAttributes<HTMLDivElement>>;

export declare const DialogBody: ForwardRefExoticComponent<Dialog.BodyProps & RefAttributes<HTMLDivElement>>;

export declare const DialogCloseTrigger: ForwardRefExoticComponent<Dialog.CloseTriggerProps & RefAttributes<HTMLButtonElement>>;

export declare const DialogContent: ForwardRefExoticComponent<DialogContentProps & RefAttributes<HTMLDivElement>>;

declare interface DialogContentProps extends Dialog.ContentProps {
    portalled?: boolean;
    portalRef?: React.RefObject<HTMLElement>;
    backdrop?: boolean;
}

export declare const DialogDescription: ForwardRefExoticComponent<Dialog.DescriptionProps & RefAttributes<HTMLDivElement>>;

export declare const DialogFooter: ForwardRefExoticComponent<Dialog.FooterProps & RefAttributes<HTMLDivElement>>;

export declare const DialogHeader: ForwardRefExoticComponent<Dialog.HeaderProps & RefAttributes<HTMLDivElement>>;

export declare const DialogRoot: FC<Dialog.RootProps>;

export declare const DialogTitle: ForwardRefExoticComponent<Dialog.TitleProps & RefAttributes<HTMLDivElement>>;

export declare const DialogTrigger: ForwardRefExoticComponent<Dialog.TriggerProps & RefAttributes<HTMLButtonElement>>;

export { Em }

/**
 * For use in components that use the polymorphic `as` and `asChild` props
 * internally, but do not make them available to the consumer.
 *
 * Long rambling background:
 * React-Aria's components cannot be configured to use `as` and `asChild` internally,
 * and cannot be directly styled by chakra's styledSystem. Therefore components
 * from `react-aria-components` should be wrapped in a chakra `withContext`
 * root component to set the styles onto the `r-a-c` component using `asChild`.
 * This means that we need to allow polymorphism internally, but should not
 * allow it in the external props api since it would not work.
 */
declare type ExcludePolymorphicFromProps<T> = Omit<T, "as" | "asChild">;

export { Flex }

declare type FunctionalAvatarProps = AvatarRootProps & AvatarComponentProps;

/** combine chakra-button props with aria-button props */
declare type FunctionalButtonProps = ButtonRootProps & AriaButtonProps & {
    [key: `data-${string}`]: unknown;
};

export declare const Grid: ForwardRefExoticComponent<GridProps & RefAttributes<HTMLDivElement>> & {
    Item: ForwardRefExoticComponent<GridItemProps & RefAttributes<HTMLDivElement>>;
};

/**
 * Grid
 * ============================================================
 * The Grid Layout Component provides a flexible and responsive way to structure content using a two-dimensional grid system. It allows elements to be arranged in rows and columns, enabling dynamic and efficient layouts for different screen sizes.
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 */
export declare interface GridProps extends GridProps_2 {
    children?: React.ReactNode;
}

export { Heading }

export { Highlight_2 as Highlight }

/**
 * IconButton
 * ============================================================
 * displays a button with only an icon as child. It is based
 * on the regular `Button` component, but with a few adjustments.
 */
export declare const IconButton: ForwardRefExoticComponent<IconButtonProps & RefAttributes<HTMLButtonElement>>;

/**
 * Main props interface for the IconButton component.
 */
export declare interface IconButtonProps extends ButtonProps {
    /** explains the intended action, required for accessibility */
    "aria-label": string;
}

export { Input }

export declare const InputGroup: ForwardRefExoticComponent<InputGroupProps & RefAttributes<HTMLDivElement>>;

export declare interface InputGroupProps extends BoxProps_2 {
    startElementProps?: InputElementProps;
    endElementProps?: InputElementProps;
    startElement?: React.ReactNode;
    endElement?: React.ReactNode;
    children: React.ReactElement;
}

export { Kbd }

/**
 * Link
 * ============================================================
 * To allow a user to navigate to a different page or resource
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLAnchorElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export declare const Link: ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>;

/**
 * Main props interface for the Link component.
 * Extends LinkVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export declare interface LinkProps extends LinkVariantProps {
    children?: React.ReactNode;
}

/**
 * Recipe configuration for the Link component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
declare const linkRecipe: RecipeDefinition<    {
size: {
xs: {
fontSize: "300";
lineHeight: "450";
};
sm: {
fontSize: "350";
lineHeight: "500";
};
md: {
fontSize: "400";
lineHeight: "600";
};
};
fontColor: {
primary: {
color: "primary";
};
inherit: {
color: "inherit";
};
};
}>;

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the a element.
 */
declare interface LinkRecipeProps extends RecipeProps<"a">, UnstyledProp {
}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
declare type LinkRootProps = HTMLChakraProps<"a", LinkRecipeProps>;

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 *
 * Differences between LinkRootProps and LinkVariantProps necessitate
 * the use of Omit and Pick to ensure the correct props are passed
 */
declare type LinkVariantProps = Omit<LinkRootProps, "onFocus" | "onBlur"> & Pick<AriaLinkOptions, "onFocus" | "onBlur"> & RecipeVariantProps<typeof linkRecipe> & {
    [key: `data-${string}`]: string;
};

export { List }

export declare const ListItem: (props: ListItemType) => JSX_2.Element;

export declare type ListItemType = React.ComponentProps<typeof List.Item>;

export declare const ListRoot: (props: ListRootType) => JSX_2.Element;

export declare type ListRootType = React.ComponentProps<typeof List.Root>;

/**
 * LoadingSpinner
 * ============================================================
 * Indicates ongoing processes or loading states
 */
export declare const LoadingSpinner: ForwardRefExoticComponent<LoadingSpinnerRootProps & {
size?: ConditionalValue<"sm" | "md" | "lg" | "2xs" | "xs" | undefined>;
tone?: ConditionalValue<"white" | "primary" | undefined>;
} & {
[key: `data-${string}`]: string;
} & RefAttributes<HTMLDivElement>>;

/**
 * Main props interface for the LoadingSpinner component.
 * Extends LoadingSpinnerVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export declare type LoadingSpinnerProps = LoadingSpinnerVariantProps;

/**
 * Recipe configuration for the LoadingSpinner component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
declare const loadingSpinnerRecipe: RecipeDefinition<    {
size: {
"2xs": {
width: "350";
height: "350";
};
xs: {
width: "500";
height: "500";
};
sm: {
width: "600";
height: "600";
};
md: {
width: "800";
height: "800";
};
lg: {
width: "1000";
height: "1000";
};
};
tone: {
primary: {
colorPalette: "ctvioletAlpha";
};
white: {
colorPalette: "whiteAlpha";
};
};
}>;

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
declare interface LoadingSpinnerRecipeProps extends RecipeProps<"div">, UnstyledProp {
}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
declare type LoadingSpinnerRootProps_2 = Omit<HTMLChakraProps<"div", LoadingSpinnerRecipeProps>, "as" | "asChild">;

/**
 * Combines the root props with Chakra UI's recipe variant props and Aria's progress bar props.
 *
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
declare type LoadingSpinnerVariantProps = LoadingSpinnerRootProps_2 & RecipeVariantProps<typeof loadingSpinnerRecipe> & {
    [key: `data-${string}`]: string;
};

/**
 * MakeElementFocusable
 * ============================================================
 * A helper component that adds props from `react-aria`s `useFocusable` hook
 * to its child so that it can be used as a trigger element for a `Tooltip`
 *
 * Caveats:
 * - Using non-interactive elements as tooltip triggers is against ARIA best-practices,
 *   it is your responsibility to ensure that the underlying trigger element handles
 *   focus and hover interactions correctly for keyboard-only users
 *
 * Features:
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLElement' attributes (including aria- & data-attributes)
 *
 * Further Context:
 * - [React Aria Components Tooltip Documentation](https://react-spectrum.adobe.com/react-aria/Tooltip.html)
 * - [React Aria Components Issue re:Tooltip with custom trigger](https://github.com/adobe/react-spectrum/issues/5733#issuecomment-1918691983)
 * - [ARIA Tooltip Pattern](https://www.w3.org/TR/wai-aria-1.2/#tooltip)
 */
export declare const MakeElementFocusable: ForwardRefExoticComponent<FocusableOptions<HTMLElement> & {
children?: ReactNode | undefined;
} & RefAttributes<HTMLElement>>;

export declare const Select: {
    Root: ForwardRefExoticComponent<SelectRootProps_2 & RefAttributes<HTMLDivElement>>;
    Options: <T extends object>(props: SelectOptionsProps_2<T> & RefAttributes<HTMLDivElement>) => JSX.Element;
    Option: <T extends object>(props: SelectOptionProps_2<T> & RefAttributes<HTMLDivElement>) => JSX.Element;
    OptionGroup: <T extends object>(props: SelectOptionGroupProps_2<T> & RefAttributes<HTMLDivElement>) => JSX.Element;
};

export declare const _SelectOption: <T extends object>(props: SelectOptionProps<T> & RefAttributes<HTMLDivElement>) => JSX.Element;

export declare const _SelectOptionGroup: <T extends object>(props: SelectOptionGroupProps<T> & RefAttributes<HTMLDivElement>) => JSX.Element;

export declare interface SelectOptionGroupProps<T> extends ListBoxSectionProps<T>, Omit<SelectOptionGroupSlotProps, keyof ListBoxSectionProps<T>> {
    /** the label for the section */
    label: string;
}

declare interface SelectOptionGroupSlotProps extends HTMLChakraProps<"div"> {
}

export declare interface SelectOptionProps<T> extends Omit<ListBoxItemProps<T>, keyof SelectOptionSlotProps>, SelectOptionSlotProps {
}

export declare const _SelectOptions: <T extends object>(props: SelectOptionsProps<T> & RefAttributes<HTMLDivElement>) => JSX.Element;

declare interface SelectOptionSlotProps extends HTMLChakraProps<"div"> {
}

export declare interface SelectOptionsProps<T> extends ListBoxProps<T>, Omit<SelectOptionsSlotProps, keyof ListBoxProps<T>> {
}

declare interface SelectOptionsSlotProps extends HTMLChakraProps<"div"> {
}

export declare const _SelectRoot: ForwardRefExoticComponent<SelectRootProps & RefAttributes<HTMLDivElement>>;

export declare interface SelectRootProps extends SelectRootSlotProps, SelectProps {
    /** set to true if Select is currently busy with something */
    isLoading?: boolean;
    /** Children must be ReactNode, no render props/functions allowed */
    children: ReactNode;
}

declare interface SelectRootSlotProps extends HTMLChakraProps<"div", RecipeVariantProps<typeof selectSlotRecipe> & SelectProps<object>> {
}

/**
 * Recipe configuration for the Select component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
declare const selectSlotRecipe: SlotRecipeDefinition<"option" | "root" | "trigger" | "triggerLabel" | "options" | "optionGroup", {
size: {
sm: {
root: {};
trigger: {
h: "800";
px: "400";
textStyle: "sm";
};
};
md: {
root: {};
trigger: {
h: "1000";
px: "400";
textStyle: "md";
};
};
};
variant: {
outline: {
root: {
bg: "bg";
"&:hover": {
bg: "primary.2";
};
};
trigger: {
"--border-width": "sizes.25";
"--border-color": "colors.neutral.7";
};
};
ghost: {
root: {
bg: "transparent";
"&:hover": {
bg: "primaryAlpha.2";
};
};
trigger: {
"--border-width": "sizes.25";
"--border-color": "transparent";
};
};
};
}>;

export declare const SimpleGrid: ForwardRefExoticComponent<SimpleGridProps & RefAttributes<HTMLDivElement>> & {
    Item: ForwardRefExoticComponent<GridItemProps & RefAttributes<HTMLDivElement>>;
};

/**
 * SimpleGrid
 * ============================================================
 * The SimpleGrid Layout Component provides a flexible and responsive way to structure content.
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 */
export declare interface SimpleGridProps extends SimpleGridProps_2 {
    children?: React.ReactNode;
}

export declare const Stack: ForwardRefExoticComponent<StackProps & RefAttributes<HTMLDivElement>>;

export declare interface StackProps extends StackProps_2 {
    children?: React.ReactNode;
}

export declare const system: SystemContext;

export { Table }

export declare const TableBody: (props: TableBodyProps) => JSX_2.Element;

export declare type TableBodyProps = React.ComponentProps<typeof Table.Body>;

export declare const TableCell: (props: TableCellProps) => JSX_2.Element;

export declare type TableCellProps = React.ComponentProps<typeof Table.Cell>;

export declare const TableColumn: (props: TableColumnProps) => JSX_2.Element;

export declare const TableColumnGroup: (props: TableColumnGroupProps) => JSX_2.Element;

export declare type TableColumnGroupProps = React.ComponentProps<typeof Table.ColumnGroup>;

export declare const TableColumnHeader: (props: TableColumnHeaderProps) => JSX_2.Element;

export declare type TableColumnHeaderProps = React.ComponentProps<typeof Table.ColumnHeader>;

export declare type TableColumnProps = React.ComponentProps<typeof Table.Column>;

export declare const TableFooter: (props: TableFooterProps) => JSX_2.Element;

export declare type TableFooterProps = React.ComponentProps<typeof Table.Footer>;

export declare const TableHeader: (props: TableHeaderProps) => JSX_2.Element;

export declare type TableHeaderProps = React.ComponentProps<typeof Table.Header>;

export declare const TableRoot: (props: TableRootProps) => JSX_2.Element;

export declare type TableRootProps = React.ComponentProps<typeof Table.Root>;

export declare const TableRow: (props: TableRowProps) => JSX_2.Element;

export declare type TableRowProps = React.ComponentProps<typeof Table.Row>;

/**
 * Render Text
 *
 * Use this component to render text. Various props can be passed to customize the text.
 * Check the documentation for more information.
 *
 * @see https://DOMAIN/components/typography/text
 */
declare const Text_2: ForwardRefExoticComponent<TextProps & RefAttributes<HTMLParagraphElement>>;
export { Text_2 as Text }

/**
 * TextInput
 * ============================================================
 * An input component that takes in a text as input
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLInputElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 */
export declare const TextInput: ForwardRefExoticComponent<TextInputProps & RefAttributes<HTMLInputElement>>;

export declare interface TextInputProps extends TextFieldProps, Omit<TextInputRootProps, keyof TextFieldProps | "as" | "asChild"> {
}

/**
 * Recipe configuration for the TextInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
declare const textInputRecipe: RecipeDefinition<    {
size: {
sm: {
h: number;
textStyle: "sm";
px: number;
};
md: {
h: number;
textStyle: "md";
px: number;
};
};
variant: {
solid: {
"--border-width": "sizes.25";
"--border-color": "colors.neutral.7";
backgroundColor: "neutral.1";
_hover: {
backgroundColor: "primary.2";
};
};
ghost: {
_hover: {
backgroundColor: "primary.2";
};
};
};
}>;

declare interface TextInputRecipeProps extends RecipeVariantProps<typeof textInputRecipe>, UnstyledProp {
}

declare type TextInputRootProps = HTMLChakraProps<"input", TextInputRecipeProps>;

export declare interface TextProps extends TextProps_2 {
}

/**
 * Tooltip
 * ============================================================
 * A contextual popup that displays a description for an element, uses `Tooltip` component from `react-aria-components`.
 *
 * Features:
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - allows overriding styles by using style-props
 *
 * Further Context:
 * - [React Aria Components Tooltip Documentation](https://react-spectrum.adobe.com/react-aria/Tooltip.html)
 * - [ARIA Tooltip Pattern](https://www.w3.org/TR/wai-aria-1.2/#tooltip)
 */
export declare const Tooltip: ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLDivElement>>;

/**
 * Main props interface for the Tooltip components
 * Extends TooltipVariantProps to include root props, variant props,
 * and react-aria props, while adding support for React children.
 */
export declare interface TooltipProps extends PropsWithChildren<TooltipVariantProps> {
}

/**
 * Recipe configuration for the Tooltip component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
declare const tooltipRecipe: RecipeDefinition<RecipeVariantRecord>;

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 */
declare interface TooltipRecipeProps extends RecipeProps<"div">, UnstyledProp {
}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
declare interface TooltipRootProps extends HTMLChakraProps<"div", TooltipRecipeProps> {
}

/**
 * TooltipTrigger
 * ============================================================
 * TooltipTrigger wraps around a trigger element and a Tooltip.
 * It handles opening and closing the Tooltip when the user hovers over or focuses the trigger,
 * and positioning the Tooltip relative to the trigger.
 *
 * Directly exported from `react-aria-components`
 * - [React Aria Components Tooltip Documentation](https://react-spectrum.adobe.com/react-aria/Tooltip.html)
 */
export declare const TooltipTrigger: typeof TooltipTrigger_2;

export declare interface TooltipTriggerProps extends TooltipTriggerComponentProps {
}

/**
 * Combines the root props with Chakra UI's recipe variant props, and
 * react-aria-component's TooltipProps
 * This allows the component to accept:
 * - structural props from Root
 * - styling variants from the recipe
 * - a11y/state related props from react-aria-components Tooltip
 */
declare type TooltipVariantProps = ExcludePolymorphicFromProps<TooltipRootProps & RecipeVariantProps<typeof tooltipRecipe> & TooltipProps_2>;

export declare function UiKitProvider({ children, ...props }: ColorModeProviderProps): JSX_2.Element;

export declare function useColorMode(): {
    colorMode: string | undefined;
    setColorMode: Dispatch<SetStateAction<string>>;
    toggleColorMode: () => void;
};

export declare function useColorModeValue<T>(light: T, dark: T): T;

export declare function useColorScheme(): string;

export { useCopyToClipboard }

export { useHotkeys }

export declare const VisuallyHidden: {
    (props: VisuallyHiddenProps): JSX_2.Element;
    displayName: string;
};

export declare interface VisuallyHiddenProps extends Omit<VisuallyHiddenProps_2, "elementType"> {
    /** specifies the element type to render, use `span` for inline content
     * and `div` for block content */
    as?: "span" | "div";
}

export { }


declare namespace n$ {
    let displayName: any;
}
