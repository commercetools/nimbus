/* -------------------------------------------------------------------------- */
/* AppShell — the console chrome: persistent sidebar + sticky top bar.        */
/*                                                                            */
/* All chrome is built from Nimbus primitives; colors come from the           */
/* nimbus-viz chart theme so the whole app (chrome + charts) re-themes in one */
/* move when the color mode flips.                                            */
/* -------------------------------------------------------------------------- */

import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Text,
  Icon,
  IconButton,
  Button,
  Avatar,
  useColorMode,
} from "@commercetools/nimbus";
import { useChartTheme } from "@commercetools/nimbus-viz";
import {
  Bolt,
  Storefront,
  ExpandMore,
  CalendarMonth,
  LightMode,
  DarkMode,
  Notifications,
} from "@commercetools/nimbus-icons";
import type { ComponentType } from "react";
import { NAV, NAV_BY_PATH } from "./nav";

const SIDEBAR_WIDTH = "256px";

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */

function NavRow({
  icon,
  label,
  active,
}: {
  icon: ComponentType;
  label: string;
  active: boolean;
}) {
  const theme = useChartTheme();
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="10px"
      paddingX="12px"
      paddingY="9px"
      borderRadius="9px"
      color={active ? theme.ink : theme.mutedInk}
      backgroundColor={active ? theme.surfacePage : "transparent"}
      boxShadow={active ? `inset 3px 0 0 ${theme.accent}` : "none"}
      fontWeight={active ? "600" : "500"}
      transition="background-color 120ms ease, color 120ms ease"
      _hover={{
        backgroundColor: theme.surfacePage,
        color: theme.ink,
      }}
    >
      <Icon
        as={icon}
        boxSize="19px"
        color={active ? theme.accent : "currentColor"}
      />
      <Text fontSize="14px" color="currentColor">
        {label}
      </Text>
    </Box>
  );
}

function Sidebar() {
  const theme = useChartTheme();
  return (
    <Box
      as="nav"
      aria-label="Primary"
      width={SIDEBAR_WIDTH}
      flexShrink="0"
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      position="sticky"
      top="0"
      alignSelf="flex-start"
      height="100vh"
      backgroundColor={theme.surface}
      borderRight={`1px solid ${theme.grid}`}
    >
      {/* Brand lockup */}
      <Box
        display="flex"
        alignItems="center"
        gap="11px"
        paddingX="20px"
        height="61px"
        flexShrink="0"
        borderBottom={`1px solid ${theme.grid}`}
      >
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          width="32px"
          height="32px"
          borderRadius="9px"
          backgroundColor={theme.accent}
          color={theme.surface}
          flexShrink="0"
        >
          <Icon as={Bolt} boxSize="20px" />
        </Box>
        <Box lineHeight="1.15">
          <Text fontSize="15px" fontWeight="700" color={theme.ink}>
            Northwind
          </Text>
          <Text fontSize="11px" color={theme.mutedInk}>
            Commerce Console
          </Text>
        </Box>
      </Box>

      {/* Nav groups */}
      <Box
        flex="1"
        overflowY="auto"
        paddingX="12px"
        paddingY="16px"
        display="flex"
        flexDirection="column"
        gap="20px"
      >
        {NAV.map((group) => (
          <Box key={group.heading}>
            <Text
              fontSize="10px"
              fontWeight="700"
              letterSpacing="0.07em"
              textTransform="uppercase"
              color={theme.mutedInk}
              paddingX="12px"
              marginBottom="6px"
            >
              {group.heading}
            </Text>
            <Box display="flex" flexDirection="column" gap="2px">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  style={{ textDecoration: "none" }}
                >
                  {({ isActive }) => (
                    <NavRow
                      icon={item.icon}
                      label={item.label}
                      active={isActive}
                    />
                  )}
                </NavLink>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Footer — store identity */}
      <Box
        display="flex"
        alignItems="center"
        gap="10px"
        paddingX="16px"
        paddingY="14px"
        borderTop={`1px solid ${theme.grid}`}
        flexShrink="0"
      >
        <Avatar size="xs" firstName="Ada" lastName="Rivera" />
        <Box lineHeight="1.2" flex="1" minWidth="0">
          <Text fontSize="13px" fontWeight="600" color={theme.ink}>
            Ada Rivera
          </Text>
          <Text fontSize="11px" color={theme.mutedInk}>
            Store operator
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Top bar                                                                    */
/* -------------------------------------------------------------------------- */

function TopBar() {
  const theme = useChartTheme();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="20"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap="16px"
      height="61px"
      paddingX="28px"
      backgroundColor={theme.surface}
      borderBottom={`1px solid ${theme.grid}`}
    >
      {/* Store switcher */}
      <Box display="flex" alignItems="center" gap="10px">
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          width="28px"
          height="28px"
          borderRadius="8px"
          backgroundColor={theme.surfacePage}
          color={theme.accent}
        >
          <Icon as={Storefront} boxSize="17px" />
        </Box>
        <Text fontSize="14px" fontWeight="600" color={theme.ink}>
          Northwind Supply Co.
        </Text>
        <Icon as={ExpandMore} boxSize="18px" color={theme.mutedInk} />
      </Box>

      {/* Controls */}
      <Box display="flex" alignItems="center" gap="8px">
        <Button variant="outline" size="xs">
          <Icon as={CalendarMonth} boxSize="16px" />
          Last 12 months
          <Icon as={ExpandMore} boxSize="16px" />
        </Button>
        <Box position="relative" display="inline-flex">
          <IconButton
            aria-label="Notifications"
            variant="ghost"
            size="xs"
          >
            <Notifications />
          </IconButton>
          <Box
            position="absolute"
            top="6px"
            right="6px"
            width="7px"
            height="7px"
            borderRadius="full"
            backgroundColor={theme.negative}
            pointerEvents="none"
          />
        </Box>
        <IconButton
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          variant="ghost"
          size="xs"
          onPress={toggleColorMode}
        >
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Shell                                                                      */
/* -------------------------------------------------------------------------- */

export function AppShell() {
  const theme = useChartTheme();
  const { pathname } = useLocation();
  // Touch the lookup so an unknown route still renders the shell cleanly.
  void NAV_BY_PATH[pathname];

  return (
    <Box
      display="flex"
      minHeight="100vh"
      backgroundColor={theme.surfacePage}
      color={theme.ink}
    >
      <Sidebar />
      <Box flex="1" display="flex" flexDirection="column" minWidth="0">
        <TopBar />
        <Box
          as="main"
          flex="1"
          width="100%"
          maxWidth="1440px"
          marginX="auto"
          paddingX={{ base: "16px", md: "28px" }}
          paddingY="24px"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
