import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Box, Flex, Text, Button } from "@commercetools/nimbus";
import { ProvenanceBadge } from "./ProvenanceBadge";

export interface TourStep {
  selector: string;
  title: string;
  description: string;
  renderTarget?: "panel" | "inline" | "augmentation" | "all";
  placement?: "top" | "bottom" | "left" | "right";
  /** Action to animate when entering this step (before dialog shows) */
  action?: "openPanel" | "pulseElement" | "highlightStars";
  /** If set, navigate to this path before showing the step */
  navigateTo?: string;
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

const DIALOG_W = 340;
const DIALOG_H_EST = 300;
const GAP = 16;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(val, max));
}

function dialogPosition(rect: DOMRect, placement: string) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top: number, left: number;

  // Auto-flip vertical placements when the dialog would overflow
  let resolved = placement;
  if (resolved === "bottom" && rect.bottom + GAP + DIALOG_H_EST > vh - 12) {
    resolved = "top";
  } else if (resolved === "top" && rect.top - GAP - DIALOG_H_EST < 12) {
    resolved = "bottom";
  }

  switch (resolved) {
    case "top":
      top = rect.top - GAP - DIALOG_H_EST;
      left = rect.left + rect.width / 2 - DIALOG_W / 2;
      if (top < 12) top = 12;
      break;
    case "left":
      top = rect.top + rect.height / 2 - 80;
      left = rect.left - DIALOG_W - GAP;
      if (left < 12) left = rect.right + GAP;
      break;
    case "right":
      top = rect.top + rect.height / 2 - 80;
      left = rect.right + GAP;
      if (left + DIALOG_W > vw - 12) left = rect.left - DIALOG_W - GAP;
      break;
    default: // bottom
      top = rect.bottom + GAP;
      left = rect.left + rect.width / 2 - DIALOG_W / 2;
      break;
  }

  return {
    top: clamp(top, 12, vh - DIALOG_H_EST),
    left: clamp(left, 12, vw - DIALOG_W - 12),
  };
}

