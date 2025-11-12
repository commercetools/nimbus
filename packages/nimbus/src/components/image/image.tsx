import {
  Image as ChakraImage,
  type ImageProps as ChakraImageProps,
} from "@chakra-ui/react/image";

export type ImageProps = ChakraImageProps;

/**
 * # Image
 *
 * A component to display images with support for fallback.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/media/image}
 *
 * @supportsStyleProps
 */
export const Image = (props: ImageProps) => {
  return <ChakraImage {...props} />;
};

Image.displayName = "Image";
