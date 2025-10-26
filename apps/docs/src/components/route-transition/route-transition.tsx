/**
 * Route Transition Component
 *
 * Adds smooth fade transitions between route changes
 */

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@commercetools/nimbus";

interface RouteTransitionProps {
  children: React.ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<"fadeIn" | "fadeOut">(
    "fadeIn"
  );

  useEffect(() => {
    if (location !== displayLocation) {
      // Fade out current content
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  const handleTransitionEnd = () => {
    if (transitionStage === "fadeOut") {
      // Update content and fade in
      setDisplayLocation(location);
      setTransitionStage("fadeIn");
    }
  };

  return (
    <Box
      width="full"
      height="full"
      opacity={transitionStage === "fadeIn" ? "1" : "0"}
      transition="opacity 200ms ease-in-out"
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </Box>
  );
}
