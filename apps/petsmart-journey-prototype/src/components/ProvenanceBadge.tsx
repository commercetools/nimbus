import { Text } from "@commercetools/nimbus";
import type { AgentSource } from "../data/agents";

interface ProvenanceBadgeProps {
  /** Font size token or CSS value. Default "12px". */
  size?: string;
  /** Which agent produced this element; drives color. Default "ct". */
  agentSource?: AgentSource;
}

const sourceColors: Record<AgentSource, string> = {
  ct: "teal.9",
  petsmart: "primary.9",
};

/** Tiny ✦ star used as an inline AI provenance marker. Color varies by agent source. */
export const ProvenanceBadge = ({
  size = "12px",
  agentSource = "ct",
}: ProvenanceBadgeProps) => (
  <Text
    as="span"
    fontSize={size}
    lineHeight="1"
    color={sourceColors[agentSource]}
    flexShrink={0}
    aria-hidden="true"
  >
    ✦
  </Text>
);
