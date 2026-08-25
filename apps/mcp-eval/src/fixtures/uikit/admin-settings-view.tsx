/**
 * Realistic Merchant Center "Account Settings" page built with UI Kit.
 *
 * This fixture covers migration patterns the other uikit fixtures don't:
 *
 * - PasswordInput (change password form)
 * - RadioInput.Group / RadioInput.Option (notification preferences)
 * - DateInput (read-only account created date)
 * - DateTimeInput (read-only last login, requires timeZone)
 * - TimeInput (daily digest time)
 * - DropdownMenu (triggerElement + ListMenuItem, page header actions)
 * - Tooltip (title + wrapped trigger element, help text on a label)
 * - Grid / Grid.Item (settings layout grid)
 * - LinkButton (external documentation link)
 * - CreatableSelectInput (free-form tags with onCreateOption)
 * - RichTextInput (email signature editor)
 * - CollapsibleMotion (render-prop driven animated reveal)
 * - AccessibleButton (unstyled-by-default custom action)
 * - HiddenInput (hidden form token)
 * - AccessibleHidden (screen-reader-only status text)
 * - TagList (assigned roles)
 * - ViewSwitcher.Group / ViewSwitcher.Button (card/list toggle)
 * - ErrorMessage / WarningMessage / AdditionalInfoMessage (form messages)
 */

import React, { useCallback, useState } from "react";
import {
  Text,
  Label,
  Card,
  Grid,
  Spacings,
  Constraints,
  PrimaryButton,
  SecondaryButton,
  LinkButton,
  AccessibleButton,
  IconButton,
  DropdownMenu,
  PasswordInput,
  RadioInput,
  DateInput,
  DateTimeInput,
  TimeInput,
  CreatableSelectInput,
  RichTextInput,
  CollapsibleMotion,
  Tooltip,
  TagList,
  Tag,
  ViewSwitcher,
  HiddenInput,
  AccessibleHidden,
  ErrorMessage,
  WarningMessage,
  AdditionalInfoMessage,
  GearIcon,
  InfoIcon,
  GridIcon,
  ListIcon,
} from "@commercetools-frontend/ui-kit";

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
  value: string;
  label: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const ACCOUNT_CREATED = "2022-03-14";
const LAST_LOGIN = "2026-08-24T09:15:00.000Z";
const ACCOUNT_TIME_ZONE = "Europe/Berlin";

const ASSIGNED_ROLES = ["Admin", "Order Manager", "Viewer"];

