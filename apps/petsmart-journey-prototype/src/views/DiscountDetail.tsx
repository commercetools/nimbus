import { Box, Text } from "@commercetools/nimbus";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

/** Stub — full implementation in Phase 5 */
export const DiscountDetail = () => {
  const { discountId } = useParams();
  return (
    <Box>
      <PageHeader
        title={discountId ?? "Discount"}
        subtitle="Discount detail view"
      />
      <Box p="400">
        <Text textStyle="sm" color="neutral.10">
          Discount detail view — coming in Phase 5
        </Text>
      </Box>
    </Box>
  );
};
