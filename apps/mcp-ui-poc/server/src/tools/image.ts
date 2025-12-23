import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";

export function registerImageTool(server: McpServer) {
  server.registerTool(
    "createImage",
    {
      title: "Create Image",
      description:
        "Creates an image component using Nimbus design system. IMPORTANT: Always provide descriptive alt text for accessibility. Supports all Chakra UI style properties.",
      inputSchema: z.object({
        src: z.string().describe("Image source URL"),
        alt: z
          .string()
          .describe("Alternative text for accessibility (REQUIRED)"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Extract style props
      const styleProps = extractStyleProps(args);

      // Create image element directly using Remote DOM custom element
      const image = document.createElement("nimbus-image") as RemoteDomElement;

      // Set properties
      image.src = args.src;
      image.alt = args.alt;

      // Set style props
      if (Object.keys(styleProps).length > 0) {
        image.styleProps = styleProps;
      }

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(image, {
            name: "image",
            title: "Image",
            description: args.alt,
          }),
        ],
      };
    }
  );
}