/** Run a step's enter animation. Returns a promise that resolves when done. */
function runAction(step: TourStep): Promise<void> {
  return new Promise((resolve) => {
    if (!step.action) {
      resolve();
      return;
    }

    if (step.action === "openPanel") {
      window.dispatchEvent(new CustomEvent("tour:openPanel"));
      setTimeout(resolve, 800);
      return;
    }

    if (step.action === "pulseElement") {
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (el) {
        el.style.transition = "box-shadow 500ms ease, transform 500ms ease";
        el.style.boxShadow =
          "0 0 0 6px rgba(110, 86, 207, 0.5), 0 0 20px rgba(110, 86, 207, 0.3)";
        el.style.transform = "scale(1.03)";
        setTimeout(() => {
          el.style.transition = "box-shadow 800ms ease, transform 800ms ease";
          el.style.boxShadow = "";
          el.style.transform = "";
          setTimeout(resolve, 400);
        }, 1500);
      } else {
        resolve();
      }
      return;
    }

    if (step.action === "highlightStars") {
      const el = document.querySelector(step.selector);
      if (el) {
        const stars = el.querySelectorAll<HTMLElement>('[aria-hidden="true"]');
        stars.forEach((s) => {
          s.style.transition =
            "transform 500ms ease, color 500ms ease, text-shadow 500ms ease";
          s.style.transform = "scale(2.5)";
          s.style.color = "var(--nimbus-colors-primary-11)";
          s.style.textShadow = "0 0 8px rgba(124, 58, 237, 0.6)";
        });
        setTimeout(() => {
          stars.forEach((s) => {
            s.style.transition =
              "transform 800ms ease, color 800ms ease, text-shadow 800ms ease";
            s.style.transform = "";
            s.style.color = "";
            s.style.textShadow = "";
          });
          setTimeout(resolve, 400);
        }, 1800);
      } else {
        resolve();
      }
      return;
    }

    resolve();
  });
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [endMessage, setEndMessage] = useState(false);

  const isActive = currentStep >= 0 && currentStep < steps.length;
  const step = isActive ? steps[currentStep] : null;

  // Measure the target element and scroll into view
  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(() => {
        const r = el.getBoundingClientRect();
        setRect(r);
      }, 100);
    } else {
      setRect(null);
    }
  }, [step]);

  // When step changes: spotlight the target, run action, show dialog
  useEffect(() => {
    if (!step) return;
    setTransitioning(true);

    const el = document.querySelector(step.selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(() => {
        setRect(el.getBoundingClientRect());
      }, 100);
    } else {
      setRect(null);
    }

    const timer = setTimeout(async () => {
      await runAction(step);
      const target = document.querySelector(step.selector);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "nearest" });
        setTimeout(() => {
          setRect(target.getBoundingClientRect());
          setTransitioning(false);
        }, 200);
      } else {
        setTransitioning(false);
      }
    }, 200);

    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, [step, measure]);

  const startTour = useCallback((tourSteps: TourStep[]) => {
    setSteps(tourSteps);
    setCurrentStep(0);
  }, []);

  const endTour = useCallback(() => {
    setCurrentStep(-1);
    setSteps([]);
    setRect(null);
    setTransitioning(false);
    window.dispatchEvent(new CustomEvent("tour:closePanel"));
    setEndMessage(true);
    setTimeout(() => setEndMessage(false), 8000);
  }, []);

  const next = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      endTour();
      return;
    }
    const currentStepDef = steps[currentStep];
    if (currentStepDef?.navigateTo) {
      // Navigate first, then advance after the new page renders
      window.location.hash = currentStepDef.navigateTo;
      setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, 600);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, steps, endTour]);

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const pos =
    rect && step ? dialogPosition(rect, step.placement ?? "bottom") : null;
  const showDialog = isActive && rect && step && pos && !transitioning;

  return (
    <TourContext.Provider value={{ startTour, endTour, isActive }}>
      {children}

      {isActive && (
        <Box position="fixed" inset="0" zIndex={9999} pointerEvents="none">
          {/* Spotlight + overlay */}
          {rect && (
            <Box
              position="fixed"
              borderRadius="200"
              borderWidth="2px"
              borderColor="primary.9"
              pointerEvents="none"
              transition="all 300ms ease"
              css={{
                top: `${rect.top - 4}px`,
                left: `${rect.left - 4}px`,
                width: `${rect.width + 8}px`,
                height: `${rect.height + 8}px`,
                boxShadow:
                  "0 0 0 4px rgba(124, 58, 237, 0.2), 0 0 0 9999px rgba(0, 0, 0, 0.45)",
              }}
            />
          )}

          {/* Dialog */}
          {showDialog && (
            <Box
              position="fixed"
              bg="white"
              borderRadius="300"
              shadow="lg"
              p="300"
              width={`${DIALOG_W}px`}
              zIndex={10001}
              pointerEvents="auto"
              maxHeight="calc(100vh - 24px)"
              overflow="auto"
              css={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                animation: "fadeIn 250ms ease",
              }}
            >
              <Flex alignItems="center" gap="200" mb="200">
                <ProvenanceBadge size="14px" agentSource="petsmart" />
                <Text textStyle="sm" fontWeight="bold" color="neutral.12">
                  {step.title}
                </Text>
              </Flex>

              <Text
                textStyle="sm"
                color="neutral.11"
                mb="300"
                lineHeight="tall"
              >
                {step.description}
              </Text>

              <Flex justifyContent="space-between" alignItems="center">
                <Text textStyle="xs" color="neutral.9">
                  {currentStep + 1} of {steps.length}
                </Text>
                <Flex gap="200">
                  {currentStep > 0 && (
                    <Button variant="ghost" size="xs" onPress={prev}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="solid"
                    colorPalette="primary"
                    size="xs"
                    onPress={next}
                  >
                    {currentStep === steps.length - 1 ? "Done" : "Next"}
                  </Button>
                </Flex>
              </Flex>
            </Box>
          )}

          {/* No click interceptor — users can interact with the page while tour is active */}
        </Box>
      )}

      {/* Post-tour nudge */}
      {endMessage && (
        <Box
          position="fixed"
          top="60px"
          left="56px"
          zIndex={9999}
          bg="primary.2"
          px="300"
          py="200"
          borderRadius="200"
          shadow="lg"
          borderWidth="1px"
          borderColor="primary.6"
          css={{ animation: "fadeIn 300ms ease" }}
          cursor="pointer"
          onClick={() => setEndMessage(false)}
        >
          <Text textStyle="xs" color="primary.12">
            ← Click to go home when you're done exploring
          </Text>
        </Box>
      )}
    </TourContext.Provider>
  );
}

// Inject fadeIn animation
if (typeof document !== "undefined") {
  const styleId = "tour-fade-keyframes";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}
