import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
  isValidElement,
  cloneElement,
  Children,
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
import { useLabel } from "react-aria";

const FormFieldContext = createContext({});

/**
 * FormField
 * ============================================================
 * displays inputs in a FormField context
 */
export const FormFieldRoot = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { isInvalid, isRequired, isDisabled, isReadOnly, children, ...props },
    ref
  ) => {
    const [context, setContext] = useState({
      label: null,
      description: null,
      error: null,
      info: null,
      input: null,
      isInvalid,
      isRequired,
      isDisabled,
      isReadOnly,
    });

    const { labelProps, fieldProps } = useLabel({
      label: context.label,
      ...props,
    });

    useEffect(() => {
      setContext((prevContext) => ({
        ...prevContext,
        isInvalid,
        isRequired,
        isDisabled,
        isReadOnly,
      }));
    }, [isInvalid, isRequired, isDisabled, isReadOnly]);

    const inputProps = {
      ...fieldProps,
      isInvalid,
      isRequired,
      isDisabled,
      isReadOnly,
    };

    return (
      <FormFieldContext.Provider value={[context, setContext]}>
        <FormFieldRootSlot ref={ref} {...props}>
          {context.label && (
            <FormFieldLabelSlot>
              <label {...labelProps}>
                {context.label}
                {isRequired && <sup aria-hidden="true">*</sup>}
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

          {context.input && (
            <FormFieldInputSlot>
              {Children.map(context.input, (child) => {
                // Important: Check if the child is a valid React element before cloning.
                if (isValidElement(child)) {
                  return cloneElement(child, inputProps);
                }
                // If it's not a valid element (e.g., text node, null, undefined), return it as is.
                return child;
              })}
            </FormFieldInputSlot>
          )}
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
  const [, setContext] = useContext(FormFieldContext);

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

function FormFieldInput({ children }) {
  const [, setContext] = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({ ...prevContext, input: children }));
  }, [children, setContext]);

  return null;
}

export const FormField = {
  Root: FormFieldRoot,
  Label: FormFieldLabel,
  Input: FormFieldInput,
  Description: FormFieldDescription,
  Error: FormFieldError,
  InfoBox: FormFieldInfoBox,
};
