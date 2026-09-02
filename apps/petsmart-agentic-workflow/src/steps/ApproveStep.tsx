import { useNavigate } from "react-router-dom";
import { Box, Flex, Stack, Text, Button, Badge, Grid, Icon } from "@commercetools/nimbus";
import { CheckCircle, Warning, Info } from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { promotion } from "../data/promotionData";

export type FlavorMode = "contextual" | "orchestrated";

const reviewChecklist = [
  {
    status: "pass" as const,
    label: "Inventory coverage",
    detail: "312 of 340 products have sufficient stock. 28 low-stock items excluded.",
    agentName: "Inventory Agent",
    agentSource: "customer" as const,
  },
  {
    status: "pass" as const,
    label: "Margin safety",
    detail: "Average margin after discount: 15.9% (above 15% floor). No products below floor.",
    agentName: "Promo Agent",
    agentSource: "ct" as const,
  },
  {
    status: "warn" as const,
    label: "Conflict resolution",
    detail: "Loyalty Paw Points 10% overlaps 67 products. Resolved: set to non-stackable.",
    agentName: "Promo Agent",
    agentSource: "ct" as const,
  },
  {
    status: "pass" as const,
    label: "Cart simulation",
    detail: "3 representative carts tested. All pass margin and stacking rules.",
    agentName: "Preview Agent",
    agentSource: "ct" as const,
  },
  {
    status: "info" as const,
    label: "Historical benchmark",
    detail: "Spring 2025 pet health promotion lifted orders 22% over 6 weeks. This promotion targets similar products.",
    agentName: "Strategy Agent",
    agentSource: "ct" as const,
  },
];

const statusIcon = {
  pass: { icon: CheckCircle, color: "green.9" },
  warn: { icon: Warning, color: "amber.9" },
  info: { icon: Info, color: "blue.9" },
} as const;

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Text textStyle="xs" color="neutral.9" mb="50">
      {label}
    </Text>
    <Text textStyle="sm" fontWeight="medium" color="neutral.12">
      {value}
    </Text>
  </Box>
);

const PromotionDetails = () => (
  <Box
    bg="white"
    borderRadius="300"
    p="400"
    shadow="xs"
    borderWidth="1px"
    borderColor="neutral.4"
    data-tour="promotion-details"
  >
    <Flex alignItems="center" gap="200" mb="300">
      <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
        Discount details
      </Text>
      <Badge size="2xs" colorPalette="neutral">{promotion.status}</Badge>
      {!promotion.requiresDiscountCode && (
        <Badge size="2xs" colorPalette="info">Auto-applied</Badge>
      )}
    </Flex>

    {/* Row 1: Identity */}
    <Grid templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }} gap="300" mb="300">
      <DetailField label="Name" value={promotion.name} />
      <DetailField label="Key" value={promotion.key} />
      <DetailField label="Value type" value={promotion.type} />
      <DetailField label="Discount target" value={promotion.target} />
    </Grid>

    {/* Row 2: Schedule & stacking */}
    <Grid templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }} gap="300" mb="300">
      <DetailField label="Valid from" value={promotion.startDate} />
      <DetailField label="Valid until" value={promotion.endDate} />
      <DetailField label="Sort order" value={promotion.sortOrder} />
      <DetailField label="Stacking mode" value={promotion.stackingMode === "StopAfterThisDiscount" ? "Stop after this discount" : "Stacking"} />
    </Grid>

    {/* Row 3: Predicates */}
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="300" mb="300">
      <Box>
        <Text textStyle="xs" color="neutral.9" mb="50">Cart predicate</Text>
        <Box bg="neutral.2" borderRadius="200" px="200" py="100">
          <Text textStyle="xs" fontFamily="mono" color="neutral.12">{promotion.cartPredicate}</Text>
        </Box>
      </Box>
      <Box>
        <Text textStyle="xs" color="neutral.9" mb="50">Target predicate</Text>
        <Box bg="neutral.2" borderRadius="200" px="200" py="100">
          <Text textStyle="xs" fontFamily="mono" color="neutral.12">{promotion.targetPredicate}</Text>
        </Box>
      </Box>
    </Grid>

    {/* Row 4: Description */}
    <Box mb="300">
      <Text textStyle="xs" color="neutral.9" mb="50">Description</Text>
      <Text textStyle="xs" color="neutral.11" lineHeight="tall">{promotion.description}</Text>
    </Box>

    {/* Impact summary (agent-enriched) */}
    <Flex gap="300" flexWrap="wrap" mb="300">
      <Badge size="2xs" colorPalette="neutral">{promotion.productsAffected} products affected</Badge>
      <Badge size="2xs" colorPalette="warning">{promotion.lowStockProducts} low-stock excluded</Badge>
      <Badge size="2xs" colorPalette="warning">Margin impact: {promotion.marginImpact}</Badge>
    </Flex>

    {/* Conflict warning */}
    <Flex
      gap="200"
      p="200"
      bg="amber.2"
      borderRadius="200"
      borderWidth="1px"
      borderColor="amber.6"
      alignItems="center"
    >
      <Icon as={Warning} size="2xs" color="amber.9" flexShrink={0} />
      <Text textStyle="xs" color="neutral.11">
        <Text as="span" fontWeight="semibold">{promotion.conflictProducts} products</Text> overlap with &quot;{promotion.conflictDiscount}&quot;. Resolved: stacking mode set to &quot;Stop after this discount&quot;.
      </Text>
    </Flex>
  </Box>
);

