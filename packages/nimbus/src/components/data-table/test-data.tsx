import React from "react";
import {
  Stack,
  IconButton,
  Button,
  Heading,
  Text,
  Select,
  Box,
  RadioInput,
  Badge,
} from "@/components";
import { Info } from "@commercetools/nimbus-icons";
import { DataTable } from "./data-table";

import type { DataTableColumnItem, DataTableRowItem } from "./data-table.types";

// Sample data and columns
export const columns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name with a long header",
    accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
  },
  {
    id: "age",
    header: "Age",
    accessor: (row: Record<string, unknown>) => row.age as React.ReactNode,
  },
  {
    id: "role",
    header: "Role",
    accessor: (row: Record<string, unknown>) => row.role as React.ReactNode,
  },
  {
    id: "custom",
    header: "Custom",
    accessor: (row: Record<string, unknown>) => row.class as React.ReactNode,
    render: ({ value }) => (
      <Text as="span" color="neutral.11">
        {value as string}
      </Text>
    ),
  },
];

// Sortable columns - same as above but with explicit sortable configuration
export const sortableColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row) => row.name as React.ReactNode,
    isSortable: true,
    isResizable: true,
    headerIcon: (
      <IconButton
        aria-label="Custom Column Information"
        size="2xs"
        colorPalette="primary"
        variant="ghost"
        onPress={() => {
          alert(
            "Check how the `headerIcon` property was used to display this info button."
          );
        }}
      >
        <Info />
      </IconButton>
    ),
  },
  {
    id: "age",
    header: "Age",
    accessor: (row) => row.age as React.ReactNode,
    isSortable: true,
    isResizable: true,
  },
  {
    id: "role",
    header: "Role",
    accessor: (row) => row.role as React.ReactNode,
    isSortable: true,
    isResizable: true,
  },
  {
    id: "custom",
    header: "Custom (Not Sortable)",
    accessor: (row) => row.class as React.ReactNode,
    render: ({ value }) => (
      <Text as="span" color="neutral.11">
        {value as string}
      </Text>
    ),
    isSortable: false, // This column is not sortable
  },
];

export const data: DataTableRowItem[] = [
  { id: "1", name: "Alice", age: 30, role: "Admin", class: "special" },
  { id: "2", name: "Bob", age: 25, role: "User", class: "rare" },
  { id: "3", name: "Carol", age: 28, role: "User", class: "common" },
  { id: "4", name: "David", age: 32, role: "Manager", class: "premium" },
  { id: "5", name: "Emma", age: 27, role: "Developer", class: "special" },
  { id: "6", name: "Frank", age: 29, role: "Designer", class: "rare" },
  { id: "7", name: "Grace", age: 31, role: "Analyst", class: "common" },
  { id: "8", name: "Henry", age: 26, role: "Developer", class: "special" },
  { id: "9", name: "Ivy", age: 33, role: "Manager", class: "premium" },
  { id: "10", name: "Jack", age: 24, role: "Intern", class: "junior" },
];

// Sample data with longer text for truncation demonstration
export const longTextData: DataTableRowItem[] = [
  {
    id: "1",
    name: "Alice Johnson",
    age: 30,
    role: "Senior Software Engineer",
    class:
      "This is a very long description that should be truncated when the truncation feature is enabled. It contains multiple words and should demonstrate how the truncation works with ellipsis and hover to show full content.",
    email: "alice.johnson@company.com",
  },
  {
    id: "2",
    name: "Bob Smith",
    age: 25,
    role: "Frontend Developer",
    class:
      "Another lengthy description that will showcase the truncation functionality. This text is intentionally long to demonstrate how the component handles overflow text with truncation enabled.",
    email: "bob.smith@company.com",
  },
  {
    id: "3",
    name: "Carol Williams",
    age: 28,
    role: "UX Designer",
    class:
      "A comprehensive description that exceeds the normal cell width and needs truncation. When truncated, users can hover to see the full content in a tooltip-like display.",
    email: "carol.williams@company.com",
  },
  {
    id: "4",
    name: "David Brown",
    age: 32,
    role: "Product Manager",
    class:
      "Extended text content that demonstrates the importance of truncation in data tables where space is limited but full content access is still needed via hover interaction.",
    email: "david.brown@company.com",
  },
];

