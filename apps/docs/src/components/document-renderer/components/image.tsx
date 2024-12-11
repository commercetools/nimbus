import { Box } from "@bleh-ui/react";

export const Image = (props) => {
  return (
    <Box asChild maxWidth="100%">
      <img {...props} />
    </Box>
  );
};

Image.displayName = "ImageComponent";
