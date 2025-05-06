import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSignalCellularNodata = (
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
    <path d="M22 13h-9v9H2L22 2zm-1 2.41L19.59 14l-2.09 2.09L15.41 14 14 15.41l2.09 2.09L14 19.59 15.41 21l2.09-2.08L19.59 21 21 19.59l-2.08-2.09z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSignalCellularNodata);
export default ForwardRef;
