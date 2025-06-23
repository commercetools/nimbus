import type { ReactNode } from "react";

type FormFieldInfoBoxProps = {
  /**
   * The content to display in the InfoBox
   */
  children: ReactNode;
};

export const FormFieldInfoBox = ({
  children: _children, // eslint-disable-line @typescript-eslint/no-unused-vars
}: FormFieldInfoBoxProps) => {
  // This component now acts as a declarative marker for the FormFieldRoot
  // The actual rendering is handled by FormFieldRoot through children analysis
  // This approach is SSR-safe as it doesn't rely on useEffect or useState
  return null;
};
