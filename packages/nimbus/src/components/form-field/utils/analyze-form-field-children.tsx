import { Children, isValidElement, type ReactNode } from "react";
import type { FormFieldChildrenAnalysis } from "../components/form-field.context";
import { FormFieldLabel } from "../components/form-field.label";
import { FormFieldInput } from "../components/form-field.input";
import { FormFieldDescription } from "../components/form-field.description";
import { FormFieldError } from "../components/form-field.error";
import { FormFieldInfoBox } from "../components/form-field.info-box";

/**
 * Analyzes FormField children to extract content and determine what components are present.
 * This enables SSR-safe rendering by analyzing the component tree at render time
 * instead of relying on useEffect registration.
 */
export function analyzeFormFieldChildren(
  children: ReactNode
): FormFieldChildrenAnalysis {
  const analysis: FormFieldChildrenAnalysis = {
    labelContent: null,
    inputContent: null,
    descriptionContent: null,
    errorContent: null,
    infoContent: null,
    hasLabel: false,
    hasDescription: false,
    hasError: false,
    hasInfo: false,
  };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    // Check component type and extract content
    if (child.type === FormFieldLabel) {
      analysis.labelContent = (
        child.props as { children?: ReactNode }
      ).children;
      analysis.hasLabel = true;
    } else if (child.type === FormFieldInput) {
      analysis.inputContent = (
        child.props as { children?: ReactNode }
      ).children;
    } else if (child.type === FormFieldDescription) {
      analysis.descriptionContent = (
        child.props as { children?: ReactNode }
      ).children;
      analysis.hasDescription = true;
    } else if (child.type === FormFieldError) {
      analysis.errorContent = (
        child.props as { children?: ReactNode }
      ).children;
      analysis.hasError = true;
    } else if (child.type === FormFieldInfoBox) {
      analysis.infoContent = (child.props as { children?: ReactNode }).children;
      analysis.hasInfo = true;
    }
  });

  return analysis;
}
