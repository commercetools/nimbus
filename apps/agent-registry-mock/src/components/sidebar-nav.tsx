import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Box, Flex, Text } from "@commercetools/nimbus";
import { ArrowBack, Hub, ManageAccounts, Person } from "@commercetools/nimbus-icons";

/**
 * Merchant Center navbar reference values (from application-shell/src/constants.ts
 * and @commercetools-uikit/design-system tokens):
 *
 *   backgroundColorForNavbar:  colorPrimary10 = hsl(240, 66%, 19%)  deep navy
 *   active item bg:            colorPrimary25 = hsl(240, 46%, 48%)
 *   hover bg:                  colorPrimary20 = hsl(240, 45%, 33%)
 *   text color (inactive):     colorNeutral   = hsl(232, 18%, 80%)
 *   text/icon color (active):  colorSurface   = #fff
 *   item height:               48px
 *   icon size:                 24px
 *   width (collapsed):         80px
 *   width (expanded):          256px
 *   border-radius on items:    8px
 *   font-weight (title):       600
 */

const SIDEBAR_WIDTH = "256px";

/* MC exact colors (from uiKit designTokens) */
const mcColors = {
  navBg: "hsl(240, 66%, 19%)",
  itemHover: "hsl(240, 45%, 33%)",
  itemActive: "hsl(240, 46%, 48%)",
  textInactive: "hsl(232, 18%, 80%)",
  textActive: "#fff",
  sectionLabel: "hsl(232, 18%, 60%)",
} as const;

interface NavItemProps {
  to: string;
  label: string;
  icon?: ReactNode;
  indent?: boolean;
}

const NavItem = ({ to, label, icon, indent }: NavItemProps) => (
  <NavLink to={to} end style={{ textDecoration: "none" }}>
    {({ isActive }) => (
      <Flex
        align="center"
        gap="200"
        pl={indent ? "800" : "300"}
        pr="300"
        height="48px"
        borderRadius="200"
        mx="200"
        style={{
          background: isActive ? mcColors.itemActive : "transparent",
          color: isActive ? mcColors.textActive : mcColors.textInactive,
          cursor: "pointer",
          transition: "background 150ms ease-out",
        }}
        css={{
          "&:hover": {
            background: isActive ? mcColors.itemActive : mcColors.itemHover,
          },
        }}
      >
        {icon && (
          <Box
            flexShrink={0}
            style={{
              color: isActive ? mcColors.textActive : mcColors.textInactive,
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        )}
        <Text
          fontSize="sm"
          fontWeight={isActive ? "semibold" : "medium"}
          style={{ color: "inherit" }}
        >
          {label}
        </Text>
      </Flex>
    )}
  </NavLink>
);

export const SidebarNav = () => {
  return (
    <Box
      as="nav"
      aria-label="Main navigation"
      width={SIDEBAR_WIDTH}
      minWidth={SIDEBAR_WIDTH}
      height="100vh"
      py="200"
      overflowY="auto"
      style={{ background: mcColors.navBg }}
    >
      <Flex direction="column" gap="50">
        <Box
          mx="200"
          mb="200"
          pb="200"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
        >
          <NavLink to="/" style={{ textDecoration: "none" }}>
            {() => (
              <Flex
                align="center"
                gap="150"
                pl="200"
                pr="300"
                py="150"
                borderRadius="200"
                style={{ color: mcColors.textInactive, cursor: "pointer" }}
                css={{ "&:hover": { background: mcColors.itemHover } }}
              >
                <Box flexShrink={0} width="16px" height="16px" display="flex" alignItems="center">
                  <ArrowBack />
                </Box>
                <Text fontSize="xs" fontWeight="medium" style={{ color: "inherit" }}>
                  Back to project
                </Text>
              </Flex>
            )}
          </NavLink>
        </Box>
        <NavItem to="/profile" label="Profile" icon={<Person />} />
        <NavItem to="/account" label="Account" icon={<ManageAccounts />} />

        <Box mt="400" mb="100" pl="500" pr="400">
          <Flex align="center" gap="200">
            <Box
              style={{ color: mcColors.sectionLabel }}
              width="24px"
              height="24px"
              display="flex"
            >
              <Hub />
            </Box>
            <Text
              fontSize="2xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              style={{ color: mcColors.sectionLabel }}
            >
              Agent Sphere
            </Text>
          </Flex>
        </Box>
        <NavItem to="/agents" label="My Agents" indent />
        <NavItem to="/agents/explore" label="Explore" indent />
      </Flex>
    </Box>
  );
};
