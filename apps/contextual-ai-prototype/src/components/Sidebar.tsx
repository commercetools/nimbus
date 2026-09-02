import { Box, Flex, Stack, Separator, Icon, Tooltip } from "@commercetools/nimbus";
import {
  Speed,
  Inventory,
  AccountTree,
  PersonOutline,
  ShoppingCart,
  LocalOffer,
  Settings,
  CommercetoolsCube,
} from "@commercetools/nimbus-icons";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  to: string;
}

const NavItem = ({ icon, label, to }: NavItemProps) => (
  <Tooltip.Root>
    <NavLink to={to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Flex
          alignItems="center"
          justifyContent="center"
          width="36px"
          height="36px"
          borderRadius="200"
          bg={isActive ? "rgba(255,255,255,0.15)" : undefined}
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
          cursor="pointer"
          transition="background 150ms"
          color={isActive ? "white" : "rgba(255,255,255,0.6)"}
        >
          {icon}
        </Flex>
      )}
    </NavLink>
    <Tooltip.Content placement="right">
      {label}
    </Tooltip.Content>
  </Tooltip.Root>
);

export const Sidebar = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      height="100%"
      bg="neutral.12"
      py="300"
      px="200"
      gap="100"
      overflow="hidden"
      width="48px"
    >
      {/* CT Logo → Landing / Dashboard */}
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <Flex
          alignItems="center"
          justifyContent="center"
          width="32px"
          height="32px"
          flexShrink={0}
          color="white"
          _hover={{ opacity: 0.8 }}
          cursor="pointer"
        >
          <Icon as={CommercetoolsCube} size="md" />
        </Flex>
      </NavLink>

      <Separator css={{ borderColor: "rgba(255,255,255,0.12)" }} />

      {/* Navigation: matching real MC sidebar icons per plan */}
      <Stack gap="100" pt="200" flex="1" alignItems="center">
        <NavItem
          icon={<Icon as={Speed} size="xs" />}
          label="Dashboard"
          to="/"
        />
        <NavItem
          icon={<Icon as={Inventory} size="xs" />}
          label="Products"
          to="/products/galaxy-s25-ultra"
        />
        <NavItem
          icon={<Icon as={AccountTree} size="xs" />}
          label="Categories"
          to="/categories/phone-cases"
        />
        <NavItem
          icon={<Icon as={PersonOutline} size="xs" />}
          label="Customers"
          to="/products/pour-over-kettle"
        />
        <NavItem
          icon={<Icon as={ShoppingCart} size="xs" />}
          label="Orders"
          to="/orders/mc-2026-847291"
        />
        <NavItem
          icon={<Icon as={LocalOffer} size="xs" />}
          label="Discounts"
          to="/discounts/summer-clearance"
        />
      </Stack>

      <Separator css={{ borderColor: "rgba(255,255,255,0.12)" }} />

      <Box pt="200">
        <NavItem
          icon={<Icon as={Settings} size="xs" />}
          label="Settings"
          to="/settings"
        />
      </Box>
    </Flex>
  );
};
