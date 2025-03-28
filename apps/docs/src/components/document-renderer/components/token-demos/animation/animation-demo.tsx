import { Box } from "@nimbus/react";
import { keyframes } from "@emotion/react";
// ...existing code...

const AnimationDemo = ({
  size = "128px",
  curve = "linear",
  duration,
  emoji,
}: {
  size: string;
  curve?: string;
  duration?: string;
  emoji?: string;
}) => {
  const moveAnimation = keyframes`
  0% { left: -${size}; }
  100% { left: 100%; }
`;

  const animationTiming = duration || "1s";

  const animation = `${moveAnimation} ${animationTiming} ${curve} forwards`;

  return (
    <Box
      border="solid-25"
      borderColor="neutral.6"
      overflow="hidden"
      width="full"
      height={size}
      position="relative"
    >
      <Box
        colorPalette="primary"
        width="400"
        height={size}
        animation={animation}
        position="absolute"
      >
        <Box
          position="absolute"
          top="0"
          fontSize={size}
          width={size}
          height={size}
          lineHeight={size}
        >
          <Box transform="scaleX(-1)">{emoji || "🦥"}</Box>
        </Box>
      </Box>
    </Box>
  );
};

// ...existing code...
export default AnimationDemo;
