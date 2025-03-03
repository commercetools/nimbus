import { type ReactNode, useState } from "react";
import { Flex, Stack, Button, Text } from "@bleh-ui/react";
import { LiveCodeEditor } from "../live-code-editor/live-code-editor";

type CodeExample = {
  title: string;
  code: ReactNode;
  description: ReactNode;
};

type SelectableCodeExamplesProps = {
  examples: CodeExample[];
};

export function SelectableCodeExamples(props: SelectableCodeExamplesProps) {
  const [activeExample, setActiveExample] = useState(props.examples[0]);
  return (
    <Stack mb="1600">
      <Flex gap="100">
        {props.examples.map((example) => (
          <Button
            tone="primary"
            variant="outline"
            onPress={() => setActiveExample(example)}
            name={example.title}
            bg={activeExample.title === example.title ? "primary.4" : undefined}
          >
            {example.title}
          </Button>
        ))}
      </Flex>
      <LiveCodeEditor variant="inline">{activeExample.code}</LiveCodeEditor>
      <Text py="200" px="400" borderRadius="200" bg="primary.4">
        {activeExample.description as string}
      </Text>
    </Stack>
  );
}
