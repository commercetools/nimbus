import { forwardRef } from "react";
import { Image } from "@chakra-ui/react";
import { type AvatarProps } from "./avatar.types";
import { AvatarRoot } from "./avatar.slots.tsx";
import { useObjectRef } from "react-aria";

function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) {
    return name.slice(0, 2).toUpperCase();
  }
  return parts
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const { name, src, alt, onClick, tabIndex = 0, ...rest } = props;

  const objRef = useObjectRef(ref);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    objRef.current?.focus();
    onClick?.(event);
  };

  if (src) {
    return (
      <AvatarRoot
        role="img"
        ref={objRef}
        onClick={handleClick}
        tabIndex={tabIndex}
        {...rest}
      >
        <Image src={src} alt={alt || name} />
      </AvatarRoot>
    );
  }
  if (name) {
    return (
      <AvatarRoot
        role="img"
        ref={objRef}
        onClick={handleClick}
        tabIndex={tabIndex}
        {...rest}
      >
        {getInitials(name)}
      </AvatarRoot>
    );
  }
});

Avatar.displayName = "Avatar";
