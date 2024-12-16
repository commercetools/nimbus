import { Box } from "@bleh-ui/react";
import { type ImgHTMLAttributes } from "react";

export const Image = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <Box asChild maxWidth="100%">
      <img {...props} />
    </Box>
  );
};

Image.displayName = "Image";
