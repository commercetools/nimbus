import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgChangeHistory = (
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
    <path d="M12 7.77 18.39 18H5.61zM12 4 2 20h20z" />
  </svg>
);
const ForwardRef = forwardRef(SvgChangeHistory);
export default ForwardRef;
