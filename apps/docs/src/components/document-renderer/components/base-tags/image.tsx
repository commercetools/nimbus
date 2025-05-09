import { Image as NimbusImage } from "@commercetools/nimbus";
import { type ImgHTMLAttributes } from "react";

export const Image = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <NimbusImage asChild maxWidth="full">
      <img {...props} />
    </NimbusImage>
  );
};

Image.displayName = "Image";
