import { Stack, Text } from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";
import { useEffect, useState } from "react";

export const AppNavBarTime = () => {
  const [time, setTime] = useState<string>("");
  const [isPM, setIsPM] = useState<boolean>(false);

  useEffect(() => {
    // Set initial time
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      // Remove AM/PM from the formatted time
      const timeWithoutPeriod = formattedTime.slice(0, 5);
      setTime(timeWithoutPeriod);
      setIsPM(hours >= 12);
    };

    updateTime();

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Stack direction="row" gap="200" alignItems="center">
      <Text
        fontSize="400"
        color="fg"
        whiteSpace="nowrap"
        fontVariantNumeric="tabular-nums"
        fontFamily="monospace"
      >
        {time || "00:00"}
      </Text>
      {isPM ? (
        <Icons.DarkMode width="16px" height="16px" />
      ) : (
        <Icons.LightMode width="16px" height="16px" />
      )}
    </Stack>
  );
};
