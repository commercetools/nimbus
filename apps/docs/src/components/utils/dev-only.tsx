import React from "react";

/**
 * Props for the DevOnly component.
 */
interface DevOnlyProps {
  children: React.ReactNode;
}

/**
 * A component that renders its children only in non-production environments.
 *
 * @component
 * @param {DevOnlyProps} props - The props for the component.
 * @returns {React.ReactNode | null} - The children if not in production, otherwise null.
 */
export const DevOnly: React.FC<DevOnlyProps> = ({ children }) => {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  return <>{children}</>;
};
