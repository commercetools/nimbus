import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type ModalPageRecipeProps = UnstyledProp;

// ============================================================
// SLOT PROPS
// (used internally by createSlotRecipeContext — not part of the public API)
// ============================================================

export type ModalPageRootSlotProps = HTMLChakraProps<
  "div",
  ModalPageRecipeProps
>;
export type ModalPageTopBarSlotProps = HTMLChakraProps<"div">;
export type ModalPageHeaderSlotProps = HTMLChakraProps<"header">;
export type ModalPageTitleSlotProps = HTMLChakraProps<"div">;
export type ModalPageActionsSlotProps = HTMLChakraProps<"div">;
export type ModalPageContentSlotProps = HTMLChakraProps<"div">;
export type ModalPageFooterSlotProps = HTMLChakraProps<"footer">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for ModalPage.Root
 *
 * ModalPage.Root renders a Drawer internally — it does not expose Drawer or
 * div style props. The fullscreen layout is hardcoded; only the listed props
 * are accepted.
 */
export type ModalPageRootProps = {
  /** Whether the modal page is open (controlled) */
  isOpen: boolean;
  /** Callback fired when the modal page should close */
  onClose: () => void;
  /** Child components — TopBar, Header, Content, Footer */
  children: React.ReactNode;
  /** Ref forwarded to the inner grid container */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for ModalPage.TopBar
 */
export type ModalPageTopBarProps =
  OmitInternalProps<ModalPageTopBarSlotProps> & {
    /** Label of the previous page shown in the back navigation button (e.g. "Products") */
    previousPathLabel: string;
    /** Label of the current page shown in the breadcrumb (e.g. "Edit Product") */
    currentPathLabel: string;
    /** Ref forwarded to the top bar container */
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * Props for ModalPage.Header
 */
export type ModalPageHeaderProps =
  OmitInternalProps<ModalPageHeaderSlotProps> & {
    /** Header content — typically ModalPage.Title and ModalPage.Actions */
    children: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
  };

/**
 * Props for ModalPage.Title
 */
export type ModalPageTitleProps = OmitInternalProps<ModalPageTitleSlotProps> & {
  /** Main title text */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for ModalPage.Actions
 */
export type ModalPageActionsProps =
  OmitInternalProps<ModalPageActionsSlotProps> & {
    /** Action button elements displayed in the header right column */
    children: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * Props for ModalPage.Content
 */
export type ModalPageContentProps =
  OmitInternalProps<ModalPageContentSlotProps> & {
    /**
     * Width constraint variant forwarded to PageContent.Root
     * @default "wide"
     */
    variant?: SlotRecipeProps<"nimbusPageContent">["variant"];
    /**
     * Column layout forwarded to PageContent.Root
     * @default "1"
     */
    columns?: SlotRecipeProps<"nimbusPageContent">["columns"];
    /** Page content — forms, tables, read-only fields, or any layout content */
    children: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * Props for ModalPage.Footer
 */
export type ModalPageFooterProps =
  OmitInternalProps<ModalPageFooterSlotProps> & {
    /** Footer content — typically save/cancel action buttons */
    children: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
  };
