"use client";

import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Calendar,
  Card,
  Checkbox,
  Code,
  CollapsibleMotion,
  ComboBox,
  DataTable,
  DateInput,
  DatePicker,
  DateRangePicker,
  DefaultPage,
  Dialog,
  DraggableList,
  Drawer,
  FieldErrors,
  Flex,
  FormField,
  Grid,
  Group,
  Heading,
  Icon,
  IconButton,
  IconToggleButton,
  Image,
  InlineSvg,
  Kbd,
  Link,
  List,
  LoadingSpinner,
  LocalizedField,
  Menu,
  ModalPage,
  MoneyInput,
  MultilineTextInput,
  NumberInput,
  PageContent,
  Pagination,
  PasswordInput,
  ProgressBar,
  RadioInput,
  RangeCalendar,
  ScrollArea,
  ScopedSearchInput,
  SearchInput,
  Select,
  Separator,
  SimpleGrid,
  Spacer,
  SplitButton,
  Stack,
  Steps,
  Switch,
  TabNav,
  Tabs,
  TagGroup,
  Text,
  TextInput,
  TimeInput,
  ToastOutlet,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  VisuallyHidden,
} from "@commercetools/nimbus";
import { Add, Bookmark, Check, Save, Star } from "@commercetools/nimbus-icons";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Stack gap="400" paddingY="400">
      <Heading as="h2">{title}</Heading>
      <Box
        borderWidth="1px"
        borderColor="neutral.6"
        borderRadius="200"
        padding="400"
      >
        {children}
      </Box>
    </Stack>
  );
}