export const ApproveStep = ({ mode }: { mode: FlavorMode }) => {
  const isContextual = mode === "contextual";
  const navigate = useNavigate();

  return (
    <Box height="100%" overflow="auto" bg="neutral.1" display="flex" flexDirection="column">
      <PageHeader
        breadcrumbs={[
          { label: "Promotions" },
          { label: "Spring Pet Wellness 2026" },
          { label: "Review" },
        ]}
        title="Promotion Review"
        subtitle="Ready for approval"
        actions={
          <Flex gap="200" alignItems="center">
            <Text textStyle="xs" color="neutral.9">
              Goes live immediately upon approval.
            </Text>
            <Button variant="outline" colorPalette="warning" size="2xs">
              Request Changes
            </Button>
            <Button
              variant="solid"
              colorPalette="positive"
              size="2xs"
              data-tour="approve-btn"
              onPress={() => navigate(`/${mode}/step-5`)}
            >
              Approve &amp; Launch
            </Button>
          </Flex>
        }
      />

      <Box p={{ base: "300", sm: "500" }} flex="1">
        <Stack gap="500">
          <PromotionDetails />

          {/* Review checklist: what Maya needs to know before approving */}
          <Box
            bg="white"
            borderRadius="300"
            p="400"
            shadow="xs"
            borderWidth="1px"
            borderColor="neutral.4"
            data-tour="review-checklist"
          >
            <Flex alignItems="center" gap="200" mb="300">
              <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
                Pre-launch checklist
              </Text>
              <Badge size="2xs" colorPalette="positive">4 of 5 clear</Badge>
            </Flex>

            <Stack gap="200">
              {reviewChecklist.map((item) => {
                const iconDef = statusIcon[item.status];
                return (
                  <Flex
                    key={item.label}
                    gap="200"
                    alignItems="flex-start"
                    p="200"
                    borderRadius="200"
                    bg={item.status === "warn" ? "amber.2" : "neutral.2"}
                    borderWidth={item.status === "warn" ? "1px" : "0"}
                    borderColor="amber.6"
                  >
                    {isContextual && (
                      <ProvenanceIndicator
                        agentName={item.agentName}
                        agentSource={item.agentSource}
                        reason={item.detail}
                        size="10px"
                      />
                    )}
                    <Icon as={iconDef.icon} size="2xs" color={iconDef.color} mt="50" flexShrink={0} />
                    <Box flex="1">
                      <Text textStyle="xs" fontWeight="semibold" color="neutral.12">
                        {item.label}
                      </Text>
                      <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                        {item.detail}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </Box>

    </Box>
  );
};
