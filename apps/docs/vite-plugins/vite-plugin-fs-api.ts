import fs from "fs/promises";
import path from "path";
import express, { Request, Response } from "express";
import { Plugin } from "vite";

interface FileSystemRequestBody {
  filePath: string;
  content?: string;
}

function fileSystemApiPlugin(): Plugin {
  let server: express.Express | undefined;

  return {
    name: "vite-plugin-fs-api",

    configureServer(devServer) {
      const app = express();
      app.use(express.json());

      // Helper to resolve file paths
      const resolvePath = (filePath: string): string => {
        return path.resolve(process.cwd(), filePath);
      };

      // CRUD API Endpoints
      app.post(
        "/api/fs/create",
        async (req: Request<{}, {}, FileSystemRequestBody>, res: Response) => {
          try {
            const { filePath, content } = req.body;
            if (!filePath) throw new Error("filePath is required");
            const resolvedPath = resolvePath(filePath);
            await fs.writeFile(resolvedPath, content || "");
            res
              .status(200)
              .json({ message: "File created", path: resolvedPath });
          } catch (error) {
            res.status(500).json({ error: (error as Error).message });
          }
        }
      );

      app.get("/api/fs/read", async (req: Request, res: Response) => {
        try {
          const filePath = req.query.filePath as string;
          if (!filePath) throw new Error("filePath is required");
          const resolvedPath = resolvePath(filePath);
          const content = await fs.readFile(resolvedPath, "utf-8");
          res.status(200).json({ content });
        } catch (error) {
          res.status(500).json({ error: (error as Error).message });
        }
      });

      app.put(
        "/api/fs/update",
        async (req: Request<{}, {}, FileSystemRequestBody>, res: Response) => {
          try {
            const { filePath, content } = req.body;
            if (!filePath) throw new Error("filePath is required");
            const resolvedPath = resolvePath(filePath);
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
        "/api/fs/delete",
        async (req: Request<{}, {}, FileSystemRequestBody>, res: Response) => {
          try {
            const { filePath } = req.body;
            if (!filePath) throw new Error("filePath is required");
            const resolvedPath = resolvePath(filePath);
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

export default fileSystemApiPlugin;
