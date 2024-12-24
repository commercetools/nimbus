import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "http";
import type { NextHandleFunction } from "connect";
import fileUpload, { type FileArray } from "express-fileupload";

export type FileUploadResponse = {
  url: string;
};

/**
 * Creates a Vite plugin that adds image upload functionality to the development server.
 *
 * @returns {Plugin} A Vite plugin with configured image upload middleware.
 */
export function imageUploadMiddleware(): Plugin {
  // Define the directory where uploaded images will be stored
  const uploadDirectory = path.resolve(__dirname, "./../public/s3");

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }

  return {
    name: "vite:image-upload-middleware",
    /**
     * Configures the Vite development server by adding middleware for handling file uploads.
     *
     * @param {import('vite').ViteDevServer} server - The Vite development server instance.
     */
    configureServer(server) {
      // Add middleware to handle file uploads using express-fileupload
      server.middlewares.use(
        fileUpload({
          createParentPath: false,
        }) as NextHandleFunction
      );

      // Add middleware to handle POST requests to '/api/upload'
      server.middlewares.use(
        "/api/upload",
        async (
          req: IncomingMessage & { files?: FileArray },
          res: ServerResponse,
          next: (err?: unknown) => void
        ) => {
          if (req.method === "POST") {
            // Check if any files were uploaded
            const files = req.files as FileArray | undefined;
            if (!files || !files.file) {
              res.statusCode = 400;
              res.end("No files were uploaded.");
              return;
            }

            const file = Array.isArray(files.file) ? files.file[0] : files.file;
            // Get the file extension
            const extension = path.extname(file.name);
            // Create a unique filename using the current timestamp
            const filename = `${Date.now()}${extension}`;
            // Determine the file path for saving the uploaded file
            const filePath = path.join(uploadDirectory, filename);

            // Move the uploaded file to the upload directory
            file.mv(filePath, async (err) => {
              if (err) {
                // Log the error and send a 500 response
                console.error(err);
                res.statusCode = 500;
                res.end("Internal server error.");
                return;
              }

              // Send a success response with the URL of the uploaded file
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              await new Promise((resolve) => setTimeout(resolve, 1000));

              const response: FileUploadResponse = {
                url: `/s3/${filename}`,
              };

              res.end(JSON.stringify(response));
            });
          } else {
            // Pass the request to the next middleware
            next();
          }
        }
      );
    },
  };
}
