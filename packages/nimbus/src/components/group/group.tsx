import { GroupSlot } from "./group.slots";
import type { GroupComponent } from "./group.types";

export const Group: GroupComponent = (props) => {
  const { ref, children, ...rest } = props;
  return (
    <GroupSlot ref={ref} {...rest}>
      {children}
    </GroupSlot>
  );
};
