import { useState, type ReactNode } from "react";
import { Box, Flex, Stack, Text, Badge, Grid, Icon, Button, Separator } from "@commercetools/nimbus";
import { CheckCircle, Warning, Info, OpenInNew } from "@commercetools/nimbus-icons";

/** Compact stat tile for panel responses */
const PanelStat = ({ label, value, color = "neutral.12" }: { label: string; value: string; color?: string }) => (
  <Box bg="neutral.2" borderRadius="200" borderWidth="1px" borderColor="neutral.4" p="150">
    <Text textStyle="sm" fontWeight="bold" color={color}>{value}</Text>
    <Text textStyle="xs" color="neutral.9">{label}</Text>
  </Box>
);

/** Status row with icon */
const StatusRow = ({ status, children }: { status: "pass" | "warn" | "info"; children: ReactNode }) => {
  const icons = { pass: CheckCircle, warn: Warning, info: Info } as const;
  const colors = { pass: "green.9", warn: "amber.9", info: "blue.9" } as const;
  return (
    <Flex gap="150" alignItems="flex-start">
      <Icon as={icons[status]} size="2xs" color={colors[status]} mt="50" flexShrink={0} />
      <Text textStyle="xs" color="neutral.12" lineHeight="tall">{children}</Text>
    </Flex>
  );
};

/** Source badges row */
const Sources = ({ agents }: { agents: string[] }) => (
  <Flex gap="100" flexWrap="wrap" mt="100">
    {agents.map((a) => <Badge key={a} size="2xs" colorPalette="neutral">{a}</Badge>)}
  </Flex>
);

/** Interactive approval card: agent proposes an action, human clicks to execute.
 *  Follows the commerce-agents suspend/resume HITL pattern. */
