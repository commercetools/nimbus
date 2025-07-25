import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useState,
} from "react";
import type { FormFieldProps } from "../form-field.types";
import { useField } from "react-aria";
import {
  FormFieldContext,
  type FormFieldContextPayloadType,
} from "./form-field.context";
import {
  FormFieldDescriptionSlot,
  FormFieldErrorSlot,
  FormFieldInputSlot,
  FormFieldLabelSlot,
  FormFieldPopoverSlot,
  FormFieldRootSlot,
} from "../form-field.slots";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";
import { Box, IconButton } from "@/components";
import { ErrorOutline, HelpOutline } from "@commercetools/nimbus-icons";

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
    const [context, setContext] = useState<FormFieldContextPayloadType>({
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

    const useFieldArgs: Parameters<typeof useField>[0] = {
      description: context.description,
      errorMessage: context.error,
    };

    if (context.label) {
      useFieldArgs.label = context.label;
    } else {
      // Context will always start out null, so we need to stub out some aria attributes
      // FIXME: This is a hack to get the form field to work, but it's not the best solution
      // FIXME: We should find a better way to handle this by redesigning the FormField component's structure
      useFieldArgs["aria-label"] = "empty-label";
      useFieldArgs["aria-labelledby"] = "empty-label";
    }

    const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
      useField(useFieldArgs);

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
      <FormFieldContext.Provider value={{ context, setContext }}>
        <FormFieldRootSlot ref={ref} {...props}>
          {context.label && (
            <FormFieldLabelSlot {...context.labelSlotProps}>
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
                      display="inline-flex"
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
          {context.input && (
            <FormFieldInputSlot {...context.inputSlotProps}>
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
          {context.description && (
            <FormFieldDescriptionSlot
              {...descriptionProps}
              {...context.descriptionSlotProps}
            >
              {context.description}
            </FormFieldDescriptionSlot>
          )}
          {isInvalid && context.error && (
            <FormFieldErrorSlot
              {...errorMessageProps}
              {...context.errorSlotProps}
            >
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
