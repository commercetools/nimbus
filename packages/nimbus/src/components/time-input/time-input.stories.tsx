import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeInput } from "./time-input";
import { Button, FormField, Stack, Text } from "@/components";
import { parseZonedDateTime, Time } from "@internationalized/date";
import { useState } from "react";
import type { TimeValue } from "react-aria";
import { I18nProvider } from "react-aria";
import { userEvent, within, expect, fn } from "storybook/test";

const inventionOfTheInternet = parseZonedDateTime(
  "1993-04-30T14:30[Europe/Zurich]"
);

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof TimeInput> = {
  title: "components/TimeInput",
  component: TimeInput,
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof TimeInput>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    ["aria-label"]: "Enter a time",
    onBlur: fn(),
    onFocus: fn(),
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const timeInput = canvas.getByRole("group", { name: /Enter a time/i });
    const segmentGroup = timeInput;
    const segments = segmentGroup
      ? Array.from(segmentGroup.querySelectorAll('[role="spinbutton"]'))
      : [];

    await step("TimeInput renders with accessible structure", async () => {
      await expect(timeInput).toBeInTheDocument();
      await expect(segments.length).toBeGreaterThan(0);
    });

    await step("TimeInput can be focused", async () => {
      await userEvent.tab();
      const firstSegment = segments[0];
      await expect(firstSegment).toHaveFocus();
      await expect(args.onFocus).toHaveBeenCalledTimes(1);
    });

    await step("TimeInput segments can be changed", async () => {
      const hourSegment = segments[0];
      await expect(hourSegment).toHaveFocus();

      // Increase the hour using arrow up
      await userEvent.keyboard("{ArrowUp}");
      await userEvent.keyboard("{ArrowUp}");
      // Move to the minute segment
      await userEvent.keyboard("{ArrowRight}");
      const minuteSegment = segments[1];
      await expect(minuteSegment).toHaveFocus();
      // Increase the minute using arrow up
      await userEvent.keyboard("{ArrowUp}");
      await expect(args.onChange).toHaveBeenCalledTimes(1);
      await userEvent.keyboard("{ArrowUp}");
      await expect(args.onChange).toHaveBeenCalledTimes(2);

      // Check if the time value is 1:01
      const hourSegmentValue = segments[0].textContent;
      const minuteSegmentValue = segments[1].textContent;
      await expect(hourSegmentValue).toBe("1");
      await expect(minuteSegmentValue).toBe("01");
    });
  },
};

/**
 * Showcase Uncontrolled
 */
export const Uncontrolled: Story = {
  args: {
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With defaultValue (9:30 AM)</Text>
        <TimeInput
          {...args}
          defaultValue={new Time(9, 30)}
          aria-label="With default value"
        />
        <Text>With defaultValue (3:45 PM)</Text>
        <TimeInput
          {...args}
          defaultValue={new Time(15, 45)}
          aria-label="With different default value"
        />
        <Text>No defaultValue (empty)</Text>
        <TimeInput {...args} aria-label="Without default value" />
      </Stack>
    );
  },
};

/**
 * Showcase Controlled
 * Demonstrates how to use the TimeInput as a controlled component
 * with the value property and state management
 */
