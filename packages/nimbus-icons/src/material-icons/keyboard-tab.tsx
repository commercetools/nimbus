import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgKeyboardTab = (
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
    <path d="M11.59 7.41 15.17 11H1v2h14.17l-3.59 3.59L13 18l6-6-6-6zM20 6v12h2V6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgKeyboardTab);
export default ForwardRef;
