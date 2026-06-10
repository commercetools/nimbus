/**
 * SSR (Server-Side Rendering) validation tests.
 *
 * These tests run in a pure Node.js environment (no JSDOM, no window/document)
 * and use `renderToString` from `react-dom/server` to verify every Nimbus
 * component can render without crashing on the server.
 *
 * Failures here mean a component accesses browser-only globals during render,
 * which would break SSR in Next.js, Remix, or any server-rendering framework.
 */
import { renderToString } from "react-dom/server";

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
  NimbusI18nProvider,
  NimbusProvider,
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
  Table,
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
  RichTextInput,
  VisuallyHidden,
} from "@/components";

import {
  ConfirmationDialog,
  FormActionBar,
  FormDialog,
  InfoDialog,
  PublicPageLayout,
  TextInputField,
  NumberInputField,
  PasswordInputField,
  SearchInputField,
  MultilineTextInputField,
  DateRangePickerField,
  MoneyInputField,
} from "@/patterns";

function renderSSR(ui: React.ReactElement): string {
  return renderToString(
    <NimbusProvider locale="en-US" loadFonts={false}>
      {ui}
    </NimbusProvider>
  );
}

function renderSSRRaw(ui: React.ReactElement): string {
  return renderToString(ui);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

describe("SSR: NimbusProvider", () => {
  it("renders without crashing", () => {
    const html = renderSSRRaw(
      <NimbusProvider locale="en-US" loadFonts={false}>
        <div>app</div>
      </NimbusProvider>
    );
    expect(html).toContain("app");
  });

  it("renders with font loading enabled", () => {
    const html = renderSSRRaw(
      <NimbusProvider locale="en-US" loadFonts={true}>
        <div>app</div>
      </NimbusProvider>
    );
    expect(html).toContain("app");
  });
});

describe("SSR: NimbusI18nProvider", () => {
  it("renders without crashing", () => {
    const html = renderSSRRaw(
      <NimbusI18nProvider locale="en-US">
        <div>i18n</div>
      </NimbusI18nProvider>
    );
    expect(html).toContain("i18n");
  });
});

// ---------------------------------------------------------------------------
// Layout primitives
// ---------------------------------------------------------------------------

describe("SSR: layout primitives", () => {
  it("Box", () => {
    expect(renderSSR(<Box>content</Box>)).toContain("content");
  });

  it("Flex", () => {
    expect(renderSSR(<Flex>flex</Flex>)).toContain("flex");
  });

  it("Grid", () => {
    expect(renderSSR(<Grid>grid</Grid>)).toContain("grid");
  });

  it("Stack", () => {
    expect(renderSSR(<Stack>stack</Stack>)).toContain("stack");
  });

  it("Group", () => {
    expect(renderSSR(<Group>group</Group>)).toContain("group");
  });

  it("SimpleGrid", () => {
    expect(renderSSR(<SimpleGrid>simple</SimpleGrid>)).toContain("simple");
  });

  it("Spacer", () => {
    expect(renderSSR(<Spacer />)).toBeTruthy();
  });

  it("Separator", () => {
    expect(renderSSR(<Separator />)).toBeTruthy();
  });

  it("PageContent", () => {
    expect(
      renderSSR(
        <PageContent.Root>
          <PageContent.Column>col</PageContent.Column>
        </PageContent.Root>
      )
    ).toContain("col");
  });

  it("ScrollArea", () => {
    expect(renderSSR(<ScrollArea>scroll</ScrollArea>)).toContain("scroll");
  });
});

// ---------------------------------------------------------------------------
// Typography & display
// ---------------------------------------------------------------------------

describe("SSR: typography and display", () => {
  it("Text", () => {
    expect(renderSSR(<Text>hello</Text>)).toContain("hello");
  });

  it("Heading", () => {
    expect(renderSSR(<Heading as="h1">title</Heading>)).toContain("title");
  });

  it("Code", () => {
    expect(renderSSR(<Code>code</Code>)).toContain("code");
  });

  it("Kbd", () => {
    expect(renderSSR(<Kbd>K</Kbd>)).toContain("K");
  });

  it("Badge", () => {
    expect(renderSSR(<Badge>new</Badge>)).toContain("new");
  });

  it("Icon", () => {
    expect(
      renderSSR(
        <Icon>
          <svg>
            <path d="M0 0" />
          </svg>
        </Icon>
      )
    ).toBeTruthy();
  });

  it("InlineSvg", () => {
    expect(
      renderSSR(<InlineSvg data='<svg><path d="M0 0" /></svg>' />)
    ).toBeTruthy();
  });

  it("Image", () => {
    expect(renderSSR(<Image src="test.png" alt="test" />)).toContain("test");
  });

  it("Avatar", () => {
    expect(renderSSR(<Avatar firstName="Test" lastName="User" />)).toBeTruthy();
  });

  it("VisuallyHidden", () => {
    expect(renderSSR(<VisuallyHidden>hidden</VisuallyHidden>)).toContain(
      "hidden"
    );
  });
});

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

describe("SSR: feedback components", () => {
  it("Alert", () => {
    expect(
      renderSSR(
        <Alert.Root variant="flat">
          <Alert.Description>message</Alert.Description>
        </Alert.Root>
      )
    ).toContain("message");
  });

  it("LoadingSpinner", () => {
    expect(renderSSR(<LoadingSpinner />)).toBeTruthy();
  });

  it("ProgressBar", () => {
    expect(
      renderSSR(<ProgressBar value={50} aria-label="progress" />)
    ).toBeTruthy();
  });

  it("ToastOutlet", () => {
    expect(renderSSR(<ToastOutlet />)).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

describe("SSR: buttons", () => {
  it("Button", () => {
    expect(renderSSR(<Button>click</Button>)).toContain("click");
  });

  it("IconButton", () => {
    expect(renderSSR(<IconButton aria-label="action" />)).toBeTruthy();
  });

  it("ToggleButton", () => {
    expect(renderSSR(<ToggleButton>toggle</ToggleButton>)).toContain("toggle");
  });

  it("IconToggleButton", () => {
    expect(renderSSR(<IconToggleButton aria-label="toggle" />)).toBeTruthy();
  });

  it("SplitButton", () => {
    expect(
      renderSSR(
        <SplitButton onAction={() => {}} aria-label="more actions">
          <Menu.Item id="action">action</Menu.Item>
        </SplitButton>
      )
    ).toContain("action");
  });

  it("ToggleButtonGroup", () => {
    expect(
      renderSSR(
        <ToggleButtonGroup.Root selectionMode="single">
          <ToggleButtonGroup.Button id="a">A</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="b">B</ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      )
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Form inputs
// ---------------------------------------------------------------------------

describe("SSR: form inputs", () => {
  it("TextInput", () => {
    expect(renderSSR(<TextInput aria-label="text" />)).toBeTruthy();
  });

  it("NumberInput", () => {
    expect(renderSSR(<NumberInput aria-label="number" />)).toBeTruthy();
  });

  it("PasswordInput", () => {
    expect(renderSSR(<PasswordInput aria-label="password" />)).toBeTruthy();
  });

  it("MultilineTextInput", () => {
    expect(
      renderSSR(<MultilineTextInput aria-label="multiline" />)
    ).toBeTruthy();
  });

  it("SearchInput", () => {
    expect(renderSSR(<SearchInput aria-label="search" />)).toBeTruthy();
  });

  it("ScopedSearchInput", () => {
    expect(
      renderSSR(
        <ScopedSearchInput
          aria-label="scoped search"
          options={[{ value: "all", label: "All" }]}
          value={{ option: "all", text: "" }}
          onSubmit={() => {}}
        />
      )
    ).toBeTruthy();
  });

  it("MoneyInput", () => {
    expect(
      renderSSR(
        <MoneyInput
          aria-label="money"
          currencies={["EUR", "USD"]}
          value={{ amount: "", currencyCode: "EUR" }}
        />
      )
    ).toBeTruthy();
  });

  it("Checkbox", () => {
    expect(renderSSR(<Checkbox>agree</Checkbox>)).toContain("agree");
  });

  it("Switch", () => {
    expect(renderSSR(<Switch>toggle</Switch>)).toContain("toggle");
  });

  it("RadioInput", () => {
    expect(
      renderSSR(
        <RadioInput.Root aria-label="radio">
          <RadioInput.Option value="a">A</RadioInput.Option>
          <RadioInput.Option value="b">B</RadioInput.Option>
        </RadioInput.Root>
      )
    ).toBeTruthy();
  });

  it("DateInput", () => {
    expect(renderSSR(<DateInput aria-label="date" />)).toBeTruthy();
  });

  it("TimeInput", () => {
    expect(renderSSR(<TimeInput aria-label="time" />)).toBeTruthy();
  });

  it("Select", () => {
    expect(
      renderSSR(
        <Select.Root aria-label="select">
          <Select.Options>
            <Select.Option id="1">One</Select.Option>
          </Select.Options>
        </Select.Root>
      )
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Compound/overlay components
// ---------------------------------------------------------------------------

describe("SSR: compound and overlay components", () => {
  it("Accordion", () => {
    expect(
      renderSSR(
        <Accordion.Root>
          <Accordion.Item value="a">
            <Accordion.Header>Header</Accordion.Header>
            <Accordion.Content>Content</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      )
    ).toContain("Header");
  });

  it("Card", () => {
    expect(
      renderSSR(
        <Card.Root>
          <Card.Header>header</Card.Header>
          <Card.Body>body</Card.Body>
        </Card.Root>
      )
    ).toContain("header");
  });

  it("CollapsibleMotion", () => {
    expect(
      renderSSR(
        <CollapsibleMotion.Root>
          <CollapsibleMotion.Trigger>trigger</CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>content</CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      )
    ).toContain("trigger");
  });

  it("Tabs", () => {
    expect(
      renderSSR(
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab id="t1">Tab 1</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="t1">Panel 1</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      )
    ).toContain("Tab 1");
  });

  it("Dialog", () => {
    const html = renderSSR(
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>open</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Body>Body</Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    );
    expect(html).toContain("open");
  });

  it("Drawer", () => {
    const html = renderSSR(
      <Drawer.Root>
        <Drawer.Trigger>
          <Button>open</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Title</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>Body</Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    );
    expect(html).toContain("open");
  });

  it("Menu", () => {
    const html = renderSSR(
      <Menu.Root>
        <Menu.Trigger>
          <Button>menu</Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="a">Item A</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );
    expect(html).toContain("menu");
  });

  it("Tooltip", () => {
    const html = renderSSR(
      <Tooltip.Root>
        <Button>hover</Button>
        <Tooltip.Content>tip</Tooltip.Content>
      </Tooltip.Root>
    );
    expect(html).toContain("hover");
  });

  it("Steps", () => {
    expect(
      renderSSR(
        <Steps.Root count={3}>
          <Steps.List>
            <Steps.Item index={0}>
              <Steps.Trigger>
                <Steps.Indicator />
              </Steps.Trigger>
            </Steps.Item>
          </Steps.List>
          <Steps.Content index={0}>Step 1</Steps.Content>
        </Steps.Root>
      )
    ).toContain("Step 1");
  });

  it("ModalPage", () => {
    const html = renderSSR(
      <ModalPage.Root isOpen={false} onClose={() => {}}>
        <ModalPage.TopBar previousPathLabel="Back" currentPathLabel="Details" />
        <ModalPage.Header>
          <ModalPage.Title>Title</ModalPage.Title>
        </ModalPage.Header>
        <ModalPage.Content>body</ModalPage.Content>
      </ModalPage.Root>
    );
    expect(html).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

describe("SSR: navigation", () => {
  it("Link", () => {
    expect(renderSSR(<Link href="#">link</Link>)).toContain("link");
  });

  it("TabNav", () => {
    expect(
      renderSSR(
        <TabNav.Root aria-label="nav">
          <TabNav.Item href="#">Home</TabNav.Item>
        </TabNav.Root>
      )
    ).toContain("Home");
  });

  it("Pagination", () => {
    expect(
      renderSSR(
        <Pagination totalItems={100} currentPage={1} onPageChange={() => {}} />
      )
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Data display
// ---------------------------------------------------------------------------

describe("SSR: data display", () => {
  it("Table", () => {
    expect(
      renderSSR(
        <Table.Root aria-label="table">
          <Table.Header>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Alice</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      )
    ).toContain("Alice");
  });

  it("DataTable", () => {
    expect(
      renderSSR(
        <DataTable
          aria-label="data table"
          columns={[
            { id: "name", header: "Name", accessor: (row) => row.name },
          ]}
          rows={[{ id: "1", name: "Alice" }]}
        />
      )
    ).toContain("Alice");
  });

  it("TagGroup", () => {
    expect(
      renderSSR(
        <TagGroup.Root aria-label="tags">
          <TagGroup.TagList>
            <TagGroup.Tag id="a">Tag A</TagGroup.Tag>
          </TagGroup.TagList>
        </TagGroup.Root>
      )
    ).toContain("Tag A");
  });

  it("List", () => {
    expect(
      renderSSR(
        <List.Root>
          <List.Item>item</List.Item>
        </List.Root>
      )
    ).toContain("item");
  });

  it("DraggableList", () => {
    expect(
      renderSSR(
        <DraggableList.Root
          aria-label="draggable"
          items={[{ id: "1", key: "1", label: "Item 1" }]}
        />
      )
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Form structure
// ---------------------------------------------------------------------------

describe("SSR: form structure", () => {
  it("FormField", () => {
    expect(
      renderSSR(
        <FormField.Root>
          <FormField.Label>Label</FormField.Label>
          <FormField.Input>
            <TextInput aria-label="field" />
          </FormField.Input>
        </FormField.Root>
      )
    ).toBeTruthy();
  });

  it("FieldErrors", () => {
    expect(renderSSR(<FieldErrors errors={{ required: true }} />)).toBeTruthy();
  });

  it("LocalizedField", () => {
    expect(
      renderSSR(
        <LocalizedField
          aria-label="localized"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={{ en: "hello" }}
          onChange={() => {}}
        />
      )
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Date components
// ---------------------------------------------------------------------------

describe("SSR: date components", () => {
  it("Calendar", () => {
    expect(renderSSR(<Calendar aria-label="calendar" />)).toBeTruthy();
  });

  it("RangeCalendar", () => {
    expect(renderSSR(<RangeCalendar aria-label="range" />)).toBeTruthy();
  });

  it("DatePicker", () => {
    expect(renderSSR(<DatePicker aria-label="pick date" />)).toBeTruthy();
  });

  it("DateRangePicker", () => {
    expect(renderSSR(<DateRangePicker aria-label="date range" />)).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

describe("SSR: miscellaneous", () => {
  it("Toolbar", () => {
    expect(
      renderSSR(
        <Toolbar aria-label="toolbar">
          <Button>tool</Button>
        </Toolbar>
      )
    ).toContain("tool");
  });

  it("ComboBox", () => {
    expect(
      renderSSR(
        <ComboBox.Root aria-label="combo">
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="a">A</ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      )
    ).toBeTruthy();
  });

  it("DefaultPage", () => {
    expect(
      renderSSR(
        <DefaultPage.Root>
          <DefaultPage.Header>
            <DefaultPage.Title>Page</DefaultPage.Title>
          </DefaultPage.Header>
          <DefaultPage.Content>content</DefaultPage.Content>
        </DefaultPage.Root>
      )
    ).toContain("Page");
  });
});

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------

describe("SSR: pattern components", () => {
  it("ConfirmationDialog", () => {
    const html = renderSSR(
      <ConfirmationDialog
        title="Confirm?"
        isOpen={false}
        onOpenChange={() => {}}
        onConfirm={() => {}}
        onCancel={() => {}}
      >
        <Text>Are you sure?</Text>
      </ConfirmationDialog>
    );
    expect(html).toBeTruthy();
  });

  it("InfoDialog", () => {
    const html = renderSSR(
      <InfoDialog title="Info" isOpen={false} onOpenChange={() => {}}>
        <Text>Information</Text>
      </InfoDialog>
    );
    expect(html).toBeTruthy();
  });

  it("FormDialog", () => {
    const html = renderSSR(
      <FormDialog
        title="Edit"
        isOpen={false}
        onOpenChange={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
      >
        <TextInput aria-label="name" />
      </FormDialog>
    );
    expect(html).toBeTruthy();
  });

  it("FormActionBar", () => {
    expect(
      renderSSR(<FormActionBar onCancel={() => {}} onSave={() => {}} />)
    ).toBeTruthy();
  });

  it("PublicPageLayout", () => {
    expect(
      renderSSR(
        <PublicPageLayout>
          <Text>Welcome</Text>
        </PublicPageLayout>
      )
    ).toContain("Welcome");
  });

  it("TextInputField", () => {
    expect(
      renderSSR(<TextInputField label="Name" aria-label="name" />)
    ).toBeTruthy();
  });

  it("NumberInputField", () => {
    expect(
      renderSSR(<NumberInputField label="Age" aria-label="age" />)
    ).toBeTruthy();
  });

  it("PasswordInputField", () => {
    expect(
      renderSSR(<PasswordInputField label="Password" aria-label="password" />)
    ).toBeTruthy();
  });

  it("SearchInputField", () => {
    expect(
      renderSSR(<SearchInputField label="Search" aria-label="search" />)
    ).toBeTruthy();
  });

  it("MultilineTextInputField", () => {
    expect(
      renderSSR(<MultilineTextInputField label="Notes" aria-label="notes" />)
    ).toBeTruthy();
  });

  it("DateRangePickerField", () => {
    expect(
      renderSSR(
        <DateRangePickerField label="Date range" aria-label="date range" />
      )
    ).toBeTruthy();
  });

  it("MoneyInputField", () => {
    expect(
      renderSSR(
        <MoneyInputField
          label="Price"
          aria-label="price"
          currencies={["EUR", "USD"]}
          value={{ amount: "", currencyCode: "EUR" }}
        />
      )
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Rich text
// ---------------------------------------------------------------------------

describe("SSR: rich text", () => {
  it("RichTextInput", () => {
    expect(renderSSR(<RichTextInput aria-label="rich text" />)).toBeTruthy();
  });
});
