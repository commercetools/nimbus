import {
  Image as ChakraImage,
  type ImageProps as ChakraImageProps,
} from "@chakra-ui/react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageProps extends ChakraImageProps {}

/**
 * Image
 *
 * Use this component to display an image.
 */
export const Image = (props: ImageProps) => {
  return <ChakraImage {...props} />;
};

Image.displayName = "Image";
