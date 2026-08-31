/**
 * Realistic Merchant Center "Account Settings" page built entirely with
 * Nimbus.
 *
 * This is the migrated counterpart of `fixtures/uikit/admin-settings-view.tsx`,
 * exercising the same set of tricky migration patterns:
 *
 * - PasswordInput (string-based onChange replacing ChangeEvent<HTMLInputElement>)
 * - RadioInput.Root / RadioInput.Option (replacing RadioInput.Group / Option)
 * - DatePicker (isReadOnly, replacing DateInput's 'YYYY-MM-DD' string with a
 *   CalendarDate, and DateTimeInput's timeZone prop with a ZonedDateTime +
 *   granularity="minute")
 * - TimeInput (Time value from @internationalized/date replacing a time string)
 * - Menu.Root / Menu.Trigger / Menu.Content / Menu.Item (replacing DropdownMenu
 *   + ListMenuItem, with onAction replacing per-item onClick)
 * - Tooltip.Root + Tooltip.Content + MakeElementFocusable (replacing the
 *   title-prop Tooltip wrapping a non-interactive icon)
 * - Grid / Grid.Item (replacing the settings layout grid)
 * - Button variant="link" as="a" (replacing LinkButton's to/isExternal props)
 * - ComboBox.Root with allowsCustomOptions (replacing CreatableSelectInput's
 *   onCreateOption)
 * - RichTextInput (HTML string value/onChange, unchanged shape but now HTML)
 * - CollapsibleMotion.Root/Trigger/Content (replacing the render-prop
 *   isClosed/toggle/containerStyles/registerContentNode API)
 * - Button (replacing AccessibleButton; no wrapper needed, children over label)
 * - VisuallyHidden (replacing both HiddenInput and AccessibleHidden)
 * - TagGroup.Root/TagList/Tag (replacing TagList/Tag)
 * - ToggleButtonGroup.Root/Button with selectionMode="single" (replacing
 *   ViewSwitcher.Group/Button)
 * - FieldErrors / Text (replacing ErrorMessage/WarningMessage/AdditionalInfoMessage)
 * - Icon imports from @commercetools/nimbus-icons (Settings, Info, GridView, List)
 * - Stack/Box maxW tokens (replacing nested Spacings.Inline/Spacings.Stack/
 *   Constraints.Horizontal per the migration's layout guidance)
 */

import { useCallback, useState, type Key } from "react";
import {
  Box,
  Button,
  Card,
  CollapsibleMotion,
  ComboBox,
  DatePicker,
  FieldErrors,
  Grid,
  Heading,
  Icon,
  IconButton,
  MakeElementFocusable,
  Menu,
  PasswordInput,
  RadioInput,
  RichTextInput,
  Stack,
  TagGroup,
  Text,
  TimeInput,
  ToggleButtonGroup,
  Tooltip,
  VisuallyHidden,
} from "@commercetools/nimbus";
import { GridView, Info, List, Settings } from "@commercetools/nimbus-icons";
import {
  CalendarDate,
  CalendarDateTime,
  Time,
  ZonedDateTime,
  fromDate,
} from "@internationalized/date";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NotificationChannel = "email" | "slack" | "none";
type TeamView = "card" | "list";

interface PasswordFormValues {
  current: string;
  next: string;
}

