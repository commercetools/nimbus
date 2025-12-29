import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";
import { validateImageUrl, validateRequiredText } from "../utils/security.js";

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
      // Validate and sanitize inputs
      const validatedSrc = validateImageUrl(args.src, "src");
      const sanitizedAlt = validateRequiredText(args.alt, "alt");

      // Extract style props
      const styleProps = extractStyleProps(args);

      // Create image element directly using Remote DOM custom element
      const image = document.createElement("nimbus-image") as RemoteDomElement;

      // Set properties with validated/sanitized values
      image.src = validatedSrc;
      image.alt = sanitizedAlt;

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
