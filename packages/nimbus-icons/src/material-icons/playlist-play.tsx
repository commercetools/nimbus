import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgPlaylistPlay = (
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
    <path d="M3 10h11v2H3zm0-4h11v2H3zm0 8h7v2H3zm13-1v8l6-4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgPlaylistPlay);
export default ForwardRef;
