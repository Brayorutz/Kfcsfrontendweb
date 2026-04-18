import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes-persistence-fixed.ts";
import { serveStatic } from "./static.ts";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const _serverDir = path.dirname(fileURLToPath(import.meta.url));
const _isProd = process.env.NODE_ENV === "production";
// In dev: _serverDir = <project>/server/ → attached_assets is one level up
// In prod: _serverDir = <project>/dist/  → attached_assets is copied here during build
const ATTACHED_ASSETS_DIR = _isProd
  ? path.resolve(_serverDir, "attached_assets")
  : path.resolve(_serverDir, "..", "attached_assets");

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

const MStore = MemoryStore(session);
app.use(session({
  secret: process.env.SESSION_SECRET || "kfcs-directors-portal-secret",
  resave: false,
  saveUninitialized: false,
  store: new MStore({ checkPeriod: 86400000 }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

app.use("/attached_assets", express.static(ATTACHED_ASSETS_DIR));
// Removed public static for /director-files - now auth-protected only


export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite.ts");
    await setupVite(httpServer, app);
  }

  let port = parseInt(process.env.PORT || "5000", 10);
  
  const startServer = async (startPort: number) => {
    let currentPort = startPort;
    while (currentPort < startPort + 100) {
      try {
        await new Promise<void>((resolve, reject) => {
          const onError = (err: any) => {
            if (err.code === 'EADDRINUSE') {
              httpServer.removeListener('error', onError);
              reject(err);
            } else {
              reject(err);
            }
          };

          httpServer.once('error', onError);
          httpServer.listen({ port: currentPort, host: "0.0.0.0" }, () => {
            httpServer.removeListener('error', onError);
            resolve();
          });
        });
        
        log(`serving on port ${currentPort}`);
        return currentPort;
      } catch (err: any) {
        if (err.code === 'EADDRINUSE') {
          log(`Port ${currentPort} in use, trying ${currentPort + 1}`);
          currentPort++;
        } else {
          log(`Server error: ${err.message}`);
          process.exit(1);
        }
      }
    }
    throw new Error("Could not find an available port");
  };
  
  await startServer(port);
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down gracefully');
    httpServer.close(() => {
      log('Server closed');
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    log('SIGINT received, shutting down gracefully');
    httpServer.close(() => {
      log('Server closed');
      process.exit(0);
    });
  });
})();
