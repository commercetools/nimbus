import { Box, Flex, Stack, Separator, Icon, Tooltip } from "@commercetools/nimbus";
import {
  CommercetoolsCube,
  Speed,
  Inventory,
  AccountTree,
  PersonOutline,
  ShoppingCart,
  LocalOffer,
  Settings,
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
          width="500"
          height="500"
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
      width="900"
    >
      {/* CT logo */}
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <Flex alignItems="center" justifyContent="center" color="white" _hover={{ opacity: 0.8 }} cursor="pointer" mb="100">
          <Icon as={CommercetoolsCube} size="xs" />
        </Flex>
      </NavLink>

      <Separator borderColor="rgba(255,255,255,0.12)" />

      {/* Navigation */}
      <Stack gap="100" pt="100" flex="1" alignItems="center">
        <NavItem
          icon={<Icon as={Speed} size="2xs" />}
          label="Dashboard"
          to="/"
        />
        <NavItem
          icon={<Icon as={Inventory} size="2xs" />}
          label="Products"
          to="/products/galaxy-s25-ultra"
        />
        <NavItem
          icon={<Icon as={AccountTree} size="2xs" />}
          label="Categories"
          to="/categories/phone-cases"
        />
        <NavItem
          icon={<Icon as={PersonOutline} size="2xs" />}
          label="Customers"
          to="/products/pour-over-kettle"
        />
        <NavItem
          icon={<Icon as={ShoppingCart} size="2xs" />}
          label="Orders"
          to="/orders/mc-2026-847291"
        />
        <NavItem
          icon={<Icon as={LocalOffer} size="2xs" />}
          label="Discounts"
          to="/discounts/summer-clearance"
        />
      </Stack>

      <Separator borderColor="rgba(255,255,255,0.12)" />

      <Box pt="200">
        <NavItem
          icon={<Icon as={Settings} size="2xs" />}
          label="Settings"
          to="/settings"
        />
      </Box>
    </Flex>
  );
};