// Columns for truncation demo with longer content
export const truncationColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row) => row.name as React.ReactNode,
  },
  { id: "age", header: "Age", accessor: (row) => row.age as React.ReactNode },
  {
    id: "role",
    header: "Role",
    accessor: (row) => row.role as React.ReactNode,
  },
  {
    id: "email",
    header: "Email",
    accessor: (row) => row.email as React.ReactNode,
  },
  {
    id: "description",
    header: "Description",
    accessor: (row) => row.class as React.ReactNode,
  },
];

// Enhanced data with nested rows for comprehensive demo
export const comprehensiveData: DataTableRowItem[] = [
  {
    id: "1",
    name: "Alice Johnson",
    age: 30,
    role: "Senior Software Engineer",
    class:
      "This is a very long description that should be truncated when the truncation feature is enabled. It contains multiple words and should demonstrate how the truncation works with ellipsis and hover to show full content.",
    email: "alice.johnson@company.com",
    department: "Engineering",
    status: "Active",
    children: [
      {
        id: "1-1",
        name: "Project Alpha",
        age: 2,
        role: "Frontend Project",
        class: "React-based dashboard application",
        email: "project.alpha@company.com",
        department: "Engineering",
        status: "In Progress",
      },
      {
        id: "1-2",
        name: "Project Beta",
        age: 1,
        role: "Backend Project",
        class: "Node.js API service",
        email: "project.beta@company.com",
        department: "Engineering",
        status: "Planning",
      },
    ],
  },
  {
    id: "2",
    name: "Bob Smith",
    age: 25,
    role: "Frontend Developer",
    class:
      "Another lengthy description that will showcase the truncation functionality. This text is intentionally long to demonstrate how the component handles overflow text with truncation enabled.",
    email: "bob.smith@company.com",
    department: "Engineering",
    status: "Active",
  },
  {
    id: "3",
    name: "Carol Williams",
    age: 28,
    role: "UX Designer",
    class:
      "A comprehensive description that exceeds the normal cell width and needs truncation. When truncated, users can hover to see the full content in a tooltip-like display.",
    email: "carol.williams@company.com",
    department: "Design",
    status: "Active",
    children: [
      {
        id: "3-1",
        name: "Design System",
        age: 3,
        role: "Component Library",
        class: "Comprehensive design system with tokens",
        email: "design.system@company.com",
        department: "Design",
        status: "Active",
      },
    ],
  },
  {
    id: "4",
    name: "David Brown",
    age: 32,
    role: "Product Manager",
    class:
      "Extended text content that demonstrates the importance of truncation in data tables where space is limited but full content access is still needed via hover interaction.",
    email: "david.brown@company.com",
    department: "Product",
    status: "Active",
  },
  {
    id: "5",
    name: "Emma Davis",
    age: 27,
    role: "DevOps Engineer",
    class: "Infrastructure and deployment specialist",
    email: "emma.davis@company.com",
    department: "Engineering",
    status: "On Leave",
  },
  {
    id: "6",
    name: "Frank Wilson",
    age: 35,
    role: "Senior Designer",
    class: "Creative director for visual design",
    email: "frank.wilson@company.com",
    department: "Design",
    status: "Active",
  },
];

