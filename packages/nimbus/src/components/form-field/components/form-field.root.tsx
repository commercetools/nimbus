import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
} from "react";
import type { FormFieldProps } from "../form-field.types";
import { useField } from "react-aria";
import {
  FormFieldContext,
  type FormFieldContextValue,
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
import { analyzeFormFieldChildren } from "../utils/analyze-form-field-children";

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
    // Analyze children to extract content and determine structure
    const childrenAnalysis = useMemo(
      () => analyzeFormFieldChildren(children),
      [children]
    );

    // Prepare useField arguments based on analyzed children
    const useFieldArgs = useMemo(() => {
      const args: Parameters<typeof useField>[0] = {};

      if (childrenAnalysis.hasDescription) {
        args.description = childrenAnalysis.descriptionContent;
      }

      if (childrenAnalysis.hasError && isInvalid) {
        args.errorMessage = childrenAnalysis.errorContent;
      }

      if (childrenAnalysis.hasLabel) {
        args.label = childrenAnalysis.labelContent;
      } else {
        // Fallback for accessibility when no label is provided
        args["aria-label"] = "form field";
      }

      return args;
    }, [childrenAnalysis, isInvalid]);

    // Get React Aria field props
    const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
      useField(useFieldArgs);

    // Create context value for child components
    const contextValue: FormFieldContextValue = useMemo(
      () => ({
        labelProps,
        fieldProps: {
          ...fieldProps,
          isInvalid,
          isRequired,
          isDisabled,
          isReadOnly,
        },
        descriptionProps,
        errorMessageProps,
        isInvalid,
        isRequired,
        isDisabled,
        isReadOnly,
        hasLabel: childrenAnalysis.hasLabel,
        hasDescription: childrenAnalysis.hasDescription,
        hasError: childrenAnalysis.hasError,
        hasInfo: childrenAnalysis.hasInfo,
      }),
      [
        labelProps,
        fieldProps,
        descriptionProps,
        errorMessageProps,
        isInvalid,
        isRequired,
        isDisabled,
        isReadOnly,
        childrenAnalysis,
      ]
    );

    return (
      <FormFieldContext.Provider value={contextValue}>
        <FormFieldRootSlot ref={ref} {...props}>
          {/* Render label if present */}
          {childrenAnalysis.hasLabel && (
            <FormFieldLabelSlot>
              <label {...labelProps}>
                {childrenAnalysis.labelContent}
                {isRequired && <sup aria-hidden="true">*</sup>}
              </label>
              {/* Render info popover if present */}
              {childrenAnalysis.hasInfo && (
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
                        variant="ghost"
                      >
                        <HelpOutline />
                      </IconButton>
                    </Box>
                  </Box>
                  <Popover>
                    <FormFieldPopoverSlot asChild>
                      <Dialog>
                        <Box p="300">{childrenAnalysis.infoContent}</Box>
                      </Dialog>
                    </FormFieldPopoverSlot>
                  </Popover>
                </DialogTrigger>
              )}
            </FormFieldLabelSlot>
          )}

          {/* Render input if present */}
          {childrenAnalysis.inputContent && (
            <FormFieldInputSlot>
              {Children.map(childrenAnalysis.inputContent, (child) => {
                // Important: Check if the child is a valid React element before cloning.
                if (isValidElement(child)) {
                  return cloneElement(child, contextValue.fieldProps);
                }
                // If it's not a valid element (e.g., text node, null, undefined), return it as is.
                return child;
              })}
            </FormFieldInputSlot>
          )}

          {/* Render description if present */}
          {childrenAnalysis.hasDescription && (
            <FormFieldDescriptionSlot {...descriptionProps}>
              {childrenAnalysis.descriptionContent}
            </FormFieldDescriptionSlot>
          )}

          {/* Render error if present and field is invalid */}
          {isInvalid && childrenAnalysis.hasError && (
            <FormFieldErrorSlot {...errorMessageProps}>
              <Box
                as={ErrorOutline}
                display="inline-flex"
                boxSize="400"
                verticalAlign="text-bottom"
                mr="100"
              />
              {childrenAnalysis.errorContent}
            </FormFieldErrorSlot>
          )}

          {/* Render any additional children that aren't FormField components */}
          {children}
        </FormFieldRootSlot>
      </FormFieldContext.Provider>
    );
  }
);
