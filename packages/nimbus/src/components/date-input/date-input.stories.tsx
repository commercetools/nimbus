import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  DateInput,
  type DateInputProps,
  FormField,
  NimbusI18nProvider,
  Icon,
  IconButton,
  Stack,
  Text,
  type DateValue,
} from "@commercetools/nimbus";
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from "@internationalized/date";
import { useState } from "react";
import {
  CalendarMonth,
  Close,
  Search,
  Visibility,
  AddBox,
  AddReaction,
} from "@commercetools/nimbus-icons";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof DateInput> = {
  title: "Components/Date/DateInput",
  component: DateInput,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof DateInput>;

/**
 * Base story
 * Demonstrates the most basic implementation
 */
export const Base: Story = {
  args: {
    ["aria-label"]: "Enter a date",
  },
};

/**
 * Placeholder Value
 * Demonstrates the placeholderValue property which is used
 * to set the start value when the input is empty and handled with the keyboard.
 */
export const PlaceholderValue: Story = {
  render: (args: DateInputProps) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With placeholder value (2025-06-15)</Text>
        <DateInput
          {...args}
          placeholderValue={new CalendarDate(2025, 6, 15)}
          aria-label="Date input with placeholder"
        />
        <Text>Without placeholder value</Text>
        <DateInput {...args} aria-label="Date input without placeholder" />
      </Stack>
    );
  },
};

/**
 * Showcase Uncontrolled
 */
export const Uncontrolled: Story = {
  render: (args: DateInputProps) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With defaultValue (2025-01-15)</Text>
        <DateInput
          {...args}
          defaultValue={new CalendarDate(2025, 1, 15)}
          aria-label="With default value"
        />
        <Text>With defaultValue (2025-12-25)</Text>
        <DateInput
          {...args}
          defaultValue={new CalendarDate(2025, 12, 25)}
          aria-label="With different default value"
        />
        <Text>No defaultValue (empty)</Text>
        <DateInput {...args} aria-label="Without default value" />
      </Stack>
    );
  },
};

/**
 * Showcase Controlled
 * Demonstrates how to use the DateInput as a controlled component
 * with the value property and state management
 */
export const Controlled: Story = {
  render: (args: DateInputProps) => {
    const [date, setDate] = useState<DateValue | null>(
      new CalendarDate(2025, 6, 15)
    );
    const handleDateChange = (value: DateValue | null) => {
      setDate(value);
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>
          Controlled DateInput (
          <span>current value: {date === null ? "null" : date.toString()}</span>
          )
        </Text>
        <DateInput
          {...args}
          value={date}
          onChange={handleDateChange}
          aria-label="Controlled date input"
        />
        <Button onPress={() => setDate(null)}>Reset</Button>
      </Stack>
    );
  },
};

/**
 * Showcase with FormField
 * Demonstrates integration with the FormField component
 */
export const WithFormField: Story = {
  render: (args: DateInputProps) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <FormField.Root isRequired>
          <FormField.Label>Birth Date</FormField.Label>
          <FormField.Input>
            <DateInput
              {...args}
              defaultValue={new CalendarDate(1990, 5, 15)}
              aria-label="Birth date"
            />
          </FormField.Input>
          <FormField.Description>
            Enter your date of birth
          </FormField.Description>
        </FormField.Root>

        <FormField.Root isInvalid>
          <FormField.Label>Event Date</FormField.Label>
          <FormField.Input>
            <DateInput {...args} aria-label="Event date" />
          </FormField.Input>
          <FormField.Description>Select the event date</FormField.Description>
          <FormField.Error>Please select a valid date</FormField.Error>
        </FormField.Root>
      </Stack>
    );
  },
};

/**
 * Showcase State Variants
 * Demonstrates isDisabled, isReadOnly, isRequired, and isInvalid properties
 * for both style variants and sizes
 */