const ApprovalCard = ({ action, detail, onApprove }: { action: string; detail: string; onApprove?: string }) => {
  const [state, setState] = useState<"pending" | "approved">("pending");
  return (
    <Box borderRadius="200" borderWidth="1px" borderColor={state === "approved" ? "green.6" : "primary.6"} overflow="hidden" mt="100">
      <Box bg={state === "approved" ? "green.2" : "primary.2"} px="200" py="100">
        <Flex alignItems="center" gap="150">
          {state === "approved" && <Icon as={CheckCircle} size="2xs" color="green.9" />}
          <Text textStyle="xs" fontWeight="semibold" color={state === "approved" ? "green.11" : "primary.11"}>
            {state === "approved" ? "Done" : "Action required"}
          </Text>
        </Flex>
      </Box>
      <Box px="200" py="150">
        <Text textStyle="xs" fontWeight="semibold" color="neutral.12">{action}</Text>
        <Text textStyle="xs" color="neutral.11" lineHeight="tall" mt="50">{detail}</Text>
        {state === "pending" ? (
          <Button variant="solid" colorPalette="primary" size="2xs" mt="150" onPress={() => setState("approved")}>
            {action}
          </Button>
        ) : (
          <Flex alignItems="center" gap="150" mt="150">
            <Icon as={CheckCircle} size="2xs" color="green.9" />
            <Text textStyle="xs" color="green.11" fontWeight="medium">
              {onApprove ?? "Saved as inactive draft"}
            </Text>
            <Flex alignItems="center" gap="50" ml="auto" cursor="pointer" _hover={{ textDecoration: "underline" }}>
              <Text textStyle="xs" color="primary.11">View in MC</Text>
              <Icon as={OpenInNew} size="2xs" color="primary.9" />
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

/** Success status shown after an action is complete */
const ActionSuccess = ({ label }: { label: string }) => (
  <Flex alignItems="center" gap="150" px="200" py="100" bg="green.2" borderRadius="200" borderWidth="1px" borderColor="green.6" mt="100">
    <Icon as={CheckCircle} size="2xs" color="green.9" />
    <Text textStyle="xs" fontWeight="medium" color="green.11">{label}</Text>
  </Flex>
);

// ─── Individual messages (reused across cumulative step configs) ────────────

type Msg = { role: string; content: string; richContent?: ReactNode };

const msg1_user: Msg = {
  role: "user",
  content: "I need a spring promotion for slow-moving pet health products.",
};

const msg1_agent: Msg = {
  role: "assistant",
  content: "I've checked your Pet Health inventory and cross-referenced seasonal data.",
  richContent: (
    <Stack gap="200">
      <Grid templateColumns="repeat(3, 1fr)" gap="150">
        <PanelStat label="Slow movers" value="23" color="amber.11" />
        <PanelStat label="Shelf value" value="$47,200" color="red.11" />
        <PanelStat label="Avg shelf days" value="79" color="amber.11" />
      </Grid>
      <Box bg="green.2" borderRadius="200" p="200" borderWidth="1px" borderColor="green.6">
        <Text textStyle="xs" fontWeight="semibold" color="green.11">Recommendation</Text>
        <Text textStyle="xs" color="neutral.12" lineHeight="tall">
          Buy 2 Get 1 Free on pet health products. Spring wellness promotions lifted this category
          28% in 2024/2025. Optimal window: March 1 through April 15.
        </Text>
      </Box>
      <Sources agents={["Inventory Agent", "Strategy Agent"]} />
    </Stack>
  ),
};

const msg2_user: Msg = {
  role: "user",
  content: "Draft the discount. Check stock and conflicts.",
};

const msg2_agent: Msg = {
  role: "assistant",
  content: "I've drafted the discount and run validation checks.",
  richContent: (
    <Stack gap="200">
      <Box bg="neutral.2" borderRadius="200" p="200" borderWidth="1px" borderColor="neutral.4">
        <Text textStyle="xs" fontWeight="semibold" color="neutral.12" mb="100">Spring Pet Wellness 2026</Text>
        <Grid templateColumns="1fr 1fr" gap="100">
          <Text textStyle="xs" color="neutral.9">Type: <Text as="span" color="neutral.12">Buy 2 Get 1 Free</Text></Text>
          <Text textStyle="xs" color="neutral.9">Products: <Text as="span" color="neutral.12">~340</Text></Text>
          <Text textStyle="xs" color="neutral.9">Margin impact: <Text as="span" color="amber.11">-4.1%</Text></Text>
          <Text textStyle="xs" color="neutral.9">Window: <Text as="span" color="neutral.12">Mar 1 – Apr 15</Text></Text>
        </Grid>
      </Box>
      <Stack gap="100">
        <StatusRow status="pass">312 of 340 products have sufficient inventory</StatusRow>
        <StatusRow status="warn">28 products low-stock (reorder lead time exceeds promo window)</StatusRow>
        <StatusRow status="warn">67 products overlap with Loyalty Paw Points 10%</StatusRow>
        <StatusRow status="pass">Stacking mode set to non-stackable (conflict resolved)</StatusRow>
      </Stack>
      <Sources agents={["Promo Agent", "Inventory Agent"]} />
      <ApprovalCard
        action="Save as draft"
        detail="Creates cart discount 'spring-pet-wellness-2026' as an inactive draft. 340 products, Buy 2 Get 1 Free, non-stackable."
      />
    </Stack>
  ),
};

const msg3_user: Msg = {
  role: "user",
  content: "Simulate it. What happens with real carts?",
};

const msg3_agent: Msg = {
  role: "assistant",
  content: "I ran 3 cart simulations against the draft discount.",
  richContent: (
    <Stack gap="200">
      <Stack gap="100">
        <StatusRow status="pass">
          <Text as="span" fontWeight="semibold">Cart A:</Text> 2x Flea Treatment + 1x Dental Chews. Savings: $24.99. Margin: 22%
        </StatusRow>
        <StatusRow status="pass">
          <Text as="span" fontWeight="semibold">Cart B:</Text> 1x Flea Treatment + 1x Vitamins. No discount (min not met). Margin: 31%
        </StatusRow>
        <StatusRow status="warn">
          <Text as="span" fontWeight="semibold">Cart C:</Text> 3x Dental Chews + Loyalty stacking. Margin: 11% (below 15% floor)
        </StatusRow>
      </Stack>
      <Box bg="amber.2" borderRadius="200" p="200" borderWidth="1px" borderColor="amber.6">
        <Text textStyle="xs" color="neutral.12" lineHeight="tall">
          Cart C confirms the stacking issue. Non-stackable mode prevents this in production.
        </Text>
      </Box>
      <Box bg="neutral.2" borderRadius="200" p="200" borderWidth="1px" borderColor="neutral.4">
        <Text textStyle="xs" fontWeight="semibold" color="neutral.12" mb="50">PetSmart context</Text>
        <Text textStyle="xs" color="neutral.11" lineHeight="tall">
          Return policy: discount applies to remaining bundle items. 78% of products available for in-store pickup.
        </Text>
      </Box>
      <Sources agents={["Preview Agent", "Inventory Agent"]} />
    </Stack>
  ),
};

const msg4_user: Msg = {
  role: "user",
  content: "Summarize everything for approval.",
};

const msg4_agent: Msg = {
  role: "assistant",
  content: "Here's the promotion brief for your approval.",
  richContent: (
    <Stack gap="200">
      <Box bg="neutral.2" borderRadius="200" p="200" borderWidth="1px" borderColor="neutral.4">
        <Flex alignItems="center" gap="150" mb="100">
          <Text textStyle="xs" fontWeight="semibold" color="neutral.12">Spring Pet Wellness 2026</Text>
          <Badge size="2xs" colorPalette="neutral">Draft</Badge>
        </Flex>
        <Text textStyle="xs" color="neutral.11">Buy 2 Get 1 Free · 340 products · March 1 – April 15</Text>
      </Box>
      <Stack gap="100">
        <StatusRow status="pass">Strategy: 23 slow movers targeted. Historical uplift: +28%</StatusRow>
        <StatusRow status="pass">Margin: -4.1% impact, above 15% floor</StatusRow>
        <StatusRow status="pass">Simulation: 3 carts tested, stacking edge case resolved</StatusRow>
        <StatusRow status="pass">Inventory: 312 in stock, 28 low-stock excluded</StatusRow>
        <StatusRow status="warn">Conflict: Loyalty Paw Points overlap on 67 products (non-stackable)</StatusRow>
      </Stack>
      <Box bg="amber.2" borderRadius="200" p="200" borderWidth="1px" borderColor="amber.6">
        <Text textStyle="xs" fontWeight="medium" color="amber.11">
          This promotion will go live immediately upon approval.
        </Text>
      </Box>
      <Sources agents={["Strategy Agent", "Promo Agent", "Preview Agent", "Inventory Agent"]} />
      <Separator my="100" />
      <ApprovalCard
        action="Approve & Launch"
        detail="Activates cart discount 'spring-pet-wellness-2026'. Discount goes live immediately for all eligible carts."
        onApprove="Promotion is now live"
      />
    </Stack>
  ),
};

const msg5_user: Msg = {
  role: "user",
  content: "It's live. How did it perform?",
};

const msg5_agent: Msg = {
  role: "assistant",
  content: "Spring Pet Wellness ran March 1 through April 15. Here are the results.",
  richContent: (
    <Stack gap="200">
      <Text textStyle="xs" fontWeight="semibold" color="neutral.10">Platform totals (commercetools)</Text>
      <Grid templateColumns="repeat(2, 1fr)" gap="150">
        <PanelStat label="Orders" value="4,287" />
        <PanelStat label="Revenue" value="$312,400" color="green.11" />
        <PanelStat label="Avg order value" value="$72.88" />
        <PanelStat label="Code usage" value="34%" />
      </Grid>
      <Text textStyle="xs" fontWeight="semibold" color="neutral.10">Cross-channel (PetSmart)</Text>
      <Flex gap="200" flexWrap="wrap">
        <Badge size="2xs" colorPalette="positive">Pickup +12%</Badge>
        <Badge size="2xs" colorPalette="info">Online-to-store 8.3%</Badge>
        <Badge size="2xs" colorPalette="positive">Halo +7%</Badge>
      </Flex>
      <Text textStyle="xs" fontWeight="semibold" color="neutral.10">Inventory clearance</Text>
      <Box>
        <Flex justifyContent="space-between" mb="50">
          <Text textStyle="xs" color="neutral.9">Slow movers cleared</Text>
          <Text textStyle="xs" fontWeight="semibold" color="green.11">18/23 (78%)</Text>
        </Flex>
        <Box height="150" bg="neutral.4" borderRadius="full" overflow="hidden">
          <Box height="100%" width="78%" bg="green.9" borderRadius="full" />
        </Box>
      </Box>
      <Flex gap="200">
        <Text textStyle="xs" color="neutral.9">Overstock: <Text as="span" textDecoration="line-through">$47,200</Text> → <Text as="span" fontWeight="semibold" color="green.11">$8,200</Text></Text>
        <Text textStyle="xs" color="neutral.9">Days to clear: <Text as="span" textDecoration="line-through">87</Text> → <Text as="span" fontWeight="semibold" color="green.11">34</Text></Text>
      </Flex>
      <Sources agents={["Data Agent", "Reporting Agent"]} />
    </Stack>
  ),
};

// ─── Orchestrated: 3 natural views ─────────────────────────────────────────
// Step 1 (Products): full conversation covering discovery → draft → simulation
// Step 4 (Review): approval brief + launch
// Step 5 (Analytics): results
// Steps 2 and 3 are pass-through (same thread as Step 1) for direct navigation.

const orchestratedName = "PetSmart Orchestrator";

/** Step 1: discovery + draft + simulation all happen in one conversation */
const step1Thread: Msg[] = [
  msg1_user, msg1_agent,
  msg2_user, msg2_agent,
  msg3_user, msg3_agent,
];

/** Step 4: approval brief builds on the full thread */
const step4Thread: Msg[] = [
  ...step1Thread,
  msg4_user, msg4_agent,
];

/** Step 5: results build on approval */
const step5Thread: Msg[] = [
  ...step4Thread,
  msg5_user, msg5_agent,
];

export const chatConfigs: Record<
  string,
  {
    agentName: string;
    messages: Msg[];
    placeholder: string;
  }
> = {
  // Orchestrated flow: 3 views, one continuous thread
  "/orchestrated/step-1": {
    agentName: orchestratedName,
    messages: step1Thread,
    placeholder: "Ask about inventory, promotion strategy, or the draft...",
  },
  "/orchestrated/step-2": {
    agentName: orchestratedName,
    messages: step1Thread,
    placeholder: "Ask about the discount configuration...",
  },
  "/orchestrated/step-3": {
    agentName: orchestratedName,
    messages: step1Thread,
    placeholder: "Ask about the simulation results...",
  },
  "/orchestrated/step-4": {
    agentName: orchestratedName,
    messages: step4Thread,
    placeholder: "Ask for more detail before approving...",
  },
  "/orchestrated/step-5": {
    agentName: orchestratedName,
    messages: step5Thread,
    placeholder: "Ask about specific products, channels, or next steps...",
  },
};
