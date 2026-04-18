import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// In production, the compiled bundle lives at dist/index.cjs
// so import.meta.url → file:///project/dist/index.cjs
// and _distDir → <project>/dist/
const _distDir = path.dirname(fileURLToPath(import.meta.url));

export function serveStatic(app: Express) {
  const distPath = path.resolve(_distDir, "public");
  console.log(`[STATIC] Serving from: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  const assetsPath = path.resolve(_distDir, "attached_assets");
  console.log(`[STATIC] Serving attached_assets from: ${assetsPath}`);
  if (fs.existsSync(assetsPath)) {
    app.use("/attached_assets", express.static(assetsPath));
  } else {
    console.warn(`[STATIC] attached_assets not found at ${assetsPath}`);
  }

  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    res.sendFile(indexPath);
  });
}