export const VariantsSizesAndStates: Story = {
  render: (args: DateInputProps) => {
    const states = [
      { label: "Default", props: {} },
      { label: "Disabled", props: { isDisabled: true } },
      { label: "Read Only", props: { isReadOnly: true } },
      { label: "Required", props: { isRequired: true } },
      { label: "Invalid", props: { isInvalid: true } },
    ];

    const variants = ["solid", "ghost", "plain"] as const;
    const sizes = ["sm", "md"] as const;

    return (
      <Stack direction="column" gap="600" alignItems="start">
        {states.map((state) => (
          <Stack
            key={state.label}
            direction="column"
            gap="200"
            alignItems="start"
          >
            <Stack direction="column" gap="400" alignItems="start">
              <Text fontWeight="700">{state.label}</Text>
              {variants.map((variant) => (
                <Stack
                  key={variant}
                  direction="column"
                  gap="200"
                  alignItems="start"
                >
                  <Stack direction="row" gap="400" alignItems="start">
                    {sizes.map((size) => (
                      <Stack
                        key={size}
                        direction="column"
                        gap="100"
                        alignItems="start"
                      >
                        <DateInput
                          {...args}
                          {...state.props}
                          variant={variant}
                          size={size}
                          defaultValue={new CalendarDate(2025, 6, 15)}
                          aria-label={`${state.label} ${variant} ${size} date input`}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Leading and Trailing Elements
 * Demonstrates DateInput with various leading and trailing element configurations
 * including IconButton examples for different sizes and variants
 */
export const LeadingAndTrailingElements: Story = {
  render: (args: DateInputProps) => {
    const examples: Array<{
      label: string;
      props?: React.ComponentProps<typeof DateInput>;
      getProps?: (size: "sm" | "md") => React.ComponentProps<typeof DateInput>;
    }> = [
      {
        label: "Leading Icon",
        props: {
          leadingElement: <Search />,
          "aria-label": "search-date-input",
        },
      },
      {
        label: "Trailing Icon",
        props: {
          trailingElement: <Visibility />,
          "aria-label": "date-input-with-trailing",
        },
      },
      {
        label: "Both Icons",
        props: {
          leadingElement: <Icon as={CalendarMonth} />,
          trailingElement: <Icon as={AddBox} />,
          "aria-label": "date-input-with-both-icons",
        },
      },
      {
        label: "IconButton Elements",
        getProps: (size: "sm" | "md") => ({
          leadingElement: (
            <IconButton
              size={size === "sm" ? "2xs" : "xs"}
              tone="primary"
              variant="ghost"
              aria-label="date options"
            >
              <Icon as={AddReaction} />
            </IconButton>
          ),
          trailingElement: (
            <IconButton
              size={size === "sm" ? "2xs" : "xs"}
              tone="primary"
              variant="ghost"
              aria-label="clear"
            >
              <Icon as={Close} />
            </IconButton>
          ),
          "aria-label": "advanced-date-input",
        }),
      },
    ];

    const variants = ["solid", "ghost", "plain"] as const;
    const sizes = ["sm", "md"] as const;

    return (
      <Stack direction="column" gap="600">
        {sizes.map((size) => (
          <Stack key={size as string} direction="column" gap="400">
            <Text fontWeight="semibold">Size: {size as string}</Text>
            <Stack direction="column" gap="300">
              {examples.map((example) => (
                <Stack
                  key={`${size as string}-${example.label}`}
                  direction="column"
                  gap="200"
                >
                  <Text fontSize="sm" color="neutral.11">
                    {example.label}
                  </Text>
                  <Stack direction="row" gap="400" alignItems="center">
                    {variants.map((variant) => (
                      <Stack
                        key={variant as string}
                        direction="column"
                        gap="100"
                      >
                        <Text fontSize="xs" color="neutral.10">
                          {variant as string}
                        </Text>
                        <DateInput
                          {...args}
                          {...(example.getProps
                            ? example.getProps(size)
                            : example.props)}
                          size={size}
                          variant={variant}
                          defaultValue={new CalendarDate(2025, 6, 15)}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Hour Cycle
 * Demonstrates the hourCycle property with both 12-hour and 24-hour formats
 * when using date-time values that include time components
 */
export const HourCycle: Story = {
  render: (args: DateInputProps) => {
    // Create a date-time value with both date and time components
    const dateTimeValue = new CalendarDateTime(2025, 6, 15, 14, 30, 0);

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>12-hour format (2:30 PM)</Text>
        <DateInput
          {...args}
          defaultValue={dateTimeValue}
          hourCycle={12}
          aria-label="Date input with 12-hour format"
          data-testid="hour-cycle-12"
        />
        <Text>24-hour format (14:30)</Text>
        <DateInput
          {...args}
          defaultValue={dateTimeValue}
          hourCycle={24}
          aria-label="Date input with 24-hour format"
          data-testid="hour-cycle-24"
        />
      </Stack>
    );
  },
};

/**
 * Showcase Granularity
 * Demonstrates all available granularity levels in a single story
 */
export const Granularity: Story = {
  render: (args: DateInputProps) => {
    // Create a date-time value with all components for demonstration
    const dateTimeValue = new CalendarDateTime(2025, 6, 15, 14, 30, 45);
    const dateValue = new CalendarDate(2025, 6, 15);

    return (
      <>
        {["en-US", "de-DE"].map((locale) => (
          <NimbusI18nProvider locale={locale} key={locale}>
            <Stack direction="column" gap="400" alignItems="start" mb="800">
              <Text fontWeight="700">{locale}</Text>
              <Text>Granularity: day (date only)</Text>
              <DateInput
                {...args}
                defaultValue={dateValue}
                granularity="day"
                aria-label="Granularity day"
                data-testid="granularity-day"
              />
              <Text>Granularity: hour (date + hour)</Text>
              <DateInput
                {...args}
                defaultValue={dateTimeValue}
                granularity="hour"
                aria-label="Granularity hour"
                data-testid="granularity-hour"
              />
              <Text>Granularity: minute (date + hour + minute)</Text>
              <DateInput
                {...args}
                defaultValue={dateTimeValue}
                granularity="minute"
                aria-label="Granularity minute"
                data-testid="granularity-minute"
              />
              <Text>Granularity: second (date + hour + minute + second)</Text>
              <DateInput
                {...args}
                defaultValue={dateTimeValue}
                granularity="second"
                aria-label="Granularity second"
                data-testid="granularity-second"
              />
            </Stack>
          </NimbusI18nProvider>
        ))}
      </>
    );
  },
};

/**
 * Showcase Hide Time Zone
 * Demonstrates the hideTimeZone property with datetime values that include timezone information
 */
export const HideTimeZone: Story = {
  render: (args: DateInputProps) => {
    // Create a zoned date-time value that includes timezone information
    const zonedDateTime = new ZonedDateTime(
      2025,
      6,
      15,
      "America/New_York",
      -4 * 60 * 60 * 1000,
      14,
      30,
      0
    );

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With timezone displayed (hideTimeZone=false)</Text>
        <DateInput
          {...args}
          defaultValue={zonedDateTime}
          hideTimeZone={false}
          granularity="minute"
          aria-label="Date input with timezone displayed"
          data-testid="timezone-visible"
        />
        <Text>With timezone hidden (hideTimeZone=true)</Text>
        <DateInput
          {...args}
          defaultValue={zonedDateTime}
          hideTimeZone={true}
          granularity="minute"
          aria-label="Date input with timezone hidden"
          data-testid="timezone-hidden"
        />
      </Stack>
    );
  },
};

/**
 * Showcase Should Force Leading Zeros
 * Demonstrates the shouldForceLeadingZeros property with different date values
 * to show the difference between forced leading zeros and locale-default behavior
 */
export const ShouldForceLeadingZeros: Story = {
  render: (args: DateInputProps) => {
    // Create date values with single-digit months and days to demonstrate leading zeros
    const singleDigitDate = new CalendarDate(2025, 3, 5); // March 5th
    const singleDigitDateTime = new CalendarDateTime(2025, 3, 5, 9, 7, 0); // March 5th, 9:07 AM

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text fontWeight="700">Date Only (March 5, 2025)</Text>
        <Text>Default behavior (locale-determined)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDate}
          granularity="day"
          aria-label="Date input with default leading zeros behavior"
          data-testid="leading-zeros-default-date"
        />
        <Text>Force leading zeros (shouldForceLeadingZeros=true)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDate}
          granularity="day"
          shouldForceLeadingZeros={true}
          aria-label="Date input with forced leading zeros"
          data-testid="leading-zeros-forced-date"
        />
        <Text>No leading zeros (shouldForceLeadingZeros=false)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDate}
          granularity="day"
          shouldForceLeadingZeros={false}
          aria-label="Date input without leading zeros"
          data-testid="leading-zeros-disabled-date"
        />

        <Text fontWeight="700">Date and Time (March 5, 2025, 9:07 AM)</Text>
        <Text>Default behavior (locale-determined)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDateTime}
          granularity="minute"
          aria-label="DateTime input with default leading zeros behavior"
          data-testid="leading-zeros-default-datetime"
        />
        <Text>Force leading zeros (shouldForceLeadingZeros=true)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDateTime}
          granularity="minute"
          shouldForceLeadingZeros={true}
          aria-label="DateTime input with forced leading zeros"
          data-testid="leading-zeros-forced-datetime"
        />
        <Text>No leading zeros (shouldForceLeadingZeros=false)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDateTime}
          granularity="minute"
          shouldForceLeadingZeros={false}
          aria-label="DateTime input without leading zeros"
          data-testid="leading-zeros-disabled-datetime"
        />
      </Stack>
    );
  },
};

/**
 * Showcase Min/Max Value Validation
 * Demonstrates minValue and maxValue properties with interactive validation feedback
 */
export const MinMaxValueValidation: Story = {
  render: (args: DateInputProps) => {
    const [date1, setDate1] = useState<DateValue | null>(null);
    const [date2, setDate2] = useState<DateValue | null>(null);
    const [date3, setDate3] = useState<DateValue | null>(null);

    // Define validation ranges
    const minDate = new CalendarDate(2025, 1, 1);
    const maxDate = new CalendarDate(2025, 12, 31);
    const restrictedMinDate = new CalendarDate(2025, 6, 1);
    const restrictedMaxDate = new CalendarDate(2025, 6, 30);

    return (
      <Stack direction="column" gap="600" alignItems="start">
        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Min/Max Date Range (2025 only)</Text>
          <FormField.Root
            isInvalid={
              !!(
                date1 &&
                (date1.compare(minDate) < 0 || date1.compare(maxDate) > 0)
              )
            }
          >
            <FormField.Label>Select a date in 2025</FormField.Label>
            <FormField.Input>
              <DateInput
                {...args}
                value={date1}
                onChange={setDate1}
                minValue={minDate}
                maxValue={maxDate}
                aria-label="Date input with min/max validation"
                data-testid="min-max-validation"
              />
            </FormField.Input>
            <FormField.Description>
              Valid range: January 1, 2025 - December 31, 2025
            </FormField.Description>
            {date1 &&
              (date1.compare(minDate) < 0 || date1.compare(maxDate) > 0) && (
                <FormField.Error>
                  Date must be between {minDate.toString()} and{" "}
                  {maxDate.toString()}
                </FormField.Error>
              )}
          </FormField.Root>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Restricted Range (June 2025 only)</Text>
          <FormField.Root
            isInvalid={
              !!(
                date2 &&
                (date2.compare(restrictedMinDate) < 0 ||
                  date2.compare(restrictedMaxDate) > 0)
              )
            }
          >
            <FormField.Label>Select a date in June 2025</FormField.Label>
            <FormField.Input>
              <DateInput
                {...args}
                value={date2}
                onChange={setDate2}
                minValue={restrictedMinDate}
                maxValue={restrictedMaxDate}
                aria-label="Date input with restricted range"
                data-testid="restricted-range-validation"
              />
            </FormField.Input>
            <FormField.Description>
              Valid range: June 1, 2025 - June 30, 2025
            </FormField.Description>
            {date2 &&
              (date2.compare(restrictedMinDate) < 0 ||
                date2.compare(restrictedMaxDate) > 0) && (
                <FormField.Error>
                  Date must be between {restrictedMinDate.toString()} and{" "}
                  {restrictedMaxDate.toString()}
                </FormField.Error>
              )}
          </FormField.Root>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Future Dates Only (from today)</Text>
          <FormField.Root
            isInvalid={
              !!(date3 && date3.compare(new CalendarDate(2025, 6, 15)) <= 0)
            }
          >
            <FormField.Label>Select a future date</FormField.Label>
            <FormField.Input>
              <DateInput
                {...args}
                value={date3}
                onChange={setDate3}
                minValue={new CalendarDate(2025, 6, 16)}
                aria-label="Date input for future dates only"
                data-testid="future-dates-validation"
              />
            </FormField.Input>
            <FormField.Description>
              Only dates after June 15, 2025 are allowed
            </FormField.Description>
            {date3 && date3.compare(new CalendarDate(2025, 6, 15)) <= 0 && (
              <FormField.Error>
                Please select a date after June 15, 2025
              </FormField.Error>
            )}
          </FormField.Root>
        </Stack>
      </Stack>
    );
  },
};

/**
 * Showcase Custom Validation
 * Demonstrates custom validation logic (e.g., no weekends, business days only)
 */
export const CustomValidation: Story = {
  render: (args: DateInputProps) => {
    const [businessDate, setBusinessDate] = useState<DateValue | null>(null);
    const [customDate, setCustomDate] = useState<DateValue | null>(null);

    // Custom validation functions
    const isBusinessDay = (date: DateValue): boolean => {
      const dayOfWeek = date.toDate("UTC").getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
    };

    const isValidCustomDate = (date: DateValue): boolean => {
      // Custom rule: only allow dates that are multiples of 5 (5th, 10th, 15th, etc.)
      return date.day % 5 === 0;
    };

    const businessDateError = businessDate && !isBusinessDay(businessDate);
    const customDateError = customDate && !isValidCustomDate(customDate);

    return (
      <Stack direction="column" gap="600" alignItems="start">
        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Business Days Only (Monday-Friday)</Text>
          <FormField.Root isInvalid={!!businessDateError}>
            <FormField.Label>Select a business day</FormField.Label>
            <FormField.Input>
              <DateInput
                {...args}
                value={businessDate}
                onChange={setBusinessDate}
                defaultValue={new CalendarDate(2025, 6, 17)} // Monday
                aria-label="Business days only date input"
                data-testid="business-days-validation"
              />
            </FormField.Input>
            <FormField.Description>
              Only Monday through Friday are allowed
            </FormField.Description>
            {businessDateError && (
              <FormField.Error>
                Please select a business day (Monday-Friday)
              </FormField.Error>
            )}
          </FormField.Root>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Custom Rule: Multiples of 5 Only</Text>
          <FormField.Root isInvalid={!!customDateError}>
            <FormField.Label>
              Select a date on the 5th, 10th, 15th, etc.
            </FormField.Label>
            <FormField.Input>
              <DateInput
                {...args}
                value={customDate}
                onChange={setCustomDate}
                defaultValue={new CalendarDate(2025, 6, 10)}
                aria-label="Custom validation date input"
                data-testid="custom-validation"
              />
            </FormField.Input>
            <FormField.Description>
              Only dates that are multiples of 5 are allowed (5th, 10th, 15th,
              20th, 25th, 30th)
            </FormField.Description>
            {customDateError && (
              <FormField.Error>
                Please select a date that is a multiple of 5 (5th, 10th, 15th,
                etc.)
              </FormField.Error>
            )}
          </FormField.Root>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Validation Status Summary</Text>
          <Stack direction="column" gap="200" alignItems="start">
            <Text>
              Business Date:{" "}
              {businessDate
                ? isBusinessDay(businessDate)
                  ? "✅ Valid"
                  : "❌ Invalid"
                : "Not selected"}
            </Text>
            <Text>
              Custom Date:{" "}
              {customDate
                ? isValidCustomDate(customDate)
                  ? "✅ Valid"
                  : "❌ Invalid"
                : "Not selected"}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  },
};

/**
 * Showcase Validation Behavior
 * Demonstrates when validation triggers (onBlur vs onChange) and different validation states
 */
export const ValidationBehavior: Story = {
  render: (args: DateInputProps) => {
    const [onChangeDate, setOnChangeDate] = useState<DateValue | null>(null);
    const [onBlurDate, setOnBlurDate] = useState<DateValue | null>(null);
    const [combinedDate, setCombinedDate] = useState<DateValue | null>(null);
    const [hasBlurred, setHasBlurred] = useState(false);
    const [validationLog, setValidationLog] = useState<string[]>([]);

    const minDate = new CalendarDate(2025, 6, 1);
    const maxDate = new CalendarDate(2025, 6, 30);

    const addToLog = (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setValidationLog((prev) => [
        ...prev.slice(-4),
        `[${timestamp}] ${message}`,
      ]);
    };

    const isValidDate = (date: DateValue | null): boolean => {
      if (!date) return false;
      return date.compare(minDate) >= 0 && date.compare(maxDate) <= 0;
    };

    const handleOnChangeValidation = (date: DateValue | null) => {
      setOnChangeDate(date);
      if (date) {
        const isValid = isValidDate(date);
        addToLog(
          `onChange: ${date.toString()} - ${isValid ? "Valid" : "Invalid"}`
        );
      } else {
        addToLog("onChange: Date cleared");
      }
    };

    const handleOnBlurValidation = (date: DateValue | null) => {
      setOnBlurDate(date);
      // Only show validation on blur, not on change
    };

    const handleBlur = () => {
      setHasBlurred(true);
      if (onBlurDate) {
        const isValid = isValidDate(onBlurDate);
        addToLog(
          `onBlur: ${onBlurDate.toString()} - ${isValid ? "Valid" : "Invalid"}`
        );
      } else {
        addToLog("onBlur: No date selected");
      }
    };

    const handleCombinedValidation = (date: DateValue | null) => {
      setCombinedDate(date);
      if (date) {
        const isValid = isValidDate(date);
        addToLog(
          `Combined: ${date.toString()} - ${isValid ? "Valid" : "Invalid"}`
        );
      }
    };

    const clearLog = () => {
      setValidationLog([]);
    };

    // Validation states
    const onChangeInvalid = onChangeDate && !isValidDate(onChangeDate);
    const onBlurInvalid = hasBlurred && onBlurDate && !isValidDate(onBlurDate);
    const combinedInvalid = combinedDate && !isValidDate(combinedDate);

    return (
      <Stack direction="column" gap="600" alignItems="start">
        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Immediate Validation (onChange)</Text>
          <FormField.Root isInvalid={!!onChangeInvalid}>
            <FormField.Label>Validates on every change</FormField.Label>
            <FormField.Input>
              <DateInput
                {...args}
                value={onChangeDate}
                onChange={handleOnChangeValidation}
                minValue={minDate}
                maxValue={maxDate}
                aria-label="Immediate validation date input"
                data-testid="immediate-validation"
              />
            </FormField.Input>
            <FormField.Description>
              Valid range: June 1-30, 2025. Validation feedback appears
              immediately.
            </FormField.Description>
            {onChangeInvalid && (
              <FormField.Error>
                Date must be between June 1-30, 2025
              </FormField.Error>
            )}
          </FormField.Root>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Validation on Blur Only</Text>
          <FormField.Root isInvalid={!!onBlurInvalid}>
            <FormField.Label>
              Validates when you leave the field
            </FormField.Label>
            <FormField.Input>
              <DateInput
                {...args}
                value={onBlurDate}
                onChange={handleOnBlurValidation}
                onBlur={handleBlur}
                minValue={minDate}
                maxValue={maxDate}
                aria-label="Blur validation date input"
                data-testid="blur-validation"
              />
            </FormField.Input>
            <FormField.Description>
              Valid range: June 1-30, 2025. Validation feedback appears only
              when you leave the field.
            </FormField.Description>
            {onBlurInvalid && (
              <FormField.Error>
                Date must be between June 1-30, 2025
              </FormField.Error>
            )}
          </FormField.Root>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Combined Validation (onChange + onBlur)</Text>
          <FormField.Root isInvalid={!!combinedInvalid}>
            <FormField.Label>
              Shows validation on change and blur
            </FormField.Label>
            <FormField.Input>
              <DateInput
                {...args}
                value={combinedDate}
                onChange={handleCombinedValidation}
                onBlur={() => addToLog("Combined field blurred")}
                minValue={minDate}
                maxValue={maxDate}
                aria-label="Combined validation date input"
                data-testid="combined-validation"
              />
            </FormField.Input>
            <FormField.Description>
              Valid range: June 1-30, 2025. Real-time validation with blur
              events logged.
            </FormField.Description>
            {combinedInvalid && (
              <FormField.Error>
                Date must be between June 1-30, 2025
              </FormField.Error>
            )}
          </FormField.Root>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Validation Event Log</Text>
          <Stack direction="row" gap="200" alignItems="center">
            <Button onPress={clearLog}>Clear Log</Button>
            <Text color="gray.600">Last 5 validation events</Text>
          </Stack>
          <Stack
            direction="column"
            gap="100"
            alignItems="start"
            p="300"
            bg="gray.50"
            borderRadius="md"
            minHeight="120px"
          >
            {validationLog.length === 0 ? (
              <Text color="gray.500">No validation events yet...</Text>
            ) : (
              validationLog.map((log, index) => (
                <Text key={index} fontFamily="mono">
                  {log}
                </Text>
              ))
            )}
          </Stack>
        </Stack>

        <Stack direction="column" gap="200" alignItems="start">
          <Text fontWeight="700">Current Validation States</Text>
          <Text>
            onChange validation:{" "}
            {onChangeDate
              ? isValidDate(onChangeDate)
                ? "✅ Valid"
                : "❌ Invalid"
              : "No date"}
          </Text>
          <Text>
            onBlur validation:{" "}
            {onBlurDate
              ? isValidDate(onBlurDate)
                ? "✅ Valid"
                : "❌ Invalid"
              : "No date"}
            {!hasBlurred && onBlurDate && " (not blurred yet)"}
          </Text>
          <Text>
            Combined validation:{" "}
            {combinedDate
              ? isValidDate(combinedDate)
                ? "✅ Valid"
                : "❌ Invalid"
              : "No date"}
          </Text>
        </Stack>
      </Stack>
    );
  },
};

/**
 * Custom Width
 * Demonstrates that DateInput accepts a width property
 */
export const CustomWidth: Story = {
  args: {
    ["aria-label"]: "Enter a date",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Width: 256px</Text>
        <DateInput
          {...args}
          width="256px"
          leadingElement={<Icon as={CalendarMonth} />}
          trailingElement={<Icon as={Close} />}
        />
        <Text>Width: 512px</Text>
        <DateInput
          {...args}
          width="512px"
          leadingElement={<Icon as={CalendarMonth} />}
          trailingElement={<Icon as={Close} />}
        />
        <Text>Width: full</Text>
        <DateInput
          {...args}
          width="full"
          leadingElement={<Icon as={CalendarMonth} />}
          trailingElement={<Icon as={Close} />}
        />
      </Stack>
    );
  },
};

/**
 * Showcase German Locale
 * Demonstrates the DateInput component with German locale (de-DE)
 * showing different date formats, granularities, and cultural conventions
 */
export const GermanLocale: Story = {
  render: (args: DateInputProps) => {
    const [controlledDate, setControlledDate] = useState<DateValue | null>(
      new CalendarDate(2025, 6, 15)
    );

    const dateValue = new CalendarDate(2025, 6, 15);
    const dateTimeValue = new CalendarDateTime(2025, 6, 15, 14, 30, 0);
    const zonedDateTime = new ZonedDateTime(
      2025,
      6,
      15,
      "Europe/Berlin",
      2 * 60 * 60 * 1000, // +2 hours (CEST)
      14,
      30,
      0
    );

    return (
      <NimbusI18nProvider locale="de-DE">
        <Stack direction="column" gap="600" alignItems="start">
          <Text fontWeight="700">German Locale (de-DE) Examples</Text>

          <Stack direction="column" gap="400" alignItems="start">
            <Text fontWeight="600">Basic Date Input</Text>
            <DateInput
              {...args}
              defaultValue={dateValue}
              aria-label="Deutsches Datum"
              data-testid="german-basic"
            />
            <Text color="gray.600">
              German date format: DD.MM.YYYY (15.06.2025)
            </Text>
          </Stack>

          <Stack direction="column" gap="400" alignItems="start">
            <Text fontWeight="600">Date and Time</Text>
            <DateInput
              {...args}
              defaultValue={dateTimeValue}
              granularity="minute"
              aria-label="Deutsches Datum mit Zeit"
              data-testid="german-datetime"
            />
            <Text color="gray.600">
              German datetime format with 24-hour clock
            </Text>
          </Stack>

          <Stack direction="column" gap="400" alignItems="start">
            <Text fontWeight="600">With Berlin Timezone</Text>
            <DateInput
              {...args}
              defaultValue={zonedDateTime}
              granularity="minute"
              hideTimeZone={false}
              aria-label="Deutsches Datum mit Zeitzone"
              data-testid="german-timezone"
            />
            <Text color="gray.600">
              German datetime with Europe/Berlin timezone
            </Text>
          </Stack>

          <Stack direction="column" gap="400" alignItems="start">
            <Text fontWeight="600">Different Granularities</Text>
            <Stack direction="column" gap="200" alignItems="start">
              <Stack direction="row" gap="400" alignItems="center">
                <DateInput
                  {...args}
                  defaultValue={dateValue}
                  granularity="day"
                  aria-label="Tag-Granularität"
                  data-testid="german-day"
                />
                <Text>Day only</Text>
              </Stack>
              <Stack direction="row" gap="400" alignItems="center">
                <DateInput
                  {...args}
                  defaultValue={dateTimeValue}
                  granularity="hour"
                  aria-label="Stunden-Granularität"
                  data-testid="german-hour"
                />
                <Text>Hour granularity</Text>
              </Stack>
              <Stack direction="row" gap="400" alignItems="center">
                <DateInput
                  {...args}
                  defaultValue={dateTimeValue}
                  granularity="second"
                  aria-label="Sekunden-Granularität"
                  data-testid="german-second"
                />
                <Text>Second granularity</Text>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="column" gap="400" alignItems="start">
            <Text fontWeight="600">Controlled with German Validation</Text>
            <FormField.Root
              isInvalid={
                !!(
                  controlledDate &&
                  (controlledDate.compare(new CalendarDate(2025, 1, 1)) < 0 ||
                    controlledDate.compare(new CalendarDate(2025, 12, 31)) > 0)
                )
              }
            >
              <FormField.Label>Geburtsdatum</FormField.Label>
              <FormField.Input>
                <DateInput
                  {...args}
                  value={controlledDate}
                  onChange={setControlledDate}
                  minValue={new CalendarDate(2025, 1, 1)}
                  maxValue={new CalendarDate(2025, 12, 31)}
                  aria-label="Geburtsdatum eingeben"
                  data-testid="german-controlled"
                />
              </FormField.Input>
              <FormField.Description>
                Geben Sie Ihr Geburtsdatum ein (nur 2025 erlaubt)
              </FormField.Description>
              {controlledDate &&
                (controlledDate.compare(new CalendarDate(2025, 1, 1)) < 0 ||
                  controlledDate.compare(new CalendarDate(2025, 12, 31)) >
                    0) && (
                  <FormField.Error>
                    Das Datum muss im Jahr 2025 liegen
                  </FormField.Error>
                )}
            </FormField.Root>
          </Stack>

          <Stack direction="column" gap="400" alignItems="start">
            <Text fontWeight="600">Leading Zeros Behavior</Text>
            <Stack direction="column" gap="200" alignItems="start">
              <Stack direction="row" gap="400" alignItems="center">
                <DateInput
                  {...args}
                  defaultValue={new CalendarDate(2025, 3, 5)}
                  shouldForceLeadingZeros={true}
                  aria-label="Mit führenden Nullen"
                  data-testid="german-leading-zeros-true"
                />
                <Text>With leading zeros (05.03.2025)</Text>
              </Stack>
              <Stack direction="row" gap="400" alignItems="center">
                <DateInput
                  {...args}
                  defaultValue={new CalendarDate(2025, 3, 5)}
                  shouldForceLeadingZeros={false}
                  aria-label="Ohne führende Nullen"
                  data-testid="german-leading-zeros-false"
                />
                <Text>Without leading zeros (5.3.2025)</Text>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="column" gap="200" alignItems="start">
            <Text fontWeight="600">Current Value</Text>
            <Text fontFamily="mono">
              {controlledDate ? controlledDate.toString() : "null"}
            </Text>
          </Stack>
        </Stack>
      </NimbusI18nProvider>
    );
  },
};
