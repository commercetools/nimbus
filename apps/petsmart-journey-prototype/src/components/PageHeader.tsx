import { Box, Flex, Text, Badge } from "@commercetools/nimbus";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  status?: { label: string; colorPalette: string };
  /** Toolbar actions (buttons) rendered on the right */
  actions?: ReactNode;
}

/** Consistent page header with title, optional status badge, and toolbar actions. */
export const PageHeader = ({
  title,
  subtitle,
  status,
  actions,
}: PageHeaderProps) => (
  <Box
    px="300"
    py="100"
    bg="white"
    borderBottomWidth="1px"
    borderColor="neutral.4"
  >
    <Flex alignItems="center" justifyContent="space-between" gap="200">
      <Box>
        <Flex alignItems="center" gap="200">
          <Text textStyle="md" fontWeight="bold" color="neutral.12">
            {title}
          </Text>
          {status && (
            <Badge size="2xs" colorPalette={status.colorPalette as any}>
              {status.label}
            </Badge>
          )}
        </Flex>
        {subtitle && (
          <Text textStyle="xs" color="neutral.10" mt="50">
            {subtitle}
          </Text>
        )}
      </Box>
      {actions && (
        <Flex gap="200" alignItems="center">
          {actions}
        </Flex>
      )}
    </Flex>
  </Box>
);
