import { useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { TourProvider, useTour } from "./components/Tour";
import { AppShell } from "./components/AppShell";
import { Landing } from "./steps/Landing";
import { DiscoverStep } from "./steps/DiscoverStep";
import { BuildStep } from "./steps/BuildStep";
import { TestStep } from "./steps/TestStep";
import { ApproveStep } from "./steps/ApproveStep";
import { MeasureStep } from "./steps/MeasureStep";
import { startStepTour, type FlavorMode } from "./data/tourSteps";

const StepWrapper = ({
  step: StepComponent,
  stepNumber,
}: {
  step: React.ComponentType<{ mode: FlavorMode }>;
  stepNumber: number;
}) => {
  const { mode } = useParams<{ mode: string }>();
  const flavorMode = (mode as FlavorMode) ?? "contextual";
  const { startTour } = useTour();

  // Auto-start tour when navigated to from previous step's tour
  useEffect(() => {
    const handler = () => {
      startStepTour(startTour, flavorMode, stepNumber);
    };
    window.addEventListener("tour:autoStart", handler);
    return () => window.removeEventListener("tour:autoStart", handler);
  }, [startTour, flavorMode, stepNumber]);

  return <StepComponent mode={flavorMode} />;
};

export const App = () => (
  <TourProvider>
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Landing />} />
        <Route path=":mode/step-1" element={<StepWrapper step={DiscoverStep} stepNumber={1} />} />
        <Route path=":mode/step-2" element={<StepWrapper step={BuildStep} stepNumber={2} />} />
        <Route path=":mode/step-3" element={<StepWrapper step={TestStep} stepNumber={3} />} />
        <Route path=":mode/step-4" element={<StepWrapper step={ApproveStep} stepNumber={4} />} />
        <Route path=":mode/step-5" element={<StepWrapper step={MeasureStep} stepNumber={5} />} />
      </Route>
    </Routes>
  </TourProvider>
);