const INITIAL_TAG_OPTIONS: TagOption[] = [
  { value: "beta-tester", label: "Beta Tester" },
  { value: "internal", label: "Internal" },
  { value: "vip", label: "VIP" },
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
  const [digestTime, setDigestTime] = useState("09:00");

  // Tags & roles
  const [tagOptions, setTagOptions] =
    useState<TagOption[]>(INITIAL_TAG_OPTIONS);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([
    INITIAL_TAG_OPTIONS[0],
  ]);
  const [teamView, setTeamView] = useState<TeamView>("card");

  // Email signature
  const [signature, setSignature] = useState(
    "Best regards,\nThe Merchant Center Team"
  );

  // Advanced / API token
  const [apiToken, setApiToken] = useState("sk_live_4f8a...c93e");
  const [formToken] = useState("csrf-9f8a7b6c");

  // Save flow
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const handlePasswordFieldChange = useCallback(
    (field: keyof PasswordFormValues) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPasswords((prev) => ({ ...prev, [field]: value }));
        setPasswordError(
          field === "next" && value.length > 0 && value.length < 8
            ? "New password must be at least 8 characters long."
            : null
        );
      },
    []
  );

  const handleNotificationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNotificationChannel(event.target.value as NotificationChannel);
    },
    []
  );

  const handleDigestTimeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDigestTime(event.target.value);
    },
    []
  );

  // CreatableSelectInput has a fake-event shape: { target: { value } }
  const handleTagsChange = useCallback(
    (event: { target: { value: unknown } }) => {
      setSelectedTags((event.target.value as TagOption[]) ?? []);
    },
    []
  );

  const handleCreateTag = useCallback((inputValue: string) => {
    const newTag: TagOption = {
      value: inputValue.toLowerCase().replace(/\s+/g, "-"),
      label: inputValue,
    };
    setTagOptions((prev) => [...prev, newTag]);
    setSelectedTags((prev) => [...prev, newTag]);
  }, []);

  // RichTextInput onChange receives { target: { value } }
  const handleSignatureChange = useCallback(
    (event: { target: { value: string } }) => {
      setSignature(event.target.value);
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
    <Constraints.Horizontal max={16}>
      <Spacings.Stack scale="l">
        {/* Hidden form token — not rendered visually */}
        <HiddenInput name="formToken" value={formToken} />

        {/* Page header */}
        <Spacings.Inline
          scale="m"
          alignItems="center"
          justifyContent="space-between"
        >
          <Spacings.Inline scale="s" alignItems="center">
            <Text.Headline as="h1">Account Settings</Text.Headline>
            <LinkButton
              label="View documentation"
              to="https://docs.example.com/account-settings"
              isExternal
            />
          </Spacings.Inline>

          <DropdownMenu
            triggerElement={
              <IconButton
                icon={<GearIcon />}
                label="Account actions"
                onClick={() => {}}
              />
            }
            menuType="list"
          >
            <DropdownMenu.ListMenuItem onClick={() => {}}>
              Export settings
            </DropdownMenu.ListMenuItem>
            <DropdownMenu.ListMenuItem onClick={() => {}}>
              Import settings
            </DropdownMenu.ListMenuItem>
            <DropdownMenu.ListMenuItem onClick={() => {}} isDisabled={isSaving}>
              Reset to defaults
            </DropdownMenu.ListMenuItem>
          </DropdownMenu>
        </Spacings.Inline>

        {/* Profile section — Grid layout */}
        <Card>
          <Spacings.Stack scale="m">
            <Text.Subheadline as="h4">Profile</Text.Subheadline>

            <Grid gridTemplateColumns="1fr 1fr" gridGap="32px">
              <Grid.Item>
                <Spacings.Stack scale="m">
                  <Spacings.Stack scale="xs">
                    <Label isRequiredIndicatorVisible>Current Password</Label>
                    <PasswordInput
                      name="currentPassword"
                      value={passwords.current}
                      onChange={handlePasswordFieldChange("current")}
                      placeholder="Enter current password"
                    />
                  </Spacings.Stack>

                  <Spacings.Stack scale="xs">
                    <Spacings.Inline scale="xs" alignItems="center">
                      <Label isRequiredIndicatorVisible>New Password</Label>
                      <Tooltip title="Must be at least 8 characters long.">
                        <InfoIcon />
                      </Tooltip>
                    </Spacings.Inline>
                    <PasswordInput
                      name="newPassword"
                      value={passwords.next}
                      onChange={handlePasswordFieldChange("next")}
                      placeholder="Enter new password"
                      hasError={Boolean(passwordError)}
                    />
                  </Spacings.Stack>
                </Spacings.Stack>
              </Grid.Item>

              <Grid.Item>
                <Spacings.Stack scale="m">
                  <Spacings.Stack scale="xs">
                    <Label>Account Created</Label>
                    <DateInput value={ACCOUNT_CREATED} isReadOnly />
                  </Spacings.Stack>

                  <Spacings.Stack scale="xs">
                    <Label>Last Login</Label>
                    <DateTimeInput
                      value={LAST_LOGIN}
                      timeZone={ACCOUNT_TIME_ZONE}
                      isReadOnly
                    />
                  </Spacings.Stack>
                </Spacings.Stack>
              </Grid.Item>
            </Grid>

            {passwordError && (
              <ErrorMessage>
                <Text.Detail tone="critical">{passwordError}</Text.Detail>
              </ErrorMessage>
            )}
          </Spacings.Stack>
        </Card>

        {/* Notification preferences */}
        <Card>
          <Spacings.Stack scale="m">
            <Text.Subheadline as="h4">
              Notification Preferences
            </Text.Subheadline>

            <Spacings.Stack scale="xs">
              <Label>Notify me via</Label>
              <RadioInput.Group
                name="notificationChannel"
                value={notificationChannel}
                onChange={handleNotificationChange}
                direction="stack"
              >
                <RadioInput.Option value="email">Email</RadioInput.Option>
                <RadioInput.Option value="slack">Slack</RadioInput.Option>
                <RadioInput.Option value="none">
                  Do not notify me
                </RadioInput.Option>
              </RadioInput.Group>
            </Spacings.Stack>

            <Constraints.Horizontal max={5}>
              <Spacings.Stack scale="xs">
                <Label>Daily Digest Time</Label>
                <TimeInput
                  name="digestTime"
                  value={digestTime}
                  onChange={handleDigestTimeChange}
                  isDisabled={notificationChannel === "none"}
                />
              </Spacings.Stack>
            </Constraints.Horizontal>
          </Spacings.Stack>
        </Card>

        {/* Tags & Roles */}
        <Card>
          <Spacings.Stack scale="m">
            <Text.Subheadline as="h4">Tags & Roles</Text.Subheadline>

            <Constraints.Horizontal max={10}>
              <Spacings.Stack scale="xs">
                <Label>Custom Tags</Label>
                <CreatableSelectInput
                  name="customTags"
                  isMulti
                  value={selectedTags}
                  options={tagOptions}
                  onChange={handleTagsChange}
                  onCreateOption={handleCreateTag}
                  placeholder="Add a tag..."
                />
              </Spacings.Stack>
            </Constraints.Horizontal>

            <Spacings.Stack scale="xs">
              <Label>Assigned Roles</Label>
              <TagList>
                {ASSIGNED_ROLES.map((role) => (
                  <Tag key={role}>{role}</Tag>
                ))}
              </TagList>
            </Spacings.Stack>

            <Spacings.Stack scale="s">
              <Spacings.Inline
                scale="s"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text.Body isBold>Team Members</Text.Body>
                <ViewSwitcher.Group
                  selectedValue={teamView}
                  onChange={(value) => setTeamView(value as TeamView)}
                >
                  <ViewSwitcher.Button
                    value="card"
                    label="Card view"
                    icon={<GridIcon />}
                  />
                  <ViewSwitcher.Button
                    value="list"
                    label="List view"
                    icon={<ListIcon />}
                  />
                </ViewSwitcher.Group>
              </Spacings.Inline>

              {teamView === "card" ? (
                <Spacings.Inline scale="m">
                  {TEAM_MEMBERS.map((member) => (
                    <Card key={member.id}>
                      <Spacings.Stack scale="xs">
                        <Text.Body isBold>{member.name}</Text.Body>
                        <Text.Detail>{member.role}</Text.Detail>
                      </Spacings.Stack>
                    </Card>
                  ))}
                </Spacings.Inline>
              ) : (
                <Spacings.Stack scale="xs">
                  {TEAM_MEMBERS.map((member) => (
                    <Spacings.Inline
                      key={member.id}
                      scale="s"
                      alignItems="center"
                    >
                      <Text.Body>{member.name}</Text.Body>
                      <Text.Detail>{member.role}</Text.Detail>
                    </Spacings.Inline>
                  ))}
                </Spacings.Stack>
              )}
            </Spacings.Stack>
          </Spacings.Stack>
        </Card>

        {/* Email signature */}
        <Card>
          <Spacings.Stack scale="m">
            <Text.Subheadline as="h4">Email Signature</Text.Subheadline>
            <RichTextInput
              name="signature"
              value={signature}
              onChange={handleSignatureChange}
              placeholder="Add your email signature..."
              showExpandIcon
            />
          </Spacings.Stack>
        </Card>

        {/* Advanced — CollapsibleMotion render-prop reveal */}
        <Card>
          <CollapsibleMotion isDefaultClosed>
            {({ isOpen, toggle, containerStyles, registerContentNode }) => (
              <Spacings.Stack scale="m">
                <Spacings.Inline
                  scale="s"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Spacings.Inline scale="xs" alignItems="center">
                    <Text.Subheadline as="h4">Advanced</Text.Subheadline>
                    <Tooltip title="Regenerating the token immediately invalidates the previous one.">
                      <InfoIcon />
                    </Tooltip>
                  </Spacings.Inline>
                  <SecondaryButton
                    label={
                      isOpen
                        ? "Hide advanced settings"
                        : "Show advanced settings"
                    }
                    onClick={toggle}
                  />
                </Spacings.Inline>

                <div style={containerStyles} ref={registerContentNode}>
                  <Spacings.Stack scale="s">
                    <Label>API Access Token</Label>
                    <Text.Body isItalic>{apiToken}</Text.Body>
                    <AccessibleButton
                      label="Regenerate the API access token"
                      onClick={handleRegenerateToken}
                      className="admin-settings-regenerate-token"
                    >
                      Regenerate token
                    </AccessibleButton>
                  </Spacings.Stack>
                </div>
              </Spacings.Stack>
            )}
          </CollapsibleMotion>
        </Card>

        {/* Form messages */}
        <Spacings.Stack scale="s">
          <WarningMessage>
            Changing your email signature applies to all future outgoing
            messages.
          </WarningMessage>
          <AdditionalInfoMessage message="Settings are saved automatically to your account and synced across all your sessions." />
        </Spacings.Stack>

        {/* Save actions */}
        <Spacings.Inline scale="s" justifyContent="flex-end">
          <AccessibleHidden>
            {isSaving
              ? "Saving settings"
              : savedAt
                ? `Settings saved at ${savedAt}`
                : "No pending changes"}
          </AccessibleHidden>
          <SecondaryButton label="Cancel" onClick={() => {}} />
          <PrimaryButton
            label="Save Changes"
            onClick={handleSave}
            isDisabled={isSaving}
          />
        </Spacings.Inline>
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
}
