import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgKeyboardCapslock = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path d="M12 8.41 16.59 13 18 11.59l-6-6-6 6L7.41 13zM6 18h12v-2H6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgKeyboardCapslock);
export default ForwardRef;
