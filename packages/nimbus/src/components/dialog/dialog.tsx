import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react";
import { forwardRef } from "react";
import { Button } from "../button";

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

const DialogCloseTrigger = forwardRef<
  HTMLButtonElement,
  ChakraDialog.CloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
  return (
    <ChakraDialog.CloseTrigger
      position="absolute"
      top="2"
      insetEnd="2"
      {...props}
      asChild
    >
      <Button size="xs" ref={ref}>
        {props.children}
      </Button>
    </ChakraDialog.CloseTrigger>
  );
});

const DialogRoot = ChakraDialog.Root;
const DialogFooter = ChakraDialog.Footer;
const DialogHeader = ChakraDialog.Header;
const DialogBody = ChakraDialog.Body;
const DialogBackdrop = ChakraDialog.Backdrop;
const DialogTitle = ChakraDialog.Title;
const DialogDescription = ChakraDialog.Description;
const DialogTrigger = ChakraDialog.Trigger;
const DialogActionTrigger = ChakraDialog.ActionTrigger;

export const Dialog = Object.assign(
  {},
  {
    Root: DialogRoot,
    Content: DialogContent,
    CloseTrigger: DialogCloseTrigger,
    Footer: DialogFooter,
    Header: DialogHeader,
    Body: DialogBody,
    Backdrop: DialogBackdrop,
    Title: DialogTitle,
    Description: DialogDescription,
    Trigger: DialogTrigger,
    ActionTrigger: DialogActionTrigger,
  }
);