interface TagOption {
  id: string;
  name: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

// DatePicker requires @internationalized/date values instead of strings.
const ACCOUNT_CREATED_DATE = new CalendarDate(2022, 3, 14);
const ACCOUNT_TIME_ZONE = "Europe/Berlin";
const LAST_LOGIN_ZONED = fromDate(
  new Date("2026-08-24T09:15:00.000Z"),
  ACCOUNT_TIME_ZONE
);

const ASSIGNED_ROLES = ["Admin", "Order Manager", "Viewer"];

const INITIAL_TAG_OPTIONS: TagOption[] = [
  { id: "beta-tester", name: "Beta Tester" },
  { id: "internal", name: "Internal" },
  { id: "vip", name: "VIP" },
];

const TEAM_MEMBERS: TeamMember[] = [
  { id: "1", name: "Jane Doe", role: "Admin" },
  { id: "2", name: "John Smith", role: "Order Manager" },
  { id: "3", name: "Priya Patel", role: "Viewer" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AdminSettingsView() {
  // Password change
  const [passwords, setPasswords] = useState<PasswordFormValues>({
    current: "",
    next: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Notification preferences
  const [notificationChannel, setNotificationChannel] =
    useState<NotificationChannel>("email");
  const [digestTime, setDigestTime] = useState<Time | null>(new Time(9, 0));

  // Tags & roles
  const [tagOptions, setTagOptions] =
    useState<TagOption[]>(INITIAL_TAG_OPTIONS);
  const [selectedTagKeys, setSelectedTagKeys] = useState<string[]>([
    INITIAL_TAG_OPTIONS[0].id,
  ]);
  const [teamView, setTeamView] = useState<TeamView>("card");

  // Email signature — RichTextInput works with HTML strings.
  const [signature, setSignature] = useState(
    "<p>Best regards,<br />The Merchant Center Team</p>"
  );

  // Advanced / API token
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [apiToken, setApiToken] = useState("sk_live_4f8a...c93e");
  const [formToken] = useState("csrf-9f8a7b6c");

  // Save flow
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // PasswordInput's onChange receives the string value directly.
  const handlePasswordFieldChange = useCallback(
    (field: keyof PasswordFormValues) => (value: string) => {
      setPasswords((prev) => ({ ...prev, [field]: value }));
      setPasswordError(
        field === "next" && value.length > 0 && value.length < 8
          ? "New password must be at least 8 characters long."
          : null
      );
    },
    []
  );

  const handleCreateTag = useCallback((newTag: TagOption) => {
    setTagOptions((prev) => [...prev, newTag]);
    setSelectedTagKeys((prev) => [...prev, newTag.id]);
  }, []);

  const handleTagSelectionChange = useCallback((keys: Key[]) => {
    setSelectedTagKeys(keys.map(String));
  }, []);

  const handleTeamViewChange = useCallback((keys: Set<Key>) => {
    const next = Array.from(keys)[0] as TeamView | undefined;
    if (next) setTeamView(next);
  }, []);

  // TimeInput's onChange also accepts ZonedDateTime; the digest time only
  // ever needs a plain Time, so narrow it here.
  const handleDigestTimeChange = useCallback(
    (value: Time | CalendarDateTime | ZonedDateTime | null) => {
      setDigestTime(value instanceof Time ? value : null);
    },
    []
  );

  const handleRegenerateToken = useCallback(() => {
    setApiToken(`sk_live_${Math.random().toString(36).slice(2, 10)}...`);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
  }, []);

  return (
    <Box maxW="3xl">
      <Stack direction="column" gap="600">
        {/* Hidden form token — not rendered visually */}
        <VisuallyHidden>
          <input
            type="hidden"
            name="formToken"
            value={formToken}
            readOnly
            aria-hidden="true"
          />
        </VisuallyHidden>

        {/* Page header */}
        <Stack
          direction="row"
          gap="400"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack direction="row" gap="200" alignItems="center">
            <Heading as="h1" size="lg">
              Account Settings
            </Heading>
            <Button
              as="a"
              href="https://docs.example.com/account-settings"
              target="_blank"
              rel="noopener noreferrer"
              variant="link"
              colorPalette="primary"
            >
              View documentation
            </Button>
          </Stack>

          <Menu.Root onAction={() => {}}>
            <Menu.Trigger asChild>
              <IconButton aria-label="Account actions" variant="ghost">
                <Icon as={Settings} size="2xs" color="neutral.11" />
              </IconButton>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item id="export">Export settings</Menu.Item>
              <Menu.Item id="import">Import settings</Menu.Item>
              <Menu.Item id="reset" isDisabled={isSaving}>
                Reset to defaults
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </Stack>

        {/* Profile section — Grid layout */}
        <Card.Root>
          <Card.Body>
            <Stack direction="column" gap="400">
              <Heading as="h4" size="xs" fontWeight="medium">
                Profile
              </Heading>

              <Grid templateColumns="1fr 1fr" gap="800">
                <Grid.Item>
                  <Stack direction="column" gap="400">
                    <Stack direction="column" gap="100">
                      <Text
                        as="label"
                        id="admin-settings-current-password-label"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Current Password{" "}
                        <Text as="span" color="critical.11">
                          *
                        </Text>
                      </Text>
                      <PasswordInput
                        name="currentPassword"
                        value={passwords.current}
                        onChange={handlePasswordFieldChange("current")}
                        placeholder="Enter current password"
                        isRequired
                        aria-labelledby="admin-settings-current-password-label"
                      />
                    </Stack>

                    <Stack direction="column" gap="100">
                      <Stack direction="row" gap="100" alignItems="center">
                        <Text
                          as="label"
                          id="admin-settings-new-password-label"
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          New Password{" "}
                          <Text as="span" color="critical.11">
                            *
                          </Text>
                        </Text>
                        <Tooltip.Root>
                          <MakeElementFocusable>
                            <Icon as={Info} size="2xs" color="neutral.11" />
                          </MakeElementFocusable>
                          <Tooltip.Content>
                            Must be at least 8 characters long.
                          </Tooltip.Content>
                        </Tooltip.Root>
                      </Stack>
                      <PasswordInput
                        name="newPassword"
                        value={passwords.next}
                        onChange={handlePasswordFieldChange("next")}
                        placeholder="Enter new password"
                        isRequired
                        isInvalid={Boolean(passwordError)}
                        aria-labelledby="admin-settings-new-password-label"
                      />
                      <FieldErrors
                        errors={{ min: Boolean(passwordError) }}
                        isVisible={Boolean(passwordError)}
                        customMessages={{ min: passwordError ?? "" }}
                      />
                    </Stack>
                  </Stack>
                </Grid.Item>

                <Grid.Item>
                  <Stack direction="column" gap="400">
                    <Stack direction="column" gap="100">
                      <Text
                        as="label"
                        id="admin-settings-account-created-label"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Account Created
                      </Text>
                      <DatePicker
                        value={ACCOUNT_CREATED_DATE}
                        isReadOnly
                        aria-labelledby="admin-settings-account-created-label"
                      />
                    </Stack>

                    <Stack direction="column" gap="100">
                      <Text
                        as="label"
                        id="admin-settings-last-login-label"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Last Login
                      </Text>
                      <DatePicker
                        value={LAST_LOGIN_ZONED}
                        granularity="minute"
                        isReadOnly
                        aria-labelledby="admin-settings-last-login-label"
                      />
                    </Stack>
                  </Stack>
                </Grid.Item>
              </Grid>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Notification preferences */}
        <Card.Root>
          <Card.Body>
            <Stack direction="column" gap="400">
              <Heading as="h4" size="xs" fontWeight="medium">
                Notification Preferences
              </Heading>

              <Stack direction="column" gap="100">
                <Text
                  as="label"
                  id="admin-settings-notification-channel-label"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  Notify me via
                </Text>
                <RadioInput.Root
                  name="notificationChannel"
                  value={notificationChannel}
                  onChange={(value) =>
                    setNotificationChannel(value as NotificationChannel)
                  }
                  aria-labelledby="admin-settings-notification-channel-label"
                >
                  <RadioInput.Option value="email">Email</RadioInput.Option>
                  <RadioInput.Option value="slack">Slack</RadioInput.Option>
                  <RadioInput.Option value="none">
                    Do not notify me
                  </RadioInput.Option>
                </RadioInput.Root>
              </Stack>

              <Box maxW="xs">
                <Stack direction="column" gap="100">
                  <Text
                    as="label"
                    id="admin-settings-digest-time-label"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Daily Digest Time
                  </Text>
                  <TimeInput
                    value={digestTime}
                    onChange={handleDigestTimeChange}
                    isDisabled={notificationChannel === "none"}
                    aria-labelledby="admin-settings-digest-time-label"
                  />
                </Stack>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Tags & Roles */}
        <Card.Root>
          <Card.Body>
            <Stack direction="column" gap="400">
              <Heading as="h4" size="xs" fontWeight="medium">
                Tags & Roles
              </Heading>

              <Box maxW="lg">
                <Stack direction="column" gap="100">
                  <Text
                    as="label"
                    id="admin-settings-tags-label"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Custom Tags
                  </Text>
                  <ComboBox.Root
                    items={tagOptions}
                    selectedKeys={selectedTagKeys}
                    onSelectionChange={handleTagSelectionChange}
                    selectionMode="multiple"
                    allowsCustomOptions
                    getNewOptionData={(inputValue: string) => ({
                      id: inputValue.toLowerCase().replace(/\s+/g, "-"),
                      name: inputValue,
                    })}
                    onCreateOption={handleCreateTag}
                    placeholder="Add a tag..."
                    aria-labelledby="admin-settings-tags-label"
                  >
                    <ComboBox.Trigger />
                    <ComboBox.Popover>
                      <ComboBox.ListBox>
                        {(item: TagOption) => (
                          <ComboBox.Option id={item.id}>
                            {item.name}
                          </ComboBox.Option>
                        )}
                      </ComboBox.ListBox>
                    </ComboBox.Popover>
                  </ComboBox.Root>
                </Stack>
              </Box>

              <Stack direction="column" gap="100">
                <Text
                  as="label"
                  id="admin-settings-roles-label"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  Assigned Roles
                </Text>
                <TagGroup.Root aria-labelledby="admin-settings-roles-label">
                  <TagGroup.TagList
                    items={ASSIGNED_ROLES.map((role) => ({
                      id: role,
                      name: role,
                    }))}
                  >
                    {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
                  </TagGroup.TagList>
                </TagGroup.Root>
              </Stack>

              <Stack direction="column" gap="200">
                <Stack
                  direction="row"
                  gap="200"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                >
                  <Text fontWeight="medium">Team Members</Text>
                  <ToggleButtonGroup.Root
                    selectedKeys={new Set([teamView])}
                    onSelectionChange={handleTeamViewChange}
                    size="xs"
                    aria-label="Team member view"
                  >
                    <ToggleButtonGroup.Button id="card" aria-label="Card view">
                      <Icon as={GridView} size="2xs" color="neutral.11" />
                    </ToggleButtonGroup.Button>
                    <ToggleButtonGroup.Button id="list" aria-label="List view">
                      <Icon as={List} size="2xs" color="neutral.11" />
                    </ToggleButtonGroup.Button>
                  </ToggleButtonGroup.Root>
                </Stack>

                {teamView === "card" ? (
                  <Stack direction="row" gap="400" flexWrap="wrap">
                    {TEAM_MEMBERS.map((member) => (
                      <Card.Root key={member.id}>
                        <Card.Body>
                          <Stack direction="column" gap="100">
                            <Text fontWeight="medium">{member.name}</Text>
                            <Text fontSize="sm">{member.role}</Text>
                          </Stack>
                        </Card.Body>
                      </Card.Root>
                    ))}
                  </Stack>
                ) : (
                  <Stack direction="column" gap="100">
                    {TEAM_MEMBERS.map((member) => (
                      <Stack
                        key={member.id}
                        direction="row"
                        gap="200"
                        alignItems="center"
                      >
                        <Text>{member.name}</Text>
                        <Text fontSize="sm">{member.role}</Text>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Email signature */}
        <Card.Root>
          <Card.Body>
            <Stack direction="column" gap="400">
              <Heading as="h4" size="xs" fontWeight="medium">
                Email Signature
              </Heading>
              <RichTextInput
                value={signature}
                onChange={setSignature}
                placeholder="Add your email signature..."
              />
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Advanced — CollapsibleMotion compound composition */}
        <Card.Root>
          <Card.Body>
            <CollapsibleMotion.Root
              isExpanded={isAdvancedOpen}
              onExpandedChange={setIsAdvancedOpen}
            >
              <Stack
                direction="row"
                gap="200"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Stack direction="row" gap="100" alignItems="center">
                  <Heading as="h4" size="xs" fontWeight="medium">
                    Advanced
                  </Heading>
                  <Tooltip.Root>
                    <MakeElementFocusable>
                      <Icon as={Info} size="2xs" color="neutral.11" />
                    </MakeElementFocusable>
                    <Tooltip.Content>
                      Regenerating the token immediately invalidates the
                      previous one.
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Stack>
                <CollapsibleMotion.Trigger asChild>
                  <Button variant="outline" colorPalette="primary">
                    {isAdvancedOpen
                      ? "Hide advanced settings"
                      : "Show advanced settings"}
                  </Button>
                </CollapsibleMotion.Trigger>
              </Stack>

              <CollapsibleMotion.Content>
                <Stack direction="column" gap="200" mt="400">
                  <Text as="label" fontSize="sm" fontWeight="medium">
                    API Access Token
                  </Text>
                  <Text fontStyle="italic">{apiToken}</Text>
                  <Box>
                    <Button
                      variant="outline"
                      size="sm"
                      colorPalette="primary"
                      onPress={handleRegenerateToken}
                    >
                      Regenerate token
                    </Button>
                  </Box>
                </Stack>
              </CollapsibleMotion.Content>
            </CollapsibleMotion.Root>
          </Card.Body>
        </Card.Root>

        {/* Form messages */}
        <Stack direction="column" gap="200">
          <Text color="warning.11">
            Changing your email signature applies to all future outgoing
            messages.
          </Text>
          <Text fontSize="sm" color="neutral.11">
            Settings are saved automatically to your account and synced across
            all your sessions.
          </Text>
        </Stack>

        {/* Save actions */}
        <Stack
          direction="row"
          gap="200"
          alignItems="center"
          justifyContent="flex-end"
          flexWrap="wrap"
        >
          <VisuallyHidden role="status" aria-live="polite">
            {isSaving
              ? "Saving settings"
              : savedAt
                ? `Settings saved at ${savedAt}`
                : "No pending changes"}
          </VisuallyHidden>
          <Button variant="outline" colorPalette="primary" onPress={() => {}}>
            Cancel
          </Button>
          <Button
            variant="solid"
            colorPalette="primary"
            onPress={handleSave}
            isDisabled={isSaving}
          >
            Save Changes
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