// Comprehensive columns with all features
export const comprehensiveColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row) => row.name as React.ReactNode,
    isSortable: true,
  },
  {
    id: "age",
    header: "Age",
    accessor: (row) => row.age as React.ReactNode,
    isSortable: true,
  },
  {
    id: "role",
    header: "Role",
    accessor: (row) => row.role as React.ReactNode,
    isSortable: true,
  },
  {
    id: "email",
    header: "Email",
    accessor: (row) => row.email as React.ReactNode,
    isSortable: true,
  },
  {
    id: "department",
    header: "Department",
    accessor: (row) => row.department as React.ReactNode,
    isSortable: true,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status as React.ReactNode,
    isSortable: true,
    render: ({ value }) => {
      const colorPalette =
        value === "Active"
          ? "info"
          : value === "In Progress"
            ? "warning"
            : value === "Planning"
              ? "positive"
              : "neutral";

      return (
        <Badge colorPalette={colorPalette} size="xs">
          {value as React.ReactNode}
        </Badge>
      );
    },
  },
  {
    id: "description",
    header: "Description",
    accessor: (row) => row.class as React.ReactNode,
    isSortable: false,
  },
];

// Data with flexible nested children - mix of table rows and React content
export const flexibleNestedData: DataTableRowItem[] = [
  {
    id: "user-1",
    name: "Alice Johnson",
    age: 30,
    role: "Team Lead",
    class: "senior",
    // Traditional nested table rows
    children: [
      {
        id: "user-1-project-1",
        name: "Project Alpha",
        age: 6,
        role: "Web App",
        class: "active",
      },
      {
        id: "user-1-project-2",
        name: "Project Beta",
        age: 3,
        role: "Mobile App",
        class: "planning",
      },
    ],
  },
  {
    id: "user-2",
    name: "Bob Smith",
    age: 28,
    role: "Developer",
    class: "mid-level",
    // React content as children - a detailed profile card
    children: (
      <Box
        p="500"
        bg="neutral.2"
        borderRadius="md"
        border="1px solid"
        borderColor="neutral.6"
        m="200 0"
      >
        <Stack direction="row" gap="400" mb="300">
          <Box
            w="1200"
            h="1200"
            bg="blue.9"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
          >
            BS
          </Box>
          <Box>
            <Heading size="sm" mb="100" color="neutral.12">
              Bob Smith - Developer Profile
            </Heading>
            <Text m="0" color="neutral.11" fontSize="350">
              Specializes in React, TypeScript, and Node.js development
            </Text>
          </Box>
        </Stack>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap="300"
        >
          <Box>
            <Text fontWeight="bold" color="neutral.12">
              Skills:
            </Text>
            <Stack direction="row" mt="100" flexWrap="wrap" gap="100">
              {["React", "TypeScript", "Node.js", "GraphQL"].map((skill) => (
                <Box
                  key={skill}
                  px="200"
                  py="50"
                  bg="blue.3"
                  color="blue.11"
                  borderRadius="md"
                  fontSize="300"
                >
                  {skill}
                </Box>
              ))}
            </Stack>
          </Box>
          <Box>
            <Text fontWeight="bold" color="neutral.12">
              Contact:
            </Text>
            <Text mt="100" fontSize="350" color="neutral.11">
              📧 bob.smith@company.com
              <br />
              📱 +1 (555) 123-4567
            </Text>
          </Box>
        </Box>
      </Box>
    ),
  },
  {
    id: "user-3",
    name: "Carol Williams",
    age: 35,
    role: "Designer",
    class: "senior",
    // Interactive form as children
    children: (
      <Box
        p="500"
        bg="white"
        border="1px solid"
        borderColor="neutral.6"
        borderRadius="md"
        m="200 0"
      >
        <Heading size="sm" mb="400" color="neutral.12">
          Update Designer Settings
        </Heading>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
          gap="400"
        >
          <Box>
            <Text display="block" mb="100" fontWeight="500" color="neutral.12">
              Design Tool Preference:
            </Text>
            <Select.Root
              aria-label="Design Tool Preference"
              defaultSelectedKey="figma"
            >
              <Select.Options>
                <Select.Option id="figma">Figma</Select.Option>
                <Select.Option id="sketch">Sketch</Select.Option>
                <Select.Option id="adobexd">Adobe XD</Select.Option>
              </Select.Options>
            </Select.Root>
          </Box>
          <Box>
            <Text display="block" mb="100" fontWeight="500" color="neutral.12">
              Availability:
            </Text>
            <RadioInput.Root
              orientation="horizontal"
              name="availability"
              defaultValue="full-time"
            >
              <RadioInput.Option value="full-time">Full-time</RadioInput.Option>
              <RadioInput.Option value="part-time">Part-time</RadioInput.Option>
            </RadioInput.Root>
          </Box>
        </Box>
        <Stack direction="row" mt="400" gap="200">
          <Button
            px="400"
            py="200"
            bg="blue.9"
            color="white"
            borderRadius="md"
            fontSize="350"
          >
            Save Changes
          </Button>
          <Button
            px="400"
            py="200"
            bg="transparent"
            color="neutral.11"
            border="1px solid"
            borderColor="neutral.7"
            borderRadius="md"
            fontSize="350"
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    ),
  },
  {
    id: "user-4",
    name: "David Chen",
    age: 29,
    role: "Data Analyst",
    class: "mid-level",
    // Chart/visualization as children
    children: (
      <Box
        p="500"
        bg="neutral.2"
        border="1px solid"
        borderColor="neutral.6"
        borderRadius="md"
        m="200 0"
      >
        <Heading size="sm" mb="400" color="neutral.12">
          Data Analytics Dashboard
        </Heading>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap="400"
        >
          <Box
            p="400"
            bg="white"
            borderRadius="md"
            border="1px solid"
            borderColor="neutral.6"
            textAlign="center"
          >
            <Text fontSize="600" fontWeight="bold" color="green.11">
              847
            </Text>
            <Text fontSize="300" color="neutral.11" mt="100">
              Reports Generated
            </Text>
          </Box>
          <Box
            p="400"
            bg="white"
            borderRadius="md"
            border="1px solid"
            borderColor="neutral.6"
            textAlign="center"
          >
            <Text fontSize="600" fontWeight="bold" color="red.11">
              23
            </Text>
            <Text fontSize="300" color="neutral.11" mt="100">
              Data Issues Found
            </Text>
          </Box>
          <Box
            p="400"
            bg="white"
            borderRadius="md"
            border="1px solid"
            borderColor="neutral.6"
            textAlign="center"
          >
            <Text fontSize="600" fontWeight="bold" color="blue.11">
              156
            </Text>
            <Text fontSize="300" color="neutral.11" mt="100">
              Active Datasets
            </Text>
          </Box>
        </Box>
        <Box mt="400">
          <Text fontSize="350" fontWeight="500" mb="200" color="neutral.11">
            Recent Activity:
          </Text>
          <Text fontSize="300" color="neutral.11" lineHeight="1.5">
            • Completed quarterly sales analysis
            <br />
            • Updated customer segmentation model
            <br />
            • Fixed data pipeline for user metrics
            <br />• Created executive dashboard for Q4 review
          </Text>
        </Box>
      </Box>
    ),
  },
  {
    id: "user-5",
    name: "Emma Rodriguez",
    age: 26,
    role: "QA Engineer",
    class: "junior",
    // Simple text content
    children: (
      <Box
        p="400"
        bg="orange.2"
        border="1px solid"
        borderColor="orange.6"
        borderRadius="md"
        m="200 0"
      >
        <Text m="0" color="orange.11" fontSize="350">
          🧪{" "}
          <Text as="span" fontWeight="bold">
            Testing Focus:
          </Text>{" "}
          Currently working on automated testing for the new checkout flow.
          Planning to implement end-to-end tests using Playwright and enhance
          unit test coverage for payment components.
        </Text>
      </Box>
    ),
  },
];

