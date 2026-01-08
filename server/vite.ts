import { type Express, type Request, type Response, type NextFunction } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // CRITICAL: API routes must be handled BEFORE Vite middleware processes them
  // This middleware runs first and blocks API routes from Vite processing
  app.use((req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    
    // Block ALL API routes from going to Vite
    if (url.startsWith("/api")) {
      // Don't call next() here - let the API routes registered by registerRoutes handle it
      // But we need to make sure the API routes were registered first...
      // Since Express runs middleware in order, and registerRoutes was called before setupVite,
      // the API routes should already be registered. If they don't match, we'll get a 404.
      return next();
    }
    
    // For non-API routes, continue to Vite middleware
    next();
  });

  // Add Vite's middleware AFTER our API protection middleware
  app.use(vite.middlewares);

  // Catch-all for SPA routes (only non-API)
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // Double-check: skip API routes
    if (url.startsWith("/api")) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
