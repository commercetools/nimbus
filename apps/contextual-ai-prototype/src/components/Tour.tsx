import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { Box, Flex, Text, Button, Badge } from "@commercetools/nimbus";
import { AiDot } from "./AiDot";

interface TourStep {
  /** CSS selector for the element to spotlight */
  selector: string;
  /** Title of the step */
  title: string;
  /** Explanation text */
  description: string;
  /** Which render target type this demonstrates */
  renderTarget?: "panel" | "inline" | "augmentation" | "all";
  /** Position of the popover relative to the spotlight */
  placement?: "top" | "bottom" | "left" | "right";
}

interface TourContextValue {
  startTour: (steps: TourStep[]) => void;
  endTour: () => void;
  isActive: boolean;
}

const TourContext = createContext<TourContextValue>({
  startTour: () => {},
  endTour: () => {},
  isActive: false,
});

export const useTour = () => useContext(TourContext);

const renderTargetColors: Record<string, string> = {
  panel: "indigo",
  inline: "teal",
  augmentation: "amber",
  all: "neutral",
};

const renderTargetLabels: Record<string, string> = {
  panel: "Panel render target",
  inline: "Inline render target",
  augmentation: "Augmentation render target",
  all: "All render targets",
};

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isActive = currentStep >= 0 && currentStep < steps.length;
  const step = isActive ? steps[currentStep] : null;

  const measureElement = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.selector);
    if (el) {
      const r = el.getBoundingClientRect();
      setRect(r);
      // Scroll element into view if needed
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [step]);

  useEffect(() => {
    if (isActive) {
      // Small delay to let the page settle after navigation
      const timer = setTimeout(measureElement, 300);
      window.addEventListener("resize", measureElement);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", measureElement);
      };
    }
  }, [isActive, measureElement, currentStep]);

  const startTour = useCallback((tourSteps: TourStep[]) => {
    setSteps(tourSteps);
    setCurrentStep(0);
  }, []);

  const endTour = useCallback(() => {
    setCurrentStep(-1);
    setSteps([]);
    setRect(null);
  }, []);

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      endTour();
    }
  }, [currentStep, steps.length, endTour]);

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  // Compute popover position
  const pad = 12;
  const popoverStyle: React.CSSProperties = {};
  if (rect && step) {
    const placement = step.placement ?? "bottom";
    if (placement === "bottom") {
      popoverStyle.top = rect.bottom + pad;
      popoverStyle.left = rect.left;
    } else if (placement === "top") {
      popoverStyle.bottom = window.innerHeight - rect.top + pad;
      popoverStyle.left = rect.left;
    } else if (placement === "right") {
      popoverStyle.top = rect.top;
      popoverStyle.left = rect.right + pad;
    } else if (placement === "left") {
      popoverStyle.top = rect.top;
      popoverStyle.right = window.innerWidth - rect.left + pad;
    }
  }

  return (
    <TourContext.Provider value={{ startTour, endTour, isActive }}>
      {children}

      {/* Spotlight overlay */}
      {isActive && rect && step && (
        <Box
          ref={overlayRef}
          position="fixed"
          inset="0"
          zIndex={9999}
          pointerEvents="auto"
          css={{ animation: "fadeIn 200ms ease" }}
        >
          {/* Dark overlay with spotlight cutout via box-shadow */}
          <Box
            position="fixed"
            inset="0"
            css={{
              boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.45)`,
              pointerEvents: "none",
            }}
          />

          {/* Spotlight ring around the element */}
          <Box
            position="fixed"
            borderRadius="200"
            borderWidth="2px"
            borderColor="indigo.9"
            pointerEvents="none"
            transition="all 300ms ease"
            css={{
              top: `${rect.top - 4}px`,
              left: `${rect.left - 4}px`,
              width: `${rect.width + 8}px`,
              height: `${rect.height + 8}px`,
              boxShadow: "0 0 0 4px rgba(110, 86, 207, 0.2), 0 0 0 9999px rgba(0, 0, 0, 0.45)",
            }}
          />

          {/* Popover */}
          <Box
            position="fixed"
            bg="white"
            borderRadius="300"
            shadow="lg"
            p="400"
            maxWidth="340px"
            zIndex={10000}
            css={{
              ...popoverStyle,
              animation: "fadeIn 200ms ease 100ms both",
            }}
          >
            <Flex alignItems="center" gap="200" mb="200">
              <AiDot size="14px" />
              <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
                {step.title}
              </Text>
              {step.renderTarget && (
                <Badge size="2xs" colorPalette={renderTargetColors[step.renderTarget] as any}>
                  {renderTargetLabels[step.renderTarget]}
                </Badge>
              )}
            </Flex>

            <Text textStyle="sm" color="neutral.11" mb="300" lineHeight="tall">
              {step.description}
            </Text>

            <Flex justifyContent="space-between" alignItems="center">
              <Text textStyle="xs" color="neutral.9">
                {currentStep + 1} of {steps.length}
              </Text>
              <Flex gap="200">
                {currentStep > 0 && (
                  <Button variant="ghost" size="2xs" onClick={prev}>
                    Back
                  </Button>
                )}
                <Button variant="solid" colorPalette="primary" size="2xs" onClick={next}>
                  {currentStep === steps.length - 1 ? "Done" : "Next"}
                </Button>
              </Flex>
            </Flex>
          </Box>

          {/* Click shield (click anywhere to advance) */}
          <Box
            position="fixed"
            inset="0"
            zIndex={9998}
            cursor="pointer"
            onClick={next}
          />
        </Box>
      )}
    </TourContext.Provider>
  );
}
