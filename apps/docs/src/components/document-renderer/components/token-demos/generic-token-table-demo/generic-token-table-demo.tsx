import {
  Box,
  Code,
  system,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
} from "@bleh-ui/react";
import { JSONTree } from "react-json-tree";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { preferPxAtom } from "@/atoms/prefer-px-atom";

type GenericTableDemoProps = {
  /** the name of the token-category */
  category: string;
  /** demoProperty */
  demoProperty?: DemoComponentId;
  /** displays a JSON-tree to debug */
  debug?: boolean;
};

const defaultBoxSize = "1600";
const defaultDemoText =
  "Franz jagt im komplett verwahrlosten Taxi quer durch Bayern";
const defaultDemoParagraph =
  "Chupa chups cheesecake soufflé donut bear claw. Toffee sesame snaps candy canes marzipan cotton candy cheesecake cake cake. Fruitcake liquorice candy bear claw sesame snaps marzipan jelly beans.";
const demoComponents = {
  aspectRatio: ({ ...props }) => (
    <Box
      bg="neutral.4"
      aspectRatio="1"
      height={defaultBoxSize}
      p="400"
      {...props}
    />
  ),
  border: ({ ...props }) => (
    <Box
      border="solid-25"
      borderColor="neutral.6"
      aspectRatio="1"
      height={defaultBoxSize}
      p="400"
      {...props}
    />
  ),

  borderRadius: ({ ...props }) => (
    <Box
      bg="neutral.4"
      aspectRatio="1"
      height={defaultBoxSize}
      p="400"
      {...props}
    />
  ),
  boxShadow: ({ ...props }) => (
    <Box
      bg="white"
      aspectRatio="1"
      height={defaultBoxSize}
      p="400"
      {...props}
    />
  ),
  cursor: ({ ...props }) => (
    <Box
      display="flex"
      aspectRatio="golden"
      bg="neutral.4"
      borderColor="neutral.6"
      height={defaultBoxSize}
      p="400"
      {...props}
    >
      <Text m="auto">Hover me</Text>
    </Box>
  ),
  blur: ({ ...props }) => (
    <Box
      bg="neutral.4"
      aspectRatio="1"
      height={defaultBoxSize}
      p="400"
      filter="auto"
      {...props}
    />
  ),
  fontFamily: ({ ...props }) => (
    <Text fontSize="4rem" lineHeight="1" {...props}>
      Ag
    </Text>
  ),

  fontSize: ({ ...props }) => (
    <Text {...props} lineHeight="1">
      Ag
    </Text>
  ),
  fontWeight: ({ ...props }) => (
    <Text {...props} lineHeight="1">
      {defaultDemoText}
    </Text>
  ),
  lineHeight: ({ ...props }) => (
    <Text color="colorPalette.11" lineClamp="4" {...props}>
      {new Array(2)
        .fill("")
        .map(() => defaultDemoParagraph)
        .join(". ")}
    </Text>
  ),
  letterSpacing: ({ ...props }) => (
    <Text {...props} truncate>
      {defaultDemoText}
    </Text>
  ),
  animation: ({ ...props }) => (
    <Box width="1200" height="1200" bg="primary.4" {...props} />
  ),
};

type DemoComponentId = keyof typeof demoComponents;

const PrettyBox = ({ ...props }) => (
  <Box
    bg="tomato.4"
    aspectRatio="square"
    height={defaultBoxSize}
    p="400"
    {...props}
  />
);

export const GenericTokenTableDemo = ({
  debug,
  demoProperty,
  ...props
}: GenericTableDemoProps) => {
  const [showPx] = useAtom(preferPxAtom);
  const data = useMemo(() => {
    const data = system.tokens.categoryMap.get(props.category);

    if (!data) return [];

    return Array.from(data, ([name, value]) => ({
      name,
      value,
    }));
  }, [props.category]);

  if (!data) return null;

  const DemoComponent =
    (demoProperty && demoComponents[demoProperty]) || PrettyBox;

  const formatterFn = (val: string) => {
    switch (true) {
      case typeof val !== "string":
        return val;
      case val.includes("rem"):
        return showPx ? `${parseFloat(val) * 16}px` : `${val}`;
      case val.includes("px"):
        return !showPx ? `${parseFloat(val) / 16}rem` : `${val}`;
      default:
        return val;
    }
  };

  return (
    <div>
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableColumnHeader width="16ch">Token-Name</TableColumnHeader>
            <TableColumnHeader width="24ch">Value</TableColumnHeader>
            {demoProperty && <TableColumnHeader>Demo</TableColumnHeader>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.name}>
                <TableCell>
                  <Code variant="subtle" size="md">
                    {item.name}
                  </Code>
                </TableCell>
                <TableCell>
                  <Box maxW="20ch">
                    <Text truncate>{formatterFn(item.value.value)}</Text>
                  </Box>
                </TableCell>
                {demoProperty && (
                  <TableCell>
                    <DemoComponent {...{ [demoProperty]: item.name }} />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </TableRoot>
      {debug && <JSONTree data={system.tokens.categoryMap} />}
    </div>
  );
};
