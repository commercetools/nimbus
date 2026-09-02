import { Routes, Route, useParams } from "react-router-dom";
import { TourProvider } from "./components/Tour";
import { AppShell } from "./components/AppShell";
import { Landing } from "./steps/Landing";
import { DiscoverStep } from "./steps/DiscoverStep";
import { BuildStep } from "./steps/BuildStep";
import { TestStep } from "./steps/TestStep";
import { ApproveStep } from "./steps/ApproveStep";
import { MeasureStep } from "./steps/MeasureStep";

type FlavorMode = "contextual" | "orchestrated";

const StepWrapper = ({ step: StepComponent }: { step: React.ComponentType<{ mode: FlavorMode }> }) => {
  const { mode } = useParams<{ mode: string }>();
  return <StepComponent mode={(mode as FlavorMode) ?? "contextual"} />;
};

export const App = () => (
  <TourProvider>
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Landing />} />
        <Route path=":mode/step-1" element={<StepWrapper step={DiscoverStep} />} />
        <Route path=":mode/step-2" element={<StepWrapper step={BuildStep} />} />
        <Route path=":mode/step-3" element={<StepWrapper step={TestStep} />} />
        <Route path=":mode/step-4" element={<StepWrapper step={ApproveStep} />} />
        <Route path=":mode/step-5" element={<StepWrapper step={MeasureStep} />} />
      </Route>
    </Routes>
  </TourProvider>
);
