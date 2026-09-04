import { Flex, Stack, Icon, Tooltip } from "@commercetools/nimbus";
import { Home, Inventory, LocalOffer } from "@commercetools/nimbus-icons";
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
    <Tooltip.Content placement="right">{label}</Tooltip.Content>
  </Tooltip.Root>
);

/**
 * Simplified sidebar with three icons:
 * - Home (journey selection landing page)
 * - Products (product list and product detail)
 * - Discounts (discount list, discount detail, and configuration playground)
 */
export const Sidebar = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      height="100%"
      bg="neutral.12"
      py="300"
      px="200"
      gap="200"
      overflow="hidden"
      width="48px"
    >
      <Stack gap="200" pt="100" alignItems="center">
        <NavItem icon={<Icon as={Home} size="xs" />} label="Home" to="/" />
        <NavItem
          icon={<Icon as={Inventory} size="xs" />}
          label="Products"
          to="/products"
        />
        <NavItem
          icon={<Icon as={LocalOffer} size="xs" />}
          label="Discounts"
          to="/discounts"
        />
      </Stack>
    </Flex>
  );
};
