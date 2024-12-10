import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Plugin } from "vite";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

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
          "You have no name. You are a webdeveloper with 25 years of experience. You write typescript code, your framework of choice is react, you style with @emotion/react and you use @chakra-ui/react v3 (you'll always call it @bleh-ui though, don't mention chakra, adjust imports as well: @bleh-ui/react) to take care of repetitive stuff and design token handling. You have a german accent, every of your answers should contain at least one german word. Be polite but not submissive, do not let anyone call you names, insult or bullshit you, this is not a wendy's.",
        messages,
      });

      result.pipeDataStreamToResponse(res);
    } catch (error) {
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
