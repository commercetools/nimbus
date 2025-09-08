import { Tooltip } from "@/components";
import { Info } from "@commercetools/nimbus-icons";
import { MoneyInputBadgeSlot } from "../money-input.slots";
import { useMoneyInputContext } from "../money-input-context";
import type { MoneyInputBadgeProps } from "../money-input.types";

export const MoneyInputBadge = ({
  tooltipContent,
}: MoneyInputBadgeProps = {}) => {
  const context = useMoneyInputContext();
  const { hasHighPrecisionBadge, isHighPrecision, isDisabled } = context;

  // Only render if high precision badge is enabled and current value is high precision
  if (!hasHighPrecisionBadge || !isHighPrecision) {
    return null;
  }

  const tooltipTitle = tooltipContent || "High Precision Price";

  return (
    <MoneyInputBadgeSlot data-testid="high-precision-badge">
      <Tooltip.Root>
        <Info color={isDisabled ? "neutral.6" : "info"} />
        <Tooltip.Content>{tooltipTitle}</Tooltip.Content>
      </Tooltip.Root>
    </MoneyInputBadgeSlot>
  );
};
