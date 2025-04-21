import React from "react";
import { Box, Badge } from "@commercetools/nimbus";
import { WarningAmber } from "@commercetools/nimbus-icons";
import { ComponentStatus as ComponentStatusType } from "@/schemas/mdx-document-status";

// Define the shape of the props
interface ComponentStatusProps {
  status: ComponentStatusType | null;
  showLabel?: boolean;
}

// Map of status to metadata
const statusMetadata = {
  Experimental: {
    label: "Experimental",
    description:
      "Early-stage implementation with minimal testing. No guarantees about API stability.",
    color: "orange",
    progressValue: 20,
  },
  Alpha: {
    label: "Alpha",
    description:
      "Core functionality implemented with basic testing. API likely to change significantly.",
    color: "amber",
    progressValue: 40,
  },
  Beta: {
    label: "Beta",
    description:
      "Feature complete with tests. API mostly stable but may still change.",
    color: "blue",
    progressValue: 60,
  },
  ReleaseCandidate: {
    label: "RC",
    description:
      "Fully implemented and tested with frozen API. Safe for production use.",
    color: "green",
    progressValue: 80,
  },
  Stable: {
    label: "Stable",
    description:
      "Production-ready with full support. API stable with semantic versioning.",
    color: "success",
    progressValue: 100,
  },
  Deprecated: {
    label: "Deprecated",
    description:
      "No longer recommended for use. Will be removed in a future version.",
    color: "red",
    progressValue: 0,
  },
};

export const ComponentStatus: React.FC<ComponentStatusProps> = ({
  status,
  showLabel = true,
}) => {
  // If status is null or undefined
  if (!status) {
    return <Box as={WarningAmber} textStyle="xl" color="error.11" />;
  }

  const metadata = statusMetadata[status];

  return (
    <Badge size="2xs" colorPalette={metadata.color}>
      {showLabel && metadata.label}
    </Badge>
  );
};
