import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFormatTextdirectionLToR = (
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
    <path d="M9 4v4c-1.1 0-2-.9-2-2s.9-2 2-2m8-2H9C6.79 2 5 3.79 5 6s1.79 4 4 4v5h2V4h2v11h2V4h2zm0 12v3H5v2h12v3l4-4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgFormatTextdirectionLToR);
export default ForwardRef;
