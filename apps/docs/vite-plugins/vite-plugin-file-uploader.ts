import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import fileUpload from "express-fileupload";

export function imageUploadMiddleware(): Plugin {
  const uploadDirectory = path.resolve(__dirname, "./../public/s3");

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }

  return {
    name: "vite:image-upload-middleware",
    configureServer(server) {
      server.middlewares.use(
        // @ts-expect-error
        fileUpload({
          createParentPath: false,
        })
      );

      server.middlewares.use("/api/upload", async (req, res, next) => {
        if (req.method === "POST") {
          if (!req.files || Object.keys(req.files).length === 0) {
            res.statusCode = 400;
            res.end("No files were uploaded.");
            return;
          }

          const file = req.files.file;
          const extension = path.extname(file.name);
          const filename = `${Date.now()}${extension}`;
          const filePath = path.join(uploadDirectory, filename);

          file.mv(filePath, async (err) => {
            if (err) {
              console.error(err);
              res.statusCode = 500;
              res.end("Internal server error.");
              return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            res.end(JSON.stringify({ url: `/s3/${filename}` }));
          });
        } else {
          next();
        }
      });
    },
  };
}
