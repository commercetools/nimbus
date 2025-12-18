import React, { Component, type ReactNode } from "react";
import { Box, Text } from "@commercetools/nimbus";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for catching React rendering errors in UI components
 */
export class UIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("❌ UI Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box padding="400" backgroundColor="critical.2" borderRadius="200">
          <Text color="critical.11" fontWeight="bold" marginBottom="200">
            Error rendering UI component
          </Text>
          <Text fontSize="sm" color="critical.10">
            {this.state.error?.message || "Unknown error"}
          </Text>
        </Box>
      );
    }

    return this.props.children;
  }
}
