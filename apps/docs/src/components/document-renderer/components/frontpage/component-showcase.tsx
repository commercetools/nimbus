import type { ReactNode } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Link,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  TextInput,
} from "@commercetools/nimbus";
import { Edit } from "@commercetools/nimbus-icons";

type ShowcaseItem = {
  name: string;
  /** Absolute route path to the component's documentation. */
  href: string;
  /** A live, interactive instance of the component. */
  demo: ReactNode;
};

const items: ShowcaseItem[] = [
  {
    name: "Button",
    href: "/components/buttons/button",
    demo: (
      <Button colorPalette="primary" size="md" variant="solid">
        Button
      </Button>
    ),
  },
  {
    name: "Icon button",
    href: "/components/buttons/icon-button",
    demo: (
      <IconButton aria-label="Edit" colorPalette="primary" variant="solid">
        <Edit />
      </IconButton>
    ),
  },
  {
    name: "Text input",
    href: "/components/inputs/text-input",
    demo: (
      <TextInput
        aria-label="Text input demo"
        placeholder="Type here…"
        width="full"
        minWidth="0"
      />
    ),
  },
  {
    name: "Select",
    href: "/components/inputs/select-input",
    demo: (
      <Select.Root size="md" aria-label="Select demo" width="full" minWidth="0">
        <Select.Options>
          <Select.Option>Red</Select.Option>
          <Select.Option>Green</Select.Option>
          <Select.Option>Blue</Select.Option>
        </Select.Options>
      </Select.Root>
    ),
  },
  {
    name: "Checkbox",
    href: "/components/inputs/checkbox",
    demo: <Checkbox defaultSelected>Checkbox</Checkbox>,
  },
  {
    name: "Switch",
    href: "/components/inputs/switch",
    demo: <Switch defaultSelected>Switch</Switch>,
  },
  {
    name: "Badge",
    href: "/components/data-display/badge",
    demo: <Badge colorPalette="primary">Badge</Badge>,
  },
  {
    name: "Avatar",
    href: "/components/media/avatar",
    demo: <Avatar firstName="Nimbus" lastName="User" />,
  },
];

/**
 * A grid of live, interactive Nimbus components. Each tile renders a real
 * component (toggle the switch, type in the input, open the select) and links
 * to that component's docs via a labelled footer link. Keeping the link
 * separate from the demo avoids nesting an interactive control inside an anchor.
 */
export const ComponentShowcase = () => {
  return (
    <Stack as="section" gap="400">
      <Heading size="xl" color="neutral.12">
        Live components
      </Heading>
      <SimpleGrid columns={{ base: 2, sm: 3, lg: 4 }} gap="400">
        {items.map((item) => (
          <Card.Root key={item.href} variant="outlined" size="md">
            <Card.Body>
              <Flex direction="column" gap="400" height="full">
                <Flex
                  flex="1"
                  align="center"
                  justify="center"
                  minHeight="4rem"
                  py="400"
                >
                  {item.demo}
                </Flex>
                <Link
                  href={item.href}
                  textDecoration="none"
                  color="neutral.11"
                  fontWeight="600"
                  _hover={{ color: "primary.11" }}
                >
                  {item.name} →
                </Link>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Stack>
  );
};
