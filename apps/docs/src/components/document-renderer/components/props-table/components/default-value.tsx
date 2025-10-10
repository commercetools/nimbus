import React, { ReactNode } from "react";

type DefaultValueProps = {
  value: ReactNode | { value?: string | number | boolean | null };
};

/**
 * Component for properly rendering default values in the props table
 */
export const DefaultValue = ({ value }: DefaultValueProps) => {
  if (value === null || value === undefined) {
    return <>—</>;
  }

  if (typeof value === "object" && value !== null && "value" in value) {
    // Handle case where value is an object with a value property
    const innerValue = value.value;
    if (innerValue === null || innerValue === undefined) {
      return <>—</>;
    }

    return typeof innerValue === "object" ? (
      <>{JSON.stringify(innerValue)}</>
    ) : (
      <>{String(innerValue)}</>
    );
  }

  if (React.isValidElement(value)) {
    return <>{value}</>;
  }

  // Convert to string for primitive values or handle other cases
  return typeof value === "object" ? (
    <>{JSON.stringify(value)}</>
  ) : (
    <>{String(value)}</>
  );
};
