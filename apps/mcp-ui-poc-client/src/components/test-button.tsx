import { Box, Button, Text } from "@commercetools/nimbus";
import { useState } from "react";

export function TestButton() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <Box padding="600">
      <Text marginBottom="400">Button Click Test</Text>
      <Text marginBottom="400">Click count: {clickCount}</Text>

      <Button
        variant="solid"
        colorPalette="primary"
        onPress={() => {
          console.log("✅ Button onPress fired!");
          setClickCount((c) => c + 1);
        }}
      >
        Test Button (onPress)
      </Button>

      <Button
        variant="outline"
        colorPalette="primary"
        marginTop="300"
        onClick={() => {
          console.log("✅ Button onClick fired!");
          setClickCount((c) => c + 1);
        }}
      >
        Test Button (onClick)
      </Button>
    </Box>
  );
}
