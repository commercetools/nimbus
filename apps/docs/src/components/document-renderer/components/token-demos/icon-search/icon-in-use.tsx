import type { FC, ReactNode, SVGProps } from "react";
import {
  Box,
  Stack,
  Flex,
  Text,
  SimpleGrid,
  Button,
  IconButton,
  Badge,
  TextInput,
  Alert,
  Menu,
  TabNav,
  Icon,
} from "@commercetools/nimbus";

/** A raw icon component from `@commercetools/nimbus-icons` (an SVG). */
type Glyph = FC<SVGProps<SVGSVGElement>>;

/** A single labeled showcase cell. */
const Demo = ({ label, children }: { label: string; children: ReactNode }) => (
  <Stack
    gap="300"
    p="500"
    border="solid-25"
    borderColor="neutral.5"
    borderRadius="200"
  >
    <Text textStyle="xs" fontWeight="600" color="neutral.10">
      {label}
    </Text>
    <Flex align="center" gap="300" wrap="wrap" minH="40px">
      {children}
    </Flex>
  </Stack>
);

/**
 * Renders the given icon inside a representative set of Nimbus components so a
 * consumer can see how it reads in real usage.
 */
export const IconInUse = ({
  name,
  Component,
}: {
  name: string;
  Component: Glyph;
}) => (
  <SimpleGrid columns={[1, 2, 2, 3]} gap="400">
    <Demo label="IconButton">
      <IconButton aria-label={name} size="xs">
        <Component />
      </IconButton>
      <IconButton aria-label={name} variant="outline">
        <Component />
      </IconButton>
      <IconButton aria-label={name} variant="ghost">
        <Component />
      </IconButton>
    </Demo>

    <Demo label="Button">
      <Button size="xs">
        <Component /> Label
      </Button>
      <Button variant="outline">
        <Component /> Label
      </Button>
    </Demo>

    <Box gridColumn={{ base: "auto", sm: "span 2" }}>
      <Demo label="TextInput (leading element)">
        <TextInput
          aria-label="Example input"
          placeholder="Search…"
          width="full"
          leadingElement={
            <Icon>
              <Component />
            </Icon>
          }
        />
      </Demo>
    </Box>

    <Demo label="Badge">
      <Badge>
        <Component /> Label
      </Badge>
      <Badge colorPalette="primary">
        <Component /> Active
      </Badge>
    </Demo>

    <Demo label="Menu item">
      <Menu.Root>
        <Menu.Trigger>Open menu</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="example">
            <Icon slot="icon">
              <Component />
            </Icon>
            <Text slot="label">{name}</Text>
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </Demo>

    <Demo label="TabNav">
      <TabNav.Root aria-label="Example navigation">
        <TabNav.Item href="/icons" isCurrent>
          <Flex as="span" align="center" gap="100">
            <Component /> Overview
          </Flex>
        </TabNav.Item>
        <TabNav.Item href="/icons">Settings</TabNav.Item>
      </TabNav.Root>
    </Demo>

    <Box gridColumn="1 / -1">
      <Demo label="Alert (action button)">
        <Box width="full" maxWidth="2xl">
          <Alert.Root colorPalette="info" variant="outlined">
            <Alert.Title>Heads up</Alert.Title>
            <Alert.Description>
              Icons commonly appear in an alert’s action buttons.
            </Alert.Description>
            <Alert.Actions>
              <Button size="xs">
                <Component /> Action
              </Button>
            </Alert.Actions>
          </Alert.Root>
        </Box>
      </Demo>
    </Box>
  </SimpleGrid>
);
