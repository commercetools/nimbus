import { useNavigate } from "react-router-dom";
import { Flex, Text, Button } from "@commercetools/nimbus";

interface StepNavigationProps {
  currentStep: number; // 1-5
  totalSteps: number; // 5
  mode: "contextual" | "orchestrated";
}

export const StepNavigation = ({
  currentStep,
  totalSteps,
  mode,
}: StepNavigationProps) => {
  const navigate = useNavigate();

  const goTo = (step: number) => navigate(`/${mode}/step-${step}`);

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      py="200"
      px="300"
      mt="200"
      borderTopWidth="1px"
      borderColor="neutral.4"
    >
      {currentStep > 1 ? (
        <Button
          variant="ghost"
          size="2xs"
          onPress={() => goTo(currentStep - 1)}
        >
          ← Previous step
        </Button>
      ) : (
        <Button variant="ghost" size="2xs" onPress={() => navigate("/")}>
          ← Back to start
        </Button>
      )}

      <Text textStyle="xs" color="neutral.9">
        Step {currentStep} of {totalSteps}
      </Text>

      {currentStep < totalSteps ? (
        <Button
          variant="solid"
          colorPalette="primary"
          size="2xs"
          data-tour="next-step-btn"
          onPress={() => goTo(currentStep + 1)}
        >
          Next step →
        </Button>
      ) : (
        <Button
          variant="solid"
          colorPalette="primary"
          size="2xs"
          onPress={() => navigate("/")}
        >
          Back to start
        </Button>
      )}
    </Flex>
  );
};
