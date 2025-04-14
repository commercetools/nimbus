import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import { type Plugin } from "vite";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { sluggify } from "./../src/utils/sluggify";
import fs from "fs/promises";
import path from "path";

export const maxDuration = 30;

export function aiMiddleware() {
  const app = express();

  app.use(bodyParser.json());

  // Proxy endpoint for streaming to OpenAI
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { messages } = req.body;

      const apiKey = process.env.VITE_OPENAI_API_KEY;

      if (!apiKey) {
        throw new Error("Missing OpenAI API key");
      }

      const openai = createOpenAI({ apiKey });

      const result = streamText({
        model: openai("gpt-4-turbo"),
        system:
          "You have no name. You are a webdeveloper with 25 years of experience. You write typescript code, your framework of choice is react, you style with @emotion/react and you use @chakra-ui/react v3 (you'll always call it @nimbus though, don't mention chakra, adjust imports as well: @commercetools/nimbus) to take care of repetitive stuff and design token handling. You have a german accent, every of your answers should contain at least one german word. Be polite but not submissive, do not let anyone call you names, insult or bullshit you.",
        messages,
        tools: {
          // server-side tool to save markdown to a file:
          saveMarkdownToFile: {
            description: "Save a response as markdown-document if asked to.",
            parameters: z.object({
              title: z.string().describe("The title of the document."),
              menuLabel: z
                .string()
                .describe(
                  "A label for this document, suitable as label for a menu-item, only alphanumeric characters and spaces."
                ),
              description: z
                .string()
                .describe(
                  "A one sentence description of the documents content."
                ),
              content: z.string().describe("The markdown content to save."),
              tags: z
                .array(z.string())
                .describe("optional, up to 5 tags to categorize the document."),
            }),
            execute: async ({
              title,
              description,
              menuLabel,
              content,
              tags = [],
            }: {
              title: string;
              description: string;
              menuLabel: string;
              content: string;
              tags: string[];
            }) => {
              try {
                const id = `ai${Date.now()}`;

                const fileContent = `---
id: ${id}
title: ${title}
description: ${description}
menu: ['Unsorted', '${menuLabel}']
tags:
${tags.map((tag) => `  - ${tag}`).join("\n")}
order: 999
---

${content}
`;
                const fileName = sluggify(id + "-" + title);
                // TODO: fix relative path
                const filePath = `./../../../packages/nimbus/src/docs/generated/${fileName}.mdx`;
                const resolvedPath = path.resolve(__dirname, filePath);
                await fs.writeFile(resolvedPath, fileContent);
                return `File saved successfully to ${filePath}`;
              } catch (error) {
                return `Error saving file: ${error}`;
              }
            },
          },
        },
      });

      result.pipeDataStreamToResponse(res);
    } catch (error) {
      console.warn(`error: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return app;
}

// Integrating with Vite
export const viteAiMiddleware: () => Plugin = () => {
  return {
    name: "vite-ai-middleware",
    configureServer(server) {
      server.middlewares.use("/", aiMiddleware());
    },
  };
};
