module.exports = {
  jsx: {
    babelConfig: {
      plugins: [
        // For an example, this plugin will remove "id" attribute from "svg" tag
        [
          "@svgr/babel-plugin-add-jsx-attribute",
          {
            elements: ["svg"],
            attributes: [
              // hide icons from screenreaders by default as they have no
              // global meaning
              {
                name: "aria-hidden",
                value: "true",
              },
              // If no width or height is explicitly specified,
              // an icon will be sized relative to the current text-size
              // so that it looks decent next to text by default
              {
                name: "width",
                value: "1em",
              },
              {
                name: "height",
                value: "1em",
              },
              // If no fill is explicitly specified, an icon will inherit
              // the current text color by default
              {
                name: "fill",
                value: "currentColor",
              },
              // add the viewbox, so that the icons scale correctly
              {
                name: "viewBox",
                value: "0 0 24 24",
              },
            ],
          },
        ],
      ],
    },
  },
  // Enable ref forwarding for all SVG components
  ref: true,
};