// Data demonstrating flexible nestedKey usage
export const fetchData = [
  {
    id: "galaxy-1",
    name: "Milky Way",
    type: "Spiral Galaxy",
    distance: "0 ly",
    // Using "sky" as the nested key
    sky: [
      {
        id: "star-1",
        species: "Alpha Centauri",
        genus: "Star System",
        distance: "4.37 ly",
        area: 12.5,
      },
      {
        id: "star-2",
        species: "Proxima Centauri",
        genus: "Red Dwarf",
        distance: "4.24 ly",
        area: 240,
      },
      {
        id: "star-3",
        species: "Barnard's Star",
        genus: "Red Dwarf",
        distance: "5.96 ly",
        area: 17.5,
      },
    ],
  },
  {
    id: "galaxy-2",
    name: "Andromeda",
    type: "Spiral Galaxy",
    distance: "2.537M ly",
    // Using "sky" as the nested key with React content
    sky: [
      {
        id: "star-1",
        species: "Alpha Centauri",
        genus: "Star System",
        distance: "4.37 ly",
        area: 20.45,
      },
      {
        id: "star-2",
        species: "Proxima Centauri",
        genus: "Red Dwarf",
        distance: "4.24 ly",
        area: 400.05,
      },
      {
        id: "star-3",
        species: "Barnard's Star",
        genus: "Red Dwarf",
        distance: "5.96 ly",
        area: 102.0,
      },
    ],
  },
  {
    id: "sunny-2",
    name: "Abrakadabra",
    type: "Spiral Galaxy 2",
    distance: "20.537M ly",
  },
];

