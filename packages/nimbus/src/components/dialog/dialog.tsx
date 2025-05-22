import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react";
import { forwardRef } from "react";

interface DialogContentProps extends ChakraDialog.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  backdrop?: boolean;
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    const {
      children,
      portalled = true,
      portalRef,
      backdrop = true,
      ...rest
    } = props;

    return (
      <Portal disabled={!portalled} container={portalRef}>
        {backdrop && <ChakraDialog.Backdrop />}
        <ChakraDialog.Positioner>
          <ChakraDialog.Content ref={ref} {...rest} asChild={false}>
            {children}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    );
  }
);

// Create a type-safe composite object with explicit component definitions
interface DialogComponents {
  Root: typeof ChakraDialog.Root;
  Trigger: typeof ChakraDialog.Trigger;
  Content: typeof DialogContent;
  Backdrop: typeof ChakraDialog.Backdrop;
  Positioner: typeof ChakraDialog.Positioner;
  Title: typeof ChakraDialog.Title;
  Description: typeof ChakraDialog.Description;
  Body: typeof ChakraDialog.Body;
  Footer: typeof ChakraDialog.Footer;
  Header: typeof ChakraDialog.Header;
  CloseTrigger: typeof ChakraDialog.CloseTrigger;
  ActionTrigger: typeof ChakraDialog.ActionTrigger;
}

// Export the Dialog composite with proper typing
export const Dialog: DialogComponents = {
  Root: ChakraDialog.Root,
  Trigger: ChakraDialog.Trigger,
  Content: DialogContent,
  Backdrop: ChakraDialog.Backdrop,
  Positioner: ChakraDialog.Positioner,
  Title: ChakraDialog.Title,
  Description: ChakraDialog.Description,
  Body: ChakraDialog.Body,
  Footer: ChakraDialog.Footer,
  Header: ChakraDialog.Header,
  CloseTrigger: ChakraDialog.CloseTrigger,
  ActionTrigger: ChakraDialog.ActionTrigger,
};
