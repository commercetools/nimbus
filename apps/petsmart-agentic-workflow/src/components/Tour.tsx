import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { Box, Flex, Text, Button, Badge } from "@commercetools/nimbus";
import { AiDot } from "./AiDot";

export interface TourStep {
  selector: string;
  title: string;
  description: string;
  renderTarget?: "panel" | "inline" | "augmentation" | "all";
  placement?: "top" | "bottom" | "left" | "right";
  /** Action to animate when entering this step (before dialog shows) */
  action?: "openPanel" | "pulseElement" | "highlightStars" | "hoverWaffleCells" | "selectSmartphones" | "revealGenerateSeo" | "expandFirstRow" | "clickSuggestedCondition" | "pulseShelfDaysCells" | "pulseWarningCart";
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

const DIALOG_W = 340;
const DIALOG_H_EST = 300; // conservative estimate for dialog height
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
      if (top < 12) { top = 12; }
      break;
    case "left":
      top = rect.top + rect.height / 2 - 80;
      left = rect.left - DIALOG_W - GAP;
      if (left < 12) { left = rect.right + GAP; }
      break;
    case "right":
      top = rect.top + rect.height / 2 - 80;
      left = rect.right + GAP;
      if (left + DIALOG_W > vw - 12) { left = rect.left - DIALOG_W - GAP; }
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
    if (!step.action) { resolve(); return; }

    if (step.action === "openPanel") {
      window.dispatchEvent(new CustomEvent("tour:openPanel"));
      setTimeout(resolve, 800); // wait for panel slide animation
      return;
    }

    if (step.action === "pulseElement") {
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (el) {
        el.style.transition = "box-shadow 500ms ease, transform 500ms ease";
        el.style.boxShadow = "0 0 0 6px rgba(110, 86, 207, 0.5), 0 0 20px rgba(110, 86, 207, 0.3)";
        el.style.transform = "scale(1.03)";
        // Simulate translate action when pulsing the translate button
        if (step.selector.includes("translate-btn")) {
          window.dispatchEvent(new CustomEvent("tour:translate"));
        }
        setTimeout(() => {
          el.style.transition = "box-shadow 800ms ease, transform 800ms ease";
          el.style.boxShadow = "";
          el.style.transform = "";
          setTimeout(resolve, 400);
        }, 1500);
      } else { resolve(); }
      return;
    }

    if (step.action === "highlightStars") {
      const el = document.querySelector(step.selector);
      if (el) {
        const stars = el.querySelectorAll<HTMLElement>('[aria-hidden="true"]');
        // All at once, more pronounced
        stars.forEach((s) => {
          s.style.transition = "transform 500ms ease, color 500ms ease, text-shadow 500ms ease";
          s.style.transform = "scale(2.5)";
          s.style.color = "var(--nimbus-colors-indigo-11)";
          s.style.textShadow = "0 0 8px rgba(110, 86, 207, 0.6)";
        });
        // If this is the variants table, simulate creating variants
        if (step.selector.includes("variants-table")) {
          window.dispatchEvent(new CustomEvent("tour:createVariants"));
        }
        setTimeout(() => {
          stars.forEach((s) => {
            s.style.transition = "transform 800ms ease, color 800ms ease, text-shadow 800ms ease";
            s.style.transform = "";
            s.style.color = "";
            s.style.textShadow = "";
          });
          setTimeout(resolve, 400);
        }, 1800);
      } else { resolve(); }
      return;
    }