// Define columns for the nested table
export const nestedTableColumns: DataTableColumnItem<
  Record<string, unknown>
>[] = [
  {
    id: "species",
    header: "Species",
    accessor: (row: Record<string, unknown>) => row.species as React.ReactNode,
  },
  {
    id: "genus",
    header: "Genus",
    accessor: (row: Record<string, unknown>) => row.genus as React.ReactNode,
  },
  {
    id: "distance",
    header: "Distance",
    accessor: (row: Record<string, unknown>) => row.distance as React.ReactNode,
  },
  {
    id: "area",
    header: "Area",
    accessor: (row: Record<string, unknown>) => row.area as React.ReactNode,
  },
];

// Create nested table data with proper React components
export const modifiedFetchedData = fetchData.map((item) => ({
  ...item,
  sky: item.sky && (
    <Box p="400">
      <Heading size="sm" mb="300" color="neutral.12">
        {item.name} Details
      </Heading>
      <DataTable
        columns={nestedTableColumns}
        data={item.sky}
        allowsSorting={true}
        isResizable={true}
        onDetailsClick={() => {}}
        // No nestedKey needed for this inner table since sky data doesn't have further nesting
      />
    </Box>
  ),
}));

// Data arrays from individual stories

// From MultilineHeaders story
export const multilineHeadersColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Employee Full Name",
    accessor: (row) => row.name as React.ReactNode,
    isSortable: true,
    isResizable: true,
    defaultWidth: 140,
  },
  {
    id: "role",
    header: "Current Position and Primary Responsibilities within Organization",
    accessor: (row) => row.role as React.ReactNode,
    isSortable: true,
    isResizable: true,
    defaultWidth: 180,
  },
  {
    id: "department",
    header: "Department or Business Unit Assignment",
    accessor: (row) => (row.department || "Engineering") as React.ReactNode,
    isSortable: true,
    isResizable: true,
    defaultWidth: 160,
  },
];

export const multilineHeadersData: DataTableRowItem[] = [
  {
    id: "1",
    name: "Alice Johnson",
    role: "Senior Software Engineer",
    department: "Engineering",
  },
  {
    id: "2",
    name: "Bob Smith",
    role: "Frontend Developer",
    department: "Engineering",
  },
  {
    id: "3",
    name: "Carol Williams",
    role: "UX Designer",
    department: "Design",
  },
];

