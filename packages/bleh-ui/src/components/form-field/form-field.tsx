import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FormFieldDescriptionSlot,
  FormFieldErrorSlot,
  FormFieldInputSlot,
  FormFieldLabelSlot,
  FormFieldPopoverSlot,
  FormFieldRootSlot,
} from "./form-field.slots";
import type { FormFieldProps } from "./form-field.types";
import { ErrorOutline, HelpOutline } from "@bleh-ui/icons";
import { Box, IconButton } from "@/components";

import { Dialog, DialogTrigger, Popover } from "react-aria-components";

const FormFieldContext = createContext({});

/**
 * FormField
 * ============================================================
 * displays inputs in a FormField context
 */
export const FormFieldRoot = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ isInvalid, isRequired, isDisabled, children, ...props }, ref) => {
    const [context, setContext] = useState({
      label: null,
      description: null,
      error: null,
      info: null,
      isInvalid,
      isRequired,
      isDisabled,
    });

    useEffect(() => {
      setContext((prevContext) => ({
        ...prevContext,
        isInvalid,
        isRequired,
        isDisabled,
      }));
    }, [isInvalid, isRequired, isDisabled]);

    return (
      <FormFieldContext.Provider value={[context, setContext]}>
        <FormFieldRootSlot ref={ref} {...props}>
          {context.label && (
            <FormFieldLabelSlot>
              <label>
                {context.label}
                {isRequired && <sup>*</sup>}
              </label>
              {context.info && (
                <DialogTrigger>
                  <Box
                    as="span"
                    display="inline-block"
                    position="relative"
                    width="1ch"
                    height="1ch"
                    ml="200"
                  >
                    <Box
                      as="span"
                      display="flex"
                      position="absolute"
                      top="50%"
                      right="50%"
                      transform="translate(50%, -50%)"
                    >
                      <IconButton
                        aria-label="__MORE INFO"
                        size="2xs"
                        tone="info"
                        variant="link"
                      >
                        <HelpOutline />
                      </IconButton>
                    </Box>
                  </Box>
                  <Popover>
                    <FormFieldPopoverSlot asChild>
                      <Dialog>
                        <Box p="300">{context.info}</Box>
                      </Dialog>
                    </FormFieldPopoverSlot>
                  </Popover>
                </DialogTrigger>
              )}
            </FormFieldLabelSlot>
          )}
          {context.description && (
            <FormFieldDescriptionSlot>
              {context.description}
            </FormFieldDescriptionSlot>
          )}
          {isInvalid && context.error && (
            <FormFieldErrorSlot>
              <Box
                as={ErrorOutline}
                display="inline-flex"
                boxSize="400"
                verticalAlign="text-bottom"
                mr="100"
              />
              {context.error}
            </FormFieldErrorSlot>
          )}
          {children}
        </FormFieldRootSlot>
      </FormFieldContext.Provider>
    );
  }
);

function FormFieldLabel({ children }) {
  const [, setContext] = useContext<object>(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({ ...prevContext, label: children }));
  }, [children, setContext]);

  return null;
}

function FormFieldDescription({ children }) {
  const [context, setContext] = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({ ...prevContext, description: children }));
  }, [children, setContext]);

  return null;
}

function FormFieldError({ children }) {
  const [, setContext] = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({ ...prevContext, error: children }));
  }, [children, setContext]);

  return null;
}

function FormFieldInfoBox({ children }) {
  const [, setContext] = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({ ...prevContext, info: children }));
  }, [children, setContext]);

  return null;
}

export const FormField = {
  Root: FormFieldRoot,
  Label: FormFieldLabel,
  Input: FormFieldInputSlot,
  Description: FormFieldDescription,
  Error: FormFieldError,
  InfoBox: FormFieldInfoBox,
};
