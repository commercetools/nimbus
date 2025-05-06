import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDetails = (
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
    <path d="M12 3 2 21h20zm1 5.92L18.6 19H13zm-2 0V19H5.4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDetails);
export default ForwardRef;
