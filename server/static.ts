import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  console.log(`[STATIC] Serving from: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Serve attached_assets for PDFs and images (fixes AnnualReport PDF 404)
  const assetsPath = path.resolve(process.cwd(), "attached_assets");
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
