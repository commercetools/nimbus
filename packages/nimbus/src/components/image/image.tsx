import {
  Image as ChakraImage,
  type ImageProps as ChakraImageProps,
} from "@chakra-ui/react/image";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageProps extends ChakraImageProps {}

/**
 * # Image
 *
 * A component to display images with support for fallback.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/media/image}
 */
export const Image = (props: ImageProps) => {
  return <ChakraImage {...props} />;
};

Image.displayName = "Image";
