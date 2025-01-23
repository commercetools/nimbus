import { Box } from "@bleh-ui/react";
import React from "react";

interface CubicBezierProps {
  size: string;
  bezier: string;
}

const CubicBezier: React.FC<CubicBezierProps> = ({ bezier, size = "24" }) => {
  const parseBezier = (bezier: string) => {
    const match = bezier.match(/cubic-bezier\(([^)]+)\)/);
    if (match) {
      return match[1].split(",").map(Number);
    }
    return [0, 0, 1, 1];
  };

  const [x1, y1, x2, y2] = parseBezier(bezier);

  return (
    <Box
      height={size}
      width={size}
      border="solid-25"
      borderColor="neutral.6"
      colorPalette="primary"
      color="colorPalette.9"
      asChild
    >
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path
          d={`M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`}
          stroke="currentColor"
          strokeWidth={3}
          fill="transparent"
        />
      </svg>
    </Box>
  );
};

export default CubicBezier;
