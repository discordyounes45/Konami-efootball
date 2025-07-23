import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import path from "path";
import { fileURLToPath } from "url";

// __dirname is not available in ES modules, so we have to do this trick
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });
  app.get("/api/demo", handleDemo);

  // Serve static files from the 'dist/spa' directory
  const spaPath = path.resolve(__dirname, "..", "spa");
  app.use(express.static(spaPath));

  // Handle all other routes by serving the index.html
  app.get("*", (req, res) => {
    // Don't serve files from the static folder as index.html
    if (req.path.includes(".")) {
      res.status(404).send("Not found");
      return;
    }
    res.sendFile(path.join(spaPath, "index.html"));
  });

  return app;
}
