import { forwardRef } from "react";
import { Image } from "@chakra-ui/react";
import { type AvatarProps } from "./avatar.types";
import { AvatarRoot } from "./avatar.slots.tsx";
import { useObjectRef } from "react-aria";

function getInitials(firstName: string, lastName: string) {
  if (!lastName) {
    return firstName.slice(0, 2).toUpperCase();
  }
  return (
    firstName.split("")[0].toUpperCase() + lastName.split("")[0].toUpperCase()
  );
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const {
    firstName,
    lastName,
    src,
    alt,
    tabIndex = 0,
    isDisabled,
    ...rest
  } = props;

  const objRef = useObjectRef(ref);

  const fullName = `${firstName} ${lastName}`;

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  const sharedProps = {
    role: "figure",
    "aria-label": `${fullName} avatar`,
    ref: objRef,
    tabIndex: isDisabled ? -1 : tabIndex,
    "aria-disabled": isDisabled,
    style: {
      pointerEvents: isDisabled ? ("none" as const) : ("auto" as const),
      cursor: isDisabled ? ("not-allowed" as const) : ("pointer" as const),
      opacity: isDisabled ? 0.5 : undefined,
    },
    ...rest,
  };
  if (src && isValidUrl(src)) {
    return (
      <AvatarRoot {...sharedProps}>
        <Image src={src} alt={alt || fullName} />
      </AvatarRoot>
    );
  }
  return (
    <AvatarRoot {...sharedProps}>{getInitials(firstName, lastName)}</AvatarRoot>
  );
});

Avatar.displayName = "Avatar";
