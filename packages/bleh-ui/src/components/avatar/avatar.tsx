import { forwardRef } from "react";
import { Image } from "@chakra-ui/react";
import { type AvatarProps } from "./avatar.types";
import { AvatarRoot } from "./avatar.slots.tsx";
import { useObjectRef } from "react-aria";

function getInitials(firstName: string, lastName: string) {
  return (
    firstName.split("")[0].toUpperCase() + lastName.split("")[0].toUpperCase()
  );
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const { firstName, lastName, src, alt, ...rest } = props;

  const objRef = useObjectRef(ref);

  const fullName = `${firstName} ${lastName}`;

  const sharedProps = {
    "aria-label": `${fullName} avatar`,
    ref: objRef,
    ...rest,
  };
  return (
    <AvatarRoot {...sharedProps}>
      {src ? (
        <Image src={src} alt={alt || fullName} />
      ) : (
        getInitials(firstName, lastName)
      )}
    </AvatarRoot>
  );
});

Avatar.displayName = "Avatar";
