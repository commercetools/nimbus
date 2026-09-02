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
          width="600"
          height="600"
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
      {/* Navigation: decorative MC sidebar matching real MC layout */}
      <Stack gap="100" pt="100" flex="1" alignItems="center">
        <NavItem icon={<Icon as={Speed} size="2xs" />} label="Home" to="/" />
        <NavItem icon={<Icon as={Inventory} size="2xs" />} label="Products" to="/" />
        <NavItem icon={<Icon as={AccountTree} size="2xs" />} label="Categories" to="/" />
        <NavItem icon={<Icon as={PersonOutline} size="2xs" />} label="Customers" to="/" />
        <NavItem icon={<Icon as={ShoppingCart} size="2xs" />} label="Orders" to="/" />
        <NavItem icon={<Icon as={LocalOffer} size="2xs" />} label="Discounts" to="/" />
      </Stack>

      <Separator borderColor="rgba(255,255,255,0.12)" />

      <Box pt="200">
        <NavItem icon={<Icon as={Settings} size="2xs" />} label="Settings" to="/" />
      </Box>
    </Flex>
  );
};
