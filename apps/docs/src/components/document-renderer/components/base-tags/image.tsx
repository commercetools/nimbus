import { Box } from "@nimbus/react";
import { type ImgHTMLAttributes } from "react";

export const Image = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <Box asChild maxWidth="full">
      <img {...props} />
    </Box>
  );
};

Image.displayName = "Image";
