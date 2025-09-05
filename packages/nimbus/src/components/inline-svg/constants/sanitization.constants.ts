/**
 * Tags that are forbidden in SVG content for security reasons
 */
export const DEFAULT_FORBIDDEN_TAGS = [
  "script",
  "style",
  "iframe",
  "embed",
  "object",
  "applet",
  "link",
  "base",
  "meta",
] as const;

/**
 * Attributes that are forbidden in SVG content for security reasons
 */
export const DEFAULT_FORBIDDEN_ATTRIBUTES = [
  // Event handlers
  "onabort",
  "onblur",
  "oncancel",
  "oncanplay",
  "oncanplaythrough",
  "onchange",
  "onclick",
  "onclose",
  "oncontextmenu",
  "oncuechange",
  "ondblclick",
  "ondrag",
  "ondragend",
  "ondragenter",
  "ondragleave",
  "ondragover",
  "ondragstart",
  "ondrop",
  "ondurationchange",
  "onemptied",
  "onended",
  "onerror",
  "onfocus",
  "oninput",
  "oninvalid",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onload",
  "onloadeddata",
  "onloadedmetadata",
  "onloadstart",
  "onmousedown",
  "onmouseenter",
  "onmouseleave",
  "onmousemove",
  "onmouseout",
  "onmouseover",
  "onmouseup",
  "onmousewheel",
  "onpause",
  "onplay",
  "onplaying",
  "onprogress",
  "onratechange",
  "onreset",
  "onresize",
  "onscroll",
  "onseeked",
  "onseeking",
  "onselect",
  "onshow",
  "onstalled",
  "onsubmit",
  "onsuspend",
  "ontimeupdate",
  "ontoggle",
  "onvolumechange",
  "onwaiting",
  // Other potentially dangerous attributes
  "style", // Unless explicitly allowed
  "href", // Will be sanitized separately
  "xlink:href", // Will be sanitized separately
] as const;

/**
 * Protocols allowed in URL attributes
 */
export const ALLOWED_PROTOCOLS = ["http:", "https:", "#"] as const;