// From HorizontalScrolling story
export const manyColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Full Name",
    accessor: (row) => row.name as React.ReactNode,
    minWidth: 150,
  },
  {
    id: "age",
    header: "Age",
    accessor: (row) => row.age as React.ReactNode,
    minWidth: 80,
  },
  {
    id: "role",
    header: "Role/Position",
    accessor: (row) => row.role as React.ReactNode,
    minWidth: 120,
  },
  {
    id: "email",
    header: "Email Address",
    accessor: (row) => (row.email || "user@example.com") as React.ReactNode,
    minWidth: 200,
  },
  {
    id: "department",
    header: "Department",
    accessor: (row) => (row.department || "Engineering") as React.ReactNode,
    minWidth: 150,
  },
  {
    id: "location",
    header: "Office Location",
    accessor: (row) => (row.location || "San Francisco, CA") as React.ReactNode,
    minWidth: 180,
  },
  {
    id: "phone",
    header: "Phone Number",
    accessor: (row) => (row.phone || "+1 (555) 123-4567") as React.ReactNode,
    minWidth: 150,
  },
  {
    id: "salary",
    header: "Annual Salary",
    accessor: (row) => (row.salary || "$95,000") as React.ReactNode,
    minWidth: 120,
  },
  {
    id: "startDate",
    header: "Start Date",
    accessor: (row) => (row.startDate || "2023-01-15") as React.ReactNode,
    minWidth: 120,
  },
  {
    id: "manager",
    header: "Reporting Manager",
    accessor: (row) => (row.manager || "John Smith") as React.ReactNode,
    minWidth: 150,
  },
  {
    id: "projects",
    header: "Active Projects",
    accessor: (row) =>
      (row.projects || "Project Alpha, Beta") as React.ReactNode,
    minWidth: 200,
  },
  {
    id: "skills",
    header: "Technical Skills",
    accessor: (row) =>
      (row.skills || "React, TypeScript, Node.js") as React.ReactNode,
    minWidth: 250,
  },
];

export const wideData: DataTableRowItem[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: `${i + 1}`,
    name: `Employee Name ${i + 1}`,
    age: 25 + (i % 15),
    role: `Senior ${["Developer", "Designer", "Manager", "Analyst"][i % 4]}`,
    email: `employee${i + 1}@company.com`,
    department: ["Engineering", "Design", "Marketing", "Sales"][i % 4],
    location: [
      "San Francisco, CA",
      "New York, NY",
      "London, UK",
      "Berlin, Germany",
    ][i % 4],
    phone: `+1 (555) ${String(123 + i).padStart(3, "0")}-${String(4567 + i).padStart(4, "0")}`,
    salary: `$${(80000 + i * 5000).toLocaleString()}`,
    startDate: `202${2 + (i % 2)}-${String((i % 12) + 1).padStart(2, "0")}-15`,
    manager: ["Alice Johnson", "Bob Smith", "Carol Williams", "David Brown"][
      i % 4
    ],
    projects: [
      `Project ${String.fromCharCode(65 + (i % 3))}`,
      `Initiative ${String.fromCharCode(88 + (i % 3))}`,
    ].join(", "),
    skills: [
      "React, TypeScript, Node.js",
      "Figma, Sketch, Adobe Creative Suite",
      "Python, Django, PostgreSQL",
      "Salesforce, HubSpot, Analytics",
    ][i % 4],
  })
);

// From AllFeatures story
export const nestedComprehensiveTableColumns: DataTableColumnItem[] = [
  {
    id: "id",
    header: "id",
    accessor: (row: Record<string, unknown>) => row.id as React.ReactNode,
  },
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
  },
  {
    id: "age",
    header: "Age",
    accessor: (row: Record<string, unknown>) => row.age as React.ReactNode,
  },
  {
    id: "role",
    header: "Role",
    accessor: (row: Record<string, unknown>) => row.role as React.ReactNode,
  },
  {
    id: "class",
    header: "Class",
    accessor: (row: Record<string, unknown>) => row.class as React.ReactNode,
  },
  {
    id: "email",
    header: "Email",
    accessor: (row: Record<string, unknown>) => row.email as React.ReactNode,
  },
  {
    id: "department",
    header: "Department",
    accessor: (row: Record<string, unknown>) =>
      row.department as React.ReactNode,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row: Record<string, unknown>) => row.status as React.ReactNode,
  },
];
