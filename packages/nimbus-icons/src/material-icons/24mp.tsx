import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const Svg24Mp = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M7.5 14h1v3H10v-3h1v4.5h1.5v-5c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v5h1.5zm9.5-1.5h-3.5v6H15V17h2c.55 0 1-.45 1-1v-2.5c0-.55-.45-1-1-1m-.5 3H15V14h1.5z" />
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14z" />
    <path d="M11 10H8V9h2c.55 0 1-.45 1-1V6.5c0-.55-.45-1-1-1H6.5V7h3v1h-2c-.55 0-1 .45-1 1v2.5H11zm5 1.5h1.5V10h1V8.5h-1v-3H16v3h-1.5v-3H13V10h3z" />
  </svg>
);
const ForwardRef = forwardRef(Svg24Mp);
export default ForwardRef;
