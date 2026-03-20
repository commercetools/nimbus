import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import {
  Button,
  TextInput,
  Checkbox,
  Badge,
  IconButton,
  Select,
  Stack,
  Text,
  Link,
  Switch,
  Tooltip,
} from "@commercetools/nimbus";
import { BinLinearIcon } from "@commercetools/nimbus-icons";

const meta: Meta = {
  title: "Perf/VisualRegression",
  parameters: {
    a11y: { test: "todo" },
  },
};
export default meta;

export const ButtonVariants: StoryObj = {
  render: () => (
    <Stack gap="200" padding="200">
      <Button variant="solid">Solid</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="plain">Plain</Button>
      <Button variant="solid" isDisabled>
        Disabled
      </Button>
      <Button variant="solid" size="xs">
        XS
      </Button>
      <Button variant="solid" size="sm">
        SM
      </Button>
      <Button variant="solid" size="md">
        MD
      </Button>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect.element(canvasElement).toMatchScreenshot("button-variants", {
      comparatorOptions: { allowedMismatchedPixelRatio: 0.005 },
    });
  },
};

export const TextInputVariants: StoryObj = {
  render: () => (
    <Stack gap="200" padding="200">
      <TextInput placeholder="Default" aria-label="default" />
      <TextInput placeholder="Disabled" aria-label="disabled" isDisabled />
      <TextInput placeholder="Invalid" aria-label="invalid" isInvalid />
      <TextInput placeholder="Read only" aria-label="readonly" isReadOnly />
      <TextInput placeholder="Small" aria-label="small" size="sm" />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect
      .element(canvasElement)
      .toMatchScreenshot("text-input-variants", {
        comparatorOptions: { allowedMismatchedPixelRatio: 0.005 },
      });
  },
};

export const CheckboxVariants: StoryObj = {
  render: () => (
    <Stack gap="200" padding="200">
      <Checkbox>Unchecked</Checkbox>
      <Checkbox defaultSelected>Checked</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect.element(canvasElement).toMatchScreenshot("checkbox-variants", {
      comparatorOptions: { allowedMismatchedPixelRatio: 0.005 },
    });
  },
};

export const BadgeVariants: StoryObj = {
  render: () => (
    <Stack gap="200" padding="200" direction="row">
      <Badge>Default</Badge>
      <Badge colorPalette="green">Green</Badge>
      <Badge colorPalette="red">Red</Badge>
      <Badge colorPalette="yellow">Yellow</Badge>
      <Badge colorPalette="blue">Blue</Badge>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect.element(canvasElement).toMatchScreenshot("badge-variants", {
      comparatorOptions: { allowedMismatchedPixelRatio: 0.005 },
    });
  },
};

export const IconButtonVariants: StoryObj = {
  render: () => (
    <Stack gap="200" padding="200" direction="row">
      <IconButton aria-label="delete" icon={<BinLinearIcon />} />
      <IconButton
        aria-label="delete"
        icon={<BinLinearIcon />}
        variant="solid"
      />
      <IconButton
        aria-label="delete"
        icon={<BinLinearIcon />}
        variant="outline"
      />
      <IconButton aria-label="delete" icon={<BinLinearIcon />} isDisabled />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect
      .element(canvasElement)
      .toMatchScreenshot("icon-button-variants", {
        comparatorOptions: { allowedMismatchedPixelRatio: 0.005 },
      });
  },
};

export const SelectVariants: StoryObj = {
  render: () => (
    <Stack gap="200" padding="200">
      <Select.Root>
        <Select.Options aria-label="test select" placeholder="Pick one">
          <Select.Option id="a">Alpha</Select.Option>
          <Select.Option id="b">Beta</Select.Option>
          <Select.Option id="c">Gamma</Select.Option>
        </Select.Options>
      </Select.Root>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect.element(canvasElement).toMatchScreenshot("select-variants", {
      comparatorOptions: { allowedMismatchedPixelRatio: 0.005 },
    });
  },
};

export const TextVariants: StoryObj = {
  render: () => (
    <Stack gap="200" padding="200">
      <Text>Default text</Text>
      <Text fontWeight="bold">Bold text</Text>
      <Text fontSize="300">Small text</Text>
      <Text fontSize="500">Large text</Text>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect.element(canvasElement).toMatchScreenshot("text-variants", {
      comparatorOptions: { allowedMismatchedPixelRatio: 0.005 },
    });
  },
};

export const LinkVariants: StoryObj = {
  render: () => (
    <Stack gap="200" padding="200">
      <Link href="#">Default link</Link>
      <Link href="#" isDisabled>
        Disabled link
      </Link>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect.element(canvasElement).toMatchScreenshot("link-variants", {
      comparatorOptions: { allowedMismatchedPixelRatio: 0.005 },
    });
  },
};

export const SwitchVariants: StoryObj = {
  render: () => (
    <Stack gap="200" padding="200">
      <Switch>Off</Switch>
      <Switch defaultSelected>On</Switch>
      <Switch isDisabled>Disabled</Switch>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect.element(canvasElement).toMatchScreenshot("switch-variants", {
      comparatorOptions: { allowedMismatchedPixelRatio: 0.005 },
    });
  },
};