export const Controlled: Story = {
  args: {
    hideTimeZone: true,
  },
  render: (args) => {
    const [time, setTime] = useState<TimeValue | null>(new Time(12, 0));
    const handleTimeChange = (value: TimeValue | null) => {
      if (value) {
        setTime(value as Time);
      }
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>
          Controlled TimeInput (
          <span>current value: {time === null ? "null" : time.toString()}</span>
          )
        </Text>
        <TimeInput
          {...args}
          value={time}
          onChange={handleTimeChange}
          aria-label="Controlled time input"
          data-testid="controlled-time-input"
        />
        <Button onPress={() => setTime(null)} data-testid="reset-button">
          Reset
        </Button>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const timeInput = canvas.getByTestId("controlled-time-input");
    const resetButton = canvas.getByTestId("reset-button");
    const segmentGroup = timeInput.querySelector('[role="group"]');
    const controlledSegments = segmentGroup
      ? Array.from(segmentGroup.querySelectorAll('[role="spinbutton"]'))
      : [];

    await step("TimeInput starts with controlled value of 12:00", async () => {
      const timeValue = canvas.getByText(/current value: 12:00/i);
      await expect(timeValue).toBeInTheDocument();
    });

    await step(
      "Can update controlled value through user interaction",
      async () => {
        await userEvent.tab();
        const hourSegment = controlledSegments[0];
        await expect(hourSegment).toHaveFocus();

        // Increase the hour to 1
        await userEvent.keyboard("{ArrowUp}");

        // Check if the display value updates
        const updatedTimeValue = canvas.getByText(/current value: 13:00/i);
        await expect(updatedTimeValue).toBeInTheDocument();
      }
    );

    await step("Reset button clears the time value", async () => {
      await userEvent.click(resetButton);
      const clearedState = canvas.getByText(/current value: /i);
      await expect(clearedState).toBeInTheDocument();
    });
  },
};

/**
 * Showcase IsInvalid
 */
export const IsInvalid: Story = {
  args: {
    isInvalid: true,
    ["aria-label"]: "IsInvalid true",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const timeInput = canvas.getByRole("group");

    await step(
      "TimeInput has data-invalid attribute when isInvalid is true",
      async () => {
        await expect(timeInput).toHaveAttribute("data-invalid");
      }
    );
  },
};

/**
 * Showcase IsDisabled
 */
export const IsDisabled: Story = {
  args: {
    isDisabled: true,
    ["aria-label"]: "isDisabled true",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const timeInput = canvas.getByRole("group");

    await step("Disabled TimeInput has proper ARIA attributes", async () => {
      await expect(timeInput).toHaveAttribute("aria-disabled", "true");

      const segments = Array.from(
        timeInput.querySelectorAll('[role="spinbutton"]')
      );
      for (const segment of segments) {
        await expect(segment).toHaveAttribute("aria-disabled", "true");
      }
    });

    await step("Disabled TimeInput cannot be focused with tab", async () => {
      await userEvent.tab(); // Focus should not go to disabled input

      const segments = Array.from(
        timeInput.querySelectorAll('[role="spinbutton"]')
      );
      for (const segment of segments) {
        await expect(segment).not.toHaveFocus();
      }
    });
  },
};

/**
 * Showcase IsReadOnly
 */
export const IsReadOnly: Story = {
  args: {
    defaultValue: inventionOfTheInternet,
    isReadOnly: true,
    ["aria-label"]: "isReadOnly true",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const timeInput = canvas.getByRole("group");
    const segments = Array.from(
      timeInput.querySelectorAll('[role="spinbutton"]')
    );
    const hourSegment = segments[0];
    const initialHourValue = hourSegment.textContent;

    await step(
      "ReadOnly TimeInput segments have proper ARIA attributes",
      async () => {
        for (const segment of segments) {
          await expect(segment).toHaveAttribute("aria-readonly", "true");
        }
      }
    );

    await step("ReadOnly TimeInput value cannot be changed", async () => {
      // Try to focus and change the hour segment
      await userEvent.tab();
      await expect(hourSegment).toHaveFocus();

      // Try to increase the hour
      await userEvent.keyboard("{ArrowUp}{ArrowUp}");

      // The value should not change
      await expect(hourSegment.textContent).toBe(initialHourValue);
    });
  },
};

/**
 * Showcase IsRequired
 */
export const IsRequired: Story = {
  args: {
    hideTimeZone: true,
    "aria-label": "IsRequired true",
    isRequired: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const timeInput = canvas.getByRole("group", { name: /IsRequired true/i });
    const segments = Array.from(
      timeInput.querySelectorAll('[role="spinbutton"]')
    );

    await step(
      "Required TimeInput segments have proper ARIA attributes",
      async () => {
        for (const segment of segments) {
          await expect(segment).toHaveAttribute("aria-required", "true");
        }
      }
    );
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="column">
        {["sm", "md"].map((size) => (
          <TimeInput
            aria-label={`${size}-size TimeInput`}
            key={size}
            {...args}
            size={size as "sm" | "md"}
          />
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Variants
 */
export const Variants: Story = {
  render: (args) => {
    const variants = ["ghost", "solid"] as const;

    return (
      <Stack direction="column">
        {variants.map((variant) => (
          <TimeInput
            aria-label={`${variant}-variant TimeInput`}
            key={variant}
            {...args}
            variant={variant}
          />
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Hour Cycle
 */
export const HourCycle: Story = {
  args: {
    defaultValue: inventionOfTheInternet,
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400">
        <TimeInput
          {...args}
          hourCycle={12}
          aria-label="Hour Cycle 12"
          data-testid="hour-cycle-12"
        />
        <TimeInput
          {...args}
          hourCycle={24}
          aria-label="Hour Cycle 24"
          data-testid="hour-cycle-24"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Get both timeInputs
    const hourCycle12Input = canvas.getByTestId("hour-cycle-12");
    const hourCycle24Input = canvas.getByTestId("hour-cycle-24");

    // Get segments for both inputs
    const cycle12Segments = Array.from(
      hourCycle12Input.querySelectorAll('[role="spinbutton"]')
    );
    const cycle24Segments = Array.from(
      hourCycle24Input.querySelectorAll('[role="spinbutton"]')
    );

    await step("Verify hour cycle formats", async () => {
      // 12-hour format should display 2 PM (from 14:30)
      await expect(cycle12Segments[0]).toHaveTextContent("2");
      await expect(
        cycle12Segments[cycle12Segments.length - 1]
      ).toHaveTextContent("PM");

      // 24-hour format should display 14
      await expect(cycle24Segments[0]).toHaveTextContent("14");
    });

    await step("AM/PM can be toggled in 12-hour format", async () => {
      // Focus and navigate to AM/PM segment
      await userEvent.tab();
      for (let i = 0; i < cycle12Segments.length - 1; i++) {
        await userEvent.keyboard("{ArrowRight}");
      }

      // Toggle AM/PM
      const amPmSegment = cycle12Segments[cycle12Segments.length - 1];
      await userEvent.keyboard("{ArrowDown}");
      await expect(amPmSegment).toHaveTextContent("AM");
    });
  },
};

/**
 * Showcase Hide Time Zone
 */
export const HideTimeZone: Story = {
  args: {
    defaultValue: inventionOfTheInternet,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400">
        <Text>Show the timezone (if present in value) (default)</Text>
        <TimeInput
          {...args}
          aria-label="Timezone visible"
          data-testid="timezone-visible"
        />
        <Text>Hide the timezone</Text>
        <TimeInput
          {...args}
          aria-label="Timezone hidden"
          hideTimeZone
          data-testid="timezone-hidden"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Get both timeInputs
    const timezoneVisibleInput = canvas.getByTestId("timezone-visible");
    const timezoneHiddenInput = canvas.getByTestId("timezone-hidden");

    await step(
      "TimeInput with visible timezone includes timezone segment",
      async () => {
        // Find the timezone segment using the data-type attribute
        const timezoneSegment = timezoneVisibleInput.querySelector(
          '[data-type="timeZoneName"]'
        );

        // Check if the timezone segment exists and has the expected content
        await expect(timezoneSegment).not.toBeNull();
        await expect(timezoneSegment).toHaveTextContent("GMT+2");
      }
    );

    await step(
      "TimeInput with hideTimeZone does not display timezone segment",
      async () => {
        // Check that there's no timezone segment in the hidden timezone input
        const timezoneSegment = timezoneHiddenInput.querySelector(
          '[data-type="timeZoneName"]'
        );
        await expect(timezoneSegment).toBeNull();

        // Get all segments to verify none of them has timezone content
        const hiddenSegments = Array.from(
          timezoneHiddenInput.querySelectorAll('[role="spinbutton"]')
        );

        // Check that none of the segments contains timezone information
        for (const segment of hiddenSegments) {
          await expect(segment).not.toHaveTextContent("GMT+2");
        }
      }
    );
  },
};

/**
 * Showcase Granularity
 */
export const Granularity: Story = {
  args: {
    defaultValue: inventionOfTheInternet,
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Granularity: hour</Text>
        <TimeInput
          {...args}
          granularity="hour"
          aria-label="Granularity hour"
          data-testid="granularity-hour"
        />
        <Text>Granularity: minute (default)</Text>
        <TimeInput
          {...args}
          granularity="minute"
          aria-label="Granularity minute"
          data-testid="granularity-minute"
        />
        <Text>Granularity: second</Text>
        <TimeInput
          {...args}
          granularity="second"
          aria-label="Granularity second"
          data-testid="granularity-second"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Get the three different granularity inputs
    const hourGranularityInput = canvas.getByTestId("granularity-hour");
    const minuteGranularityInput = canvas.getByTestId("granularity-minute");
    const secondGranularityInput = canvas.getByTestId("granularity-second");

    await step("Hour granularity shows only hour segment", async () => {
      // Get all segments for the hour granularity input
      const hourSegments = Array.from(
        hourGranularityInput.querySelectorAll('[role="spinbutton"]')
      );

      // Check that there is only one segment (hour)
      await expect(hourSegments.length).toBe(2);
      await expect(hourSegments[0]).toHaveTextContent("2");
    });

    await step(
      "Minute granularity shows hour and minute segments",
      async () => {
        // Get all segments for the minute granularity input
        const minuteSegments = Array.from(
          minuteGranularityInput.querySelectorAll('[role="spinbutton"]')
        );

        // Check that there are exactly two segments (hour and minute)
        await expect(minuteSegments.length).toBe(3);
        await expect(minuteSegments[0]).toHaveTextContent("2");
        await expect(minuteSegments[1]).toHaveTextContent("30");
      }
    );

    await step(
      "Second granularity shows hour, minute, and second segments",
      async () => {
        // Get all segments for the second granularity input
        const secondSegments = Array.from(
          secondGranularityInput.querySelectorAll('[role="spinbutton"]')
        );

        // Check that there are exactly three segments (hour, minute, second)
        await expect(secondSegments.length).toBe(4);
        await expect(secondSegments[0]).toHaveTextContent("2");
        await expect(secondSegments[1]).toHaveTextContent("30");
        await expect(secondSegments[2]).toHaveTextContent("0"); // Second should be 0
      }
    );
  },
};

/**
 * Showcase Should Force Leading Zeros
 */
export const ShouldForceLeadingZeros: Story = {
  args: {
    defaultValue: new Time(2, 5), // Use a single-digit hour and minute
    hideTimeZone: true,
    shouldForceLeadingZeros: true,
    "aria-label": "Force leading zeros true",
  },
  render: (args) => (
    <TimeInput {...args} data-testid="leading-zeros-time-input" />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const timeInput = canvas.getByTestId("leading-zeros-time-input");
    const segments = Array.from(
      timeInput.querySelectorAll('[role="spinbutton"]')
    );

    await step(
      "TimeInput with shouldForceLeadingZeros displays leading zeros for single-digit values",
      async () => {
        // Get the hour and minute segments
        const hourSegment = segments[0];
        const minuteSegment = segments[1];

        // Verify that both hour and minute have leading zeros
        await expect(hourSegment).toHaveTextContent("02");
        await expect(minuteSegment).toHaveTextContent("05");
      }
    );
  },
};

/**
 * Showcase Placeholder Value
 * Unlike one could expect, the placeholderValue is not being displayed right away.
 * It rather controls the default values of each segment when the user first interacts with them
 */
export const PlaceholderValue: Story = {
  args: {
    placeholderValue: new Time(10, 0),
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With placeholderValue (starts with 10:00 AM)</Text>
        <TimeInput
          {...args}
          aria-label="With placeholder value"
          data-testid="placeholder-time-input"
        />
        <Text>Without placeholderValue (default placeholder)</Text>
        <TimeInput
          {...args}
          placeholderValue={undefined}
          aria-label="Without placeholder value"
          hideTimeZone={true}
          data-testid="no-placeholder-time-input"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Get both TimeInput components
    const withPlaceholderInput = canvas.getByTestId("placeholder-time-input");
    const withoutPlaceholderInput = canvas.getByTestId(
      "no-placeholder-time-input"
    );

    await step("Interacting with TimeInput with placeholderValue", async () => {
      // Tab to focus the first TimeInput
      await userEvent.tab();

      // Get the hour and minute segments using data-type
      const hourSegment =
        withPlaceholderInput.querySelector('[data-type="hour"]')!;
      const minuteSegment = withPlaceholderInput.querySelector(
        '[data-type="minute"]'
      )!;

      await expect(hourSegment).toHaveFocus();
      await userEvent.keyboard("{ArrowUp}");
      await expect(hourSegment).toHaveTextContent("10");
      await userEvent.keyboard("{ArrowRight}");
      await expect(minuteSegment).toHaveFocus();
      await userEvent.keyboard("{ArrowUp}");
      await expect(minuteSegment).toHaveTextContent("0");
    });

    await step(
      "Interacting with TimeInput without placeholderValue",
      async () => {
        // Tab to focus the second TimeInput
        await userEvent.tab();
        await userEvent.tab();

        // Get the hour and minute segments using data-type
        const hourSegment =
          withoutPlaceholderInput.querySelector('[data-type="hour"]')!;
        const minuteSegment = withoutPlaceholderInput.querySelector(
          '[data-type="minute"]'
        )!;

        await expect(hourSegment).toHaveFocus();
        await userEvent.keyboard("{ArrowUp}");
        await expect(hourSegment.textContent).toBe("12");
        await userEvent.keyboard("{ArrowRight}");
        await expect(minuteSegment).toHaveFocus();
        await userEvent.keyboard("{ArrowUp}");

        await expect(minuteSegment.textContent).not.toBe("––");
      }
    );
  },
};

/**
 * Showcase Min property
 */
export const MinValue: Story = {
  args: {
    minValue: new Time(9, 0), // 9:00 AM
    "aria-label": "Min value time input",
    hideTimeZone: true,
  },
  render: (args) => <TimeInput {...args} data-testid="min-value-time-input" />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const timeInput = canvas.getByTestId("min-value-time-input");
    const segmentGroup = timeInput.querySelector('[role="group"]');
    const segments = segmentGroup
      ? Array.from(segmentGroup.querySelectorAll('[role="spinbutton"]'))
      : [];

    const hourSegment = segments[0];

    await step("Testing value above minimum (10:00 AM is valid)", async () => {
      // Focus the hour segment
      await userEvent.tab();
      await expect(hourSegment).toHaveFocus();

      // Set hour
      await userEvent.keyboard("10");
      // Set Minute
      await userEvent.keyboard("00");
      // set day period
      await userEvent.keyboard("AM");

      // Tab out to trigger validation
      await userEvent.tab();

      // Check that no segments have aria-invalid attribute
      for (const segment of segments) {
        await expect(segment).not.toHaveAttribute("aria-invalid");
      }
    });

    await step("Testing value below minimum (8:00 AM is invalid)", async () => {
      // Tab back to the input
      await userEvent.tab({ shift: true });

      // Focus and set hour to 8
      await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
      await expect(hourSegment).toHaveFocus();

      // Set hour
      await userEvent.keyboard("08");
      // Set Minute
      await userEvent.keyboard("00");
      // set day period
      await userEvent.keyboard("AM");

      // Tab out to trigger validation
      await userEvent.tab();

      // Check that no segments have aria-invalid attribute
      for (const segment of segments) {
        await expect(segment).toHaveAttribute("aria-invalid");
      }
    });

    await step(
      "Testing value exactly at minimum (9:00 AM is valid)",
      async () => {
        // Tab back to the input
        await userEvent.tab({ shift: true });

        // Focus and set hour to 9
        await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
        await expect(hourSegment).toHaveFocus();
        // Set hour
        await userEvent.keyboard("09");
        // Set Minute
        await userEvent.keyboard("00");
        // set day period
        await userEvent.keyboard("AM");

        // Tab out to trigger validation
        await userEvent.tab();

        // Check that no segments have aria-invalid attribute
        for (const segment of segments) {
          await expect(segment).not.toHaveAttribute("aria-invalid");
        }
      }
    );
  },
};

/**
 * Showcase Max property
 */
export const MaxValue: Story = {
  args: {
    maxValue: new Time(17, 0), // 5:00 PM
    "aria-label": "Max value time input",
    hideTimeZone: true,
  },
  render: (args) => <TimeInput {...args} data-testid="max-value-time-input" />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const timeInput = canvas.getByTestId("max-value-time-input");
    const segmentGroup = timeInput.querySelector('[role="group"]');
    const segments = segmentGroup
      ? Array.from(segmentGroup.querySelectorAll('[role="spinbutton"]'))
      : [];

    const hourSegment = segments[0];

    await step("Testing value below maximum (4:00 PM is valid)", async () => {
      // Focus the hour segment
      await userEvent.tab();
      await expect(hourSegment).toHaveFocus();

      // Set hour
      await userEvent.keyboard("04");
      // Set Minute
      await userEvent.keyboard("00");
      // set day period
      await userEvent.keyboard("PM");

      // Tab out to trigger validation
      await userEvent.tab();

      // Check that no segments have aria-invalid attribute
      for (const segment of segments) {
        await expect(segment).not.toHaveAttribute("aria-invalid");
      }
    });

    await step("Testing value above maximum (6:00 PM is invalid)", async () => {
      // Tab back to the input
      await userEvent.tab({ shift: true });

      // Focus and set hour to 6
      await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
      await expect(hourSegment).toHaveFocus();

      // Set hour
      await userEvent.keyboard("06");
      // Set Minute
      await userEvent.keyboard("00");
      // set day period
      await userEvent.keyboard("PM");

      // Tab out to trigger validation
      await userEvent.tab();

      // Check that no segments have aria-invalid attribute
      for (const segment of segments) {
        await expect(segment).toHaveAttribute("aria-invalid");
      }
    });

    await step(
      "Testing value exactly at maximum (5:00 PM is valid)",
      async () => {
        // Tab back to the input
        await userEvent.tab({ shift: true });

        // Focus and set hour to 5
        await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
        await expect(hourSegment).toHaveFocus();
        // Set hour
        await userEvent.keyboard("05");
        // Set Minute
        await userEvent.keyboard("00");
        // set day period
        await userEvent.keyboard("PM");

        // Tab out to trigger validation
        await userEvent.tab();

        // Check that no segments have aria-invalid attribute
        for (const segment of segments) {
          await expect(segment).not.toHaveAttribute("aria-invalid");
        }
      }
    );
  },
};

/**
 * Showcase Different Locale
 */
export const DifferentLocales: Story = {
  args: {
    defaultValue: inventionOfTheInternet,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="800">
        <Stack direction="column" gap="400">
          <Text fontWeight="600">German (de-DE)</Text>
          <I18nProvider locale="de-DE">
            <TimeInput {...args} aria-label="German locale" />
          </I18nProvider>
        </Stack>

        <Stack direction="column" gap="400">
          <Text fontWeight="600">French (fr-FR)</Text>
          <I18nProvider locale="fr-FR">
            <TimeInput {...args} aria-label="French locale" />
          </I18nProvider>
        </Stack>

        <Stack direction="column" gap="400">
          <Text fontWeight="600">Japanese (ja-JP)</Text>
          <I18nProvider locale="ja-JP">
            <TimeInput {...args} aria-label="Japanese locale" />
          </I18nProvider>
        </Stack>

        <Stack direction="column" gap="400">
          <Text fontWeight="600">Arabic (ar-SA)</Text>
          <I18nProvider locale="ar-SA">
            <TimeInput {...args} aria-label="Arabic locale" />
          </I18nProvider>
        </Stack>
      </Stack>
    );
  },
};

/**
 * Showcase TimeInput within FormField
 * Demonstrates the use of TimeInput as Input within a FormField context
 */
export const WithFormField: Story = {
  render: (args) => {
    const [time, setTime] = useState<TimeValue | null>(new Time(10, 30));
    const [isInvalid, setIsInvalid] = useState(false);

    const handleTimeChange = (value: TimeValue | null) => {
      setTime(value);

      // Validate time - for this example we'll consider times before 9am or after 5pm invalid
      if (value) {
        const hours = (value as Time).hour;
        setIsInvalid(hours < 9 || hours > 17);
      } else {
        setIsInvalid(true); // Empty value is invalid
      }
    };

    return (
      <FormField.Root isInvalid={isInvalid} isRequired data-testid="form-field">
        <FormField.Label>Appointment Time</FormField.Label>
        <FormField.Input>
          <TimeInput
            {...args}
            value={time}
            onChange={handleTimeChange}
            hourCycle={12}
            hideTimeZone
            minValue={new Time(9, 0)}
            maxValue={new Time(17, 0)}
            width="full"
            data-testid="form-field-time-input"
          />
        </FormField.Input>
        <FormField.Description>
          Please select a time between 9:00 AM and 5:00 PM
        </FormField.Description>
        <FormField.Error data-testid="form-field-error">
          The selected time must be between 9:00 AM and 5:00 PM
        </FormField.Error>
      </FormField.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const formField = canvas.getByTestId("form-field");
    const timeInput = canvas.getByTestId("form-field-time-input");
    const segmentGroup = timeInput.querySelector('[role="group"]');
    const formFieldSegments = segmentGroup
      ? Array.from(segmentGroup.querySelectorAll('[role="spinbutton"]'))
      : [];
    const hourSegment = formFieldSegments[0];

    await step("FormField starts with valid state", async () => {
      await expect(formField).not.toHaveAttribute("data-invalid");
    });

    await step(
      "FormField.Root isRequired + isInvalid is propagated to TimeInput segments",
      async () => {
        for (const segment of formFieldSegments) {
          await expect(segment).toHaveAttribute("aria-required", "true");
          await expect(segment).not.toHaveAttribute("aria-invalid", "true");
        }
      }
    );

    await step("Setting invalid time shows error message", async () => {
      await userEvent.tab();
      await expect(hourSegment).toHaveFocus();

      // Set to 8 (below min of 9)
      await userEvent.keyboard("{ArrowDown}{ArrowDown}");

      // Error message should be visible
      const errorMessage = canvas.getByTestId("form-field-error");
      await expect(errorMessage).toBeVisible();
    });

    await step(
      "FormField.Root isInvalid is propagated to TimeInput segments",
      async () => {
        for (const segment of formFieldSegments) {
          await expect(segment).toHaveAttribute("aria-invalid", "true");
        }
      }
    );

    await step("Setting valid time removes error message", async () => {
      // Set back to valid time (10)
      await userEvent.keyboard("{ArrowUp}{ArrowUp}");

      // Error message should not be in the DOM
      const errorMessage = canvas.queryByTestId("form-field-error");
      await expect(errorMessage).toBeNull();
    });
  },
};
