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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === "Enter" || event.key === " ") && onClick) {
      if (event.key === " ") {
        event.preventDefault();
      }
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  const sharedProps = {
    role: "img",
    ref: objRef,
    onClick,
    tabIndex,
    onKeyDown: handleKeyDown,
    ...rest,
  };

  if (src) {
    return (
      <AvatarRoot {...sharedProps}>
        <Image src={src} alt={alt || name} />
      </AvatarRoot>
    );
  }
  if (name) {
    return <AvatarRoot {...sharedProps}>{getInitials(name)}</AvatarRoot>;
  }
});

Avatar.displayName = "Avatar";
