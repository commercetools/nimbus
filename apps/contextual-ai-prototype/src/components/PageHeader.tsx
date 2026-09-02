import { Box, Flex, Text, Separator, Breadcrumbs } from "@commercetools/nimbus";
import type { ReactNode } from "react";

interface Tab {
  label: string;
  active?: boolean;
}

interface PageHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
  tabs?: Tab[];
  actions?: ReactNode;
}

export const PageHeader = ({
  breadcrumbs,
  title,
  subtitle,
  tabs,
  actions,
}: PageHeaderProps) => {
  return (
    <Box bg="white">
      {/* Breadcrumbs */}
      <Flex px="500" pt="250" pb="0">
        <Breadcrumbs.Root aria-label="Breadcrumb" size="sm" separator="/">
          {breadcrumbs.map((bc, i) => (
            <Breadcrumbs.Item key={i} href={bc.href}>
              {bc.label}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs.Root>
      </Flex>

      {/* Title row */}
      <Flex
        px="500"
        pt="200"
        pb="0"
        alignItems="center"
        gap="300"
      >
        <Box flex="1" minWidth="0">
          <Flex alignItems="baseline" gap="200">
            <Text textStyle="lg" fontWeight="semibold" color="neutral.12">
              {title}
            </Text>
            {subtitle && (
              <Text textStyle="xs" color="neutral.9">
                {subtitle}
              </Text>
            )}
          </Flex>
        </Box>
        {actions && (
          <Flex gap="200" alignItems="center" flexShrink={0}>
            {actions}
          </Flex>
        )}
      </Flex>

      {/* Tabs */}
      {tabs && (
        <Flex px="500" pt="200" gap="0">
          {tabs.map((tab, i) => (
            <Box
              key={i}
              px="300"
              py="200"
              cursor="pointer"
              borderBottomWidth="2px"
              borderColor={tab.active ? "indigo.9" : "transparent"}
              _hover={{ bg: "neutral.3" }}
              transition="background 150ms"
            >
              <Text
                textStyle="sm"
                fontWeight={tab.active ? "semibold" : "medium"}
                color={tab.active ? "neutral.12" : "neutral.10"}
              >
                {tab.label}
              </Text>
            </Box>
          ))}
        </Flex>
      )}

      <Separator />
    </Box>
  );
};
