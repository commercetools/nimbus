import {
  Image as ChakraImage,
  type ImageProps as ChakraImageProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageProps extends ChakraImageProps {}

/**
 * Image
 *
 * Use this component to display an image.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  return <ChakraImage ref={ref} {...props} />;
});

Image.displayName = "Image";