    if (step.action === "hoverWaffleCells") {
      const el = document.querySelector(step.selector);
      if (el) {
        const rects = el.querySelectorAll<SVGRectElement>("figure rect");
        const cells = Array.from(rects).filter(r => {
          const w = r.getAttribute("width");
          const h = r.getAttribute("height");
          return w && h && w === h && r.getAttribute("fill") && r.getAttribute("fill") !== "var(--chart-empty)";
        });
        const targets = [cells[0], cells[22]].filter(Boolean);
        let i = 0;
        const hoverNext = () => {
          if (i >= targets.length) { resolve(); return; }
          const cell = targets[i];
          const rect = cell.getBoundingClientRect();
          const cx = rect.x + rect.width / 2;
          const cy = rect.y + rect.height / 2;
          // Use pointer events which React's event system captures
          cell.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true, clientX: cx, clientY: cy }));
          cell.dispatchEvent(new PointerEvent("pointerover", { bubbles: true, clientX: cx, clientY: cy }));
          cell.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: cx, clientY: cy }));
          cell.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, clientX: cx, clientY: cy }));
          setTimeout(() => {
            cell.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
            cell.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
            cell.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
            i++;
            setTimeout(hoverNext, 400);
          }, 1400);
        };
        hoverNext();
      } else { resolve(); }
      return;
    }

    if (step.action === "expandFirstRow") {
      // Click the first expandable row in a price table
      const el = document.querySelector(step.selector);
      if (el) {
        // Highlight stars first
        const stars = el.querySelectorAll<HTMLElement>('[aria-hidden="true"]');
        stars.forEach((s) => {
          s.style.transition = "transform 400ms ease, color 400ms ease";
          s.style.transform = "scale(2)";
          s.style.color = "var(--nimbus-colors-indigo-11)";
        });
        setTimeout(() => {
          stars.forEach((s) => { s.style.transform = ""; s.style.color = ""; });
          // Click the first data row to expand it
          const rows = el.querySelectorAll<HTMLElement>("tr[data-href], tr[role='row']");
          const clickable = Array.from(rows).find(r => r.querySelector("td, [role='gridcell']"));
          if (clickable) clickable.click();
        }, 1000);
        setTimeout(resolve, 1600);
      } else { resolve(); }
      return;
    }

    if (step.action === "clickSuggestedCondition") {
      const el = document.querySelector(step.selector);
      if (el) {
        // Highlight stars
        const stars = el.querySelectorAll<HTMLElement>('[aria-hidden="true"]');
        stars.forEach((s) => {
          s.style.transition = "transform 400ms ease, color 400ms ease";
          s.style.transform = "scale(2)";
          s.style.color = "var(--nimbus-colors-indigo-11)";
        });
        setTimeout(() => {
          stars.forEach((s) => { s.style.transform = ""; s.style.color = ""; });
          // Click the first suggested condition badge
          const badge = el.querySelector<HTMLElement>("[class*='badge'], [class*='Badge']");
          if (badge) badge.click();
        }, 1000);
        setTimeout(resolve, 1600);
      } else { resolve(); }
      return;
    }

    if (step.action === "selectSmartphones") {
      const el = document.querySelector(step.selector);
      if (el) {
        // Highlight stars first
        const stars = el.querySelectorAll<HTMLElement>('[aria-hidden="true"]');
        stars.forEach((s) => {
          s.style.transition = "transform 500ms ease, color 500ms ease, text-shadow 500ms ease";
          s.style.transform = "scale(2.5)";
          s.style.color = "var(--nimbus-colors-indigo-11)";
          s.style.textShadow = "0 0 8px rgba(110, 86, 207, 0.6)";
        });
        // Then click the Smartphones checkbox
        setTimeout(() => {
          stars.forEach((s) => { s.style.transform = ""; s.style.color = ""; s.style.textShadow = ""; });
          const checkboxes = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
          // Smartphones is the second unchecked checkbox (after Electronics)
          const unchecked = Array.from(checkboxes).filter(c => !c.checked);
          if (unchecked[0]) unchecked[0].click();
        }, 1200);
        setTimeout(resolve, 1800);
      } else { resolve(); }
      return;
    }

    if (step.action === "revealGenerateSeo") {
      window.dispatchEvent(new CustomEvent("tour:revealSeo"));
      setTimeout(resolve, 700);
      return;
    }

    if (step.action === "pulseShelfDaysCells") {
      // Highlight the amber "slow mover" shelf-day cells in the product
      // table — PetSmart's Inventory Agent data injected into the row.
      const el = document.querySelector(step.selector);
      if (el) {
        const cells = el.querySelectorAll<HTMLElement>("[data-tour='shelf-days-highlight']");
        cells.forEach((c) => {
          c.style.transition = "transform 400ms ease, box-shadow 400ms ease";
          c.style.transform = "scale(1.15)";
          c.style.boxShadow = "0 0 0 3px rgba(180, 83, 9, 0.5)";
        });
        setTimeout(() => {
          cells.forEach((c) => {
            c.style.transition = "transform 600ms ease, box-shadow 600ms ease";
            c.style.transform = "";
            c.style.boxShadow = "";
          });
          setTimeout(resolve, 400);
        }, 1400);
      } else { resolve(); }
      return;
    }

    if (step.action === "pulseWarningCart") {
      // Amber pulse (distinct from the default indigo pulseElement) to
      // draw the eye to the cart that trips a stacking/margin violation.
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (el) {
        el.style.transition = "box-shadow 500ms ease, transform 500ms ease";
        el.style.boxShadow = "0 0 0 6px rgba(180, 83, 9, 0.5), 0 0 20px rgba(180, 83, 9, 0.35)";
        el.style.transform = "scale(1.03)";
        setTimeout(() => {
          el.style.transition = "box-shadow 800ms ease, transform 800ms ease";
          el.style.boxShadow = "";
          el.style.transform = "";
          setTimeout(resolve, 400);
        }, 1500);
      } else { resolve(); }
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

  const isActive = currentStep >= 0 && currentStep < steps.length;
  const step = isActive ? steps[currentStep] : null;

  // Measure the target element and scroll into view
  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      // Measure after scroll settles
      setTimeout(() => {
        const r = el.getBoundingClientRect();
        setRect(r);
      }, 100);
    } else {
      setRect(null);
    }
  }, [step]);

  // When step changes: spotlight the target immediately, run action animation, then show dialog
  useEffect(() => {
    if (!step) return;
    setTransitioning(true);

    // Find and spotlight the target element right away (before running the action).
    // This keeps the highlight visible while the animation plays.
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
      // Re-measure after animation (element may have moved or appeared, e.g. panel)
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
  }, []);

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // On the last step, click the spotlighted element (e.g. "Create Promotion" button)
      // to navigate to the next page, then signal the new page to start its tour.
      const lastStep = steps[currentStep];
      if (lastStep) {
        const el = document.querySelector(lastStep.selector) as HTMLElement | null;
        if (el) {
          el.click();
          // Signal the next page to auto-start its tour
          setTimeout(() => window.dispatchEvent(new CustomEvent("tour:autoStart")), 600);
        }
      }
      endTour();
    }
  }, [currentStep, steps, endTour]);

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const pos = rect && step ? dialogPosition(rect, step.placement ?? "bottom") : null;
  const showDialog = isActive && rect && step && pos && !transitioning;

  return (
    <TourContext.Provider value={{ startTour, endTour, isActive }}>
      {children}

      {isActive && (
        <Box position="fixed" inset="0" zIndex={9999} pointerEvents="auto">
          {/* Spotlight + overlay */}
          {rect && (
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
                    <Button variant="ghost" size="2xs" onPress={prev}>Back</Button>
                  )}
                  <Button variant="solid" colorPalette="primary" size="2xs" onPress={next}>
                    Next
                  </Button>
                </Flex>
              </Flex>
            </Box>
          )}

          {/* Click anywhere to advance */}
          <Box position="fixed" inset="0" zIndex={10000} cursor="pointer" onClick={next} />
        </Box>
      )}
    </TourContext.Provider>
  );
}