export default function Page() {
  return (
    <Box padding="600" maxWidth="960px" marginX="auto">
      <Heading as="h1">Nimbus SSR Test</Heading>
      <Text>
        Every component below was server-rendered by Next.js App Router. If you
        can see this page without errors, SSR is working.
      </Text>

      <Separator marginY="400" />

      <Section title="Layout Primitives">
        <Stack gap="200">
          <Box>Box</Box>
          <Flex>Flex</Flex>
          <Grid>Grid</Grid>
          <Stack>Stack</Stack>
          <Group>Group</Group>
          <SimpleGrid>SimpleGrid</SimpleGrid>
          <Spacer />
          <Separator />
          <PageContent.Root>
            <PageContent.Column>PageContent</PageContent.Column>
          </PageContent.Root>
          <ScrollArea maxHeight="100px">ScrollArea content</ScrollArea>
        </Stack>
      </Section>

      <Section title="Typography and Display">
        <Stack gap="200">
          <Text>Text</Text>
          <Heading as="h3">Heading</Heading>
          <Code>Code</Code>
          <Kbd>K</Kbd>
          <Badge>Badge</Badge>
          <Icon>
            <Star />
          </Icon>
          <Image
            src="https://placehold.co/50x50"
            alt="placeholder"
            width="50px"
            height="50px"
          />
          <InlineSvg data='<svg><path d="M0 0" /></svg>' />
          <Avatar firstName="Test" lastName="User" />
          <VisuallyHidden>Hidden text</VisuallyHidden>
        </Stack>
      </Section>

      <Section title="Feedback">
        <Stack gap="200">
          <Alert.Root variant="flat">
            <Alert.Description>Alert message</Alert.Description>
          </Alert.Root>
          <LoadingSpinner />
          <ProgressBar value={50} aria-label="progress" />
          <ToastOutlet />
        </Stack>
      </Section>

      <Section title="Buttons">
        <Group gap="200">
          <Button>Button</Button>
          <IconButton aria-label="action">
            <Add />
          </IconButton>
          <ToggleButton>Toggle</ToggleButton>
          <IconToggleButton aria-label="toggle">
            <Bookmark />
          </IconToggleButton>
          <SplitButton
            onAction={() => {}}
            aria-label="more actions"
            icon={<Save />}
          >
            <Menu.Item id="action">Action</Menu.Item>
          </SplitButton>
          <ToggleButtonGroup.Root selectionMode="single">
            <ToggleButtonGroup.Button id="a">A</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button id="b">B</ToggleButtonGroup.Button>
          </ToggleButtonGroup.Root>
        </Group>
      </Section>

      <Section title="Form Inputs">
        <Stack gap="200">
          <TextInput aria-label="text" />
          <NumberInput aria-label="number" />
          <PasswordInput aria-label="password" />
          <MultilineTextInput aria-label="multiline" />
          <SearchInput aria-label="search" />
          <ScopedSearchInput
            aria-label="scoped search"
            options={[{ value: "all", label: "All" }]}
            value={{ option: "all", text: "" }}
            onSubmit={() => {}}
          />
          <MoneyInput
            aria-label="money"
            currencies={["EUR", "USD"]}
            value={{ amount: "", currencyCode: "EUR" }}
          />
          <Checkbox>Checkbox</Checkbox>
          <Switch>Switch</Switch>
          <RadioInput.Root aria-label="radio">
            <RadioInput.Option value="a">A</RadioInput.Option>
            <RadioInput.Option value="b">B</RadioInput.Option>
          </RadioInput.Root>
          <DateInput aria-label="date" />
          <TimeInput aria-label="time" />
          <Select.Root aria-label="select">
            <Select.Options>
              <Select.Option id="1">One</Select.Option>
              <Select.Option id="2">Two</Select.Option>
              <Select.Option id="3">Three</Select.Option>
              <Select.Option id="4">Four</Select.Option>
            </Select.Options>
          </Select.Root>
        </Stack>
      </Section>

      <Section title="Compound and Overlay Components">
        <Stack gap="400">
          <Accordion.Root>
            <Accordion.Item value="a">
              <Accordion.Header>Accordion Header</Accordion.Header>
              <Accordion.Content>Accordion Content</Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>

          <Card.Root>
            <Card.Header>Card Header</Card.Header>
            <Card.Body>Card Body</Card.Body>
          </Card.Root>

          <CollapsibleMotion.Root>
            <CollapsibleMotion.Trigger>
              Collapsible Trigger
            </CollapsibleMotion.Trigger>
            <CollapsibleMotion.Content>
              Collapsible Content
            </CollapsibleMotion.Content>
          </CollapsibleMotion.Root>

          <Tabs.Root>
            <Tabs.List>
              <Tabs.Tab id="t1">Overview</Tabs.Tab>
              <Tabs.Tab id="t2">Details</Tabs.Tab>
              <Tabs.Tab id="t3">Settings</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
              <Tabs.Panel id="t1">Overview panel content</Tabs.Panel>
              <Tabs.Panel id="t2">Details panel content</Tabs.Panel>
              <Tabs.Panel id="t3">Settings panel content</Tabs.Panel>
            </Tabs.Panels>
          </Tabs.Root>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button>Open Dialog</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Dialog Title</Dialog.Title>
              <Dialog.Body>Dialog Body</Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>

          <Drawer.Root>
            <Drawer.Trigger asChild>
              <Button>Open Drawer</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Drawer Title</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>Drawer Body</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>

          <Box width="fit-content">
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button>Open Menu</Button>
              </Menu.Trigger>
              <Menu.Content>
                <Menu.Item id="a">Menu Item</Menu.Item>
              </Menu.Content>
            </Menu.Root>
          </Box>

          <Tooltip.Root>
            <Button>Hover for Tooltip</Button>
            <Tooltip.Content>Tooltip content</Tooltip.Content>
          </Tooltip.Root>

          <Steps.Root count={4} defaultStep={1}>
            <Steps.List>
              <Steps.Item index={0}>
                <Steps.Trigger>
                  <Steps.Indicator>
                    <Steps.Status
                      complete={<Check />}
                      incomplete={<Steps.Number />}
                    />
                  </Steps.Indicator>
                  Account
                </Steps.Trigger>
              </Steps.Item>
              <Steps.Item index={1}>
                <Steps.Trigger>
                  <Steps.Indicator>
                    <Steps.Status
                      complete={<Check />}
                      incomplete={<Steps.Number />}
                    />
                  </Steps.Indicator>
                  Profile
                </Steps.Trigger>
              </Steps.Item>
              <Steps.Item index={2}>
                <Steps.Trigger>
                  <Steps.Indicator>
                    <Steps.Status
                      complete={<Check />}
                      incomplete={<Steps.Number />}
                    />
                  </Steps.Indicator>
                  Review
                </Steps.Trigger>
              </Steps.Item>
              <Steps.Item index={3}>
                <Steps.Trigger>
                  <Steps.Indicator>
                    <Steps.Status
                      complete={<Check />}
                      incomplete={<Steps.Number />}
                    />
                  </Steps.Indicator>
                  Complete
                </Steps.Trigger>
              </Steps.Item>
            </Steps.List>
            <Steps.Content index={0}>Create your account</Steps.Content>
            <Steps.Content index={1}>Fill in your profile</Steps.Content>
            <Steps.Content index={2}>Review your information</Steps.Content>
            <Steps.Content index={3}>All done!</Steps.Content>
          </Steps.Root>

          <ModalPage.Root isOpen={false} onClose={() => {}}>
            <ModalPage.TopBar
              previousPathLabel="Back"
              currentPathLabel="Details"
            />
            <ModalPage.Header>
              <ModalPage.Title>Modal Page</ModalPage.Title>
            </ModalPage.Header>
            <ModalPage.Content>Modal content</ModalPage.Content>
          </ModalPage.Root>
        </Stack>
      </Section>

      <Section title="Navigation">
        <Stack gap="200">
          <Link href="#">Link</Link>
          <TabNav.Root aria-label="nav">
            <TabNav.Item href="/home">Home</TabNav.Item>
          </TabNav.Root>
          <Pagination totalItems={100} />
        </Stack>
      </Section>

      <Section title="Data Display">
        <Stack gap="400">
          <DataTable
            aria-label="data table"
            columns={[
              { id: "name", header: "Name", accessor: (row) => row.name },
              { id: "role", header: "Role", accessor: (row) => row.role },
              { id: "status", header: "Status", accessor: (row) => row.status },
            ]}
            rows={[
              { id: "1", name: "Alice", role: "Engineer", status: "Active" },
              { id: "2", name: "Bob", role: "Designer", status: "Active" },
              { id: "3", name: "Carol", role: "PM", status: "Away" },
            ]}
          />

          <TagGroup.Root aria-label="tags">
            <TagGroup.TagList>
              <TagGroup.Tag id="a">Tag A</TagGroup.Tag>
            </TagGroup.TagList>
          </TagGroup.Root>

          <List.Root>
            <List.Item>List Item</List.Item>
          </List.Root>

          <DraggableList.Root
            aria-label="draggable"
            items={[
              { id: "1", key: "1", label: "Item 1" },
              { id: "2", key: "2", label: "Item 2" },
              { id: "3", key: "3", label: "Item 3" },
            ]}
          />
        </Stack>
      </Section>

      <Section title="Form Structure">
        <Stack gap="200">
          <FormField.Root>
            <FormField.Label>Label</FormField.Label>
            <FormField.Input>
              <TextInput aria-label="field" />
            </FormField.Input>
          </FormField.Root>
          <FieldErrors errors={{ required: true }} />
          <LocalizedField
            aria-label="localized"
            defaultLocaleOrCurrency="en"
            valuesByLocaleOrCurrency={{ en: "hello" }}
            onChange={() => {}}
          />
        </Stack>
      </Section>

      <Section title="Date Components">
        <Stack gap="200">
          <Calendar aria-label="calendar" />
          <RangeCalendar aria-label="range calendar" />
          <DatePicker aria-label="date picker" />
          <DateRangePicker aria-label="date range picker" />
        </Stack>
      </Section>

      <Section title="Miscellaneous">
        <Stack gap="200">
          <Toolbar aria-label="toolbar">
            <Button>Tool</Button>
          </Toolbar>

          <ComboBox.Root aria-label="combo">
            <ComboBox.Trigger />
            <ComboBox.Popover>
              <ComboBox.ListBox>
                <ComboBox.Option id="a">Apple</ComboBox.Option>
                <ComboBox.Option id="b">Banana</ComboBox.Option>
                <ComboBox.Option id="c">Cherry</ComboBox.Option>
                <ComboBox.Option id="d">Date</ComboBox.Option>
              </ComboBox.ListBox>
            </ComboBox.Popover>
          </ComboBox.Root>

          <DefaultPage.Root>
            <DefaultPage.Header>
              <DefaultPage.Title>Default Page</DefaultPage.Title>
            </DefaultPage.Header>
            <DefaultPage.Content>Default page content</DefaultPage.Content>
          </DefaultPage.Root>
        </Stack>
      </Section>
    </Box>
  );
}
