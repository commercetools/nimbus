// filepath: /Volumes/Code/nimbus/apps/docs/scripts/vite-plugins/vite-plugin-fs-api.ts
import fs from "fs/promises";
import path from "path";
import express, { Request, Response } from "express";
import { Plugin } from "vite";
import { findMonorepoRoot } from "../utils/find-monorepo-root"; // Updated import path

interface FileSystemRequestBody {
  repoPath: string;
  content?: string;
}

export function fileSystemApiPlugin(): Plugin {
  let server: express.Express | undefined;

  return {
    name: "vite-plugin-fs-api",

    configureServer(devServer) {
      const app = express();
      app.use(express.json());

      // Helper to resolve file paths within the monorepo
      const resolvePath = async (repoPath: string): Promise<string> => {
        const monorepoRoot = await findMonorepoRoot(process.cwd());
        if (!monorepoRoot) throw new Error("Monorepo root not found");
        const resolvedPath = path.resolve(monorepoRoot, repoPath);
        if (!resolvedPath.startsWith(monorepoRoot)) {
          throw new Error("Access to the file path is restricted");
        }
        return resolvedPath;
      };

      // CRUD API Endpoints
      app.post(
        "/api/fs",
        async (req: Request<{}, {}, FileSystemRequestBody>, res: Response) => {
          try {
            const { repoPath, content } = req.body;
            if (!repoPath) throw new Error("repoPath is required");
            const resolvedPath = await resolvePath(repoPath);
            try {
              await fs.access(resolvedPath);
              throw new Error("File already exists");
            } catch {
              // file does not exist, proceed with creation
              await fs.writeFile(resolvedPath, content || "");
              res
                .status(200)
                .json({ message: "File created", path: resolvedPath });
            }
          } catch (error) {
            res.status(500).json({ error: (error as Error).message });
          }
        }
      );

      app.get("/api/fs", async (req: Request, res: Response) => {
        try {
          const repoPath = req.query.repoPath as string;
          if (!repoPath) throw new Error("repoPath is required");
          const resolvedPath = await resolvePath(repoPath);
          const content = await fs.readFile(resolvedPath, "utf-8");
          res.status(200).json({ content });
        } catch (error) {
          res.status(500).json({ error: (error as Error).message });
        }
      });

      app.put(
        "/api/fs",
        async (req: Request<{}, {}, FileSystemRequestBody>, res: Response) => {
          try {
            const { repoPath, content } = req.body;
            if (!repoPath) throw new Error("repoPath is required");
            const resolvedPath = await resolvePath(repoPath);
            await fs.writeFile(resolvedPath, content || "");
            res
              .status(200)
              .json({ message: "File updated", path: resolvedPath });
          } catch (error) {
            res.status(500).json({ error: (error as Error).message });
          }
        }
      );

      app.delete(
        "/api/fs",
        async (req: Request<{}, {}, FileSystemRequestBody>, res: Response) => {
          try {
            const { repoPath } = req.body;
            if (!repoPath) throw new Error("repoPath is required");
            const resolvedPath = await resolvePath(repoPath);
            await fs.unlink(resolvedPath);
            res
              .status(200)
              .json({ message: "File deleted", path: resolvedPath });
          } catch (error) {
            res.status(500).json({ error: (error as Error).message });
          }
        }
      );

      // Attach the API to the Vite server's middlewares
      devServer.middlewares.use(app);
      server = app;
    },

    closeBundle() {
      if (server) {
        console.log("Shutting down FileSystem API server...");
      }
    },
  };
}
