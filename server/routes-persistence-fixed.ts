import type { Express } from "express";
import type { Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

// Resolve the directory of the currently executing file.
// In dev (ESM via tsx):   import.meta.url → <project>/server/routes-persistence-fixed.ts
// In prod (CJS via esbuild): import.meta.url → <project>/dist/index.cjs
const _currentDir = path.dirname(fileURLToPath(import.meta.url));
const IS_PROD = process.env.NODE_ENV === "production";

// In dev,  _currentDir = <project>/server/  → go up one level to reach project root
// In prod, _currentDir = <project>/dist/    → uploads/ and attached_assets/ are copied here
const UPLOADS_ROOT = IS_PROD
  ? path.resolve(_currentDir, "uploads")
  : path.resolve(_currentDir, "..", "uploads");
const ASSETS_ROOT = IS_PROD
  ? path.resolve(_currentDir, "attached_assets")
  : path.resolve(_currentDir, "..", "attached_assets");

declare module "express-session" {
  interface SessionData {
    userId: string;
    role: "manager" | "director";
  }
}

interface DirectorAccount {
  id: string;
  username: string;
  passwordHash: string;
  fullName: string;
  createdAt: string;
  mustChangePassword?: boolean;
  firstLogin?: boolean;
}

interface DirectorFile {
  id: string;
  directorId: string;
  filename: string;
  originalName: string;
  uploadedAt: string;
  uploadedBy: string;
  size: number;
  mimetype: string;
}

interface FinancialFile {
  id: string;
  category: string;
  filename: string;
  originalName: string;
  uploadedAt: string;
  size: number;
  mimetype: string;
}

interface GeneralDownload {
  id: string;
  filename: string;
  originalName: string;
  description: string;
  category: string;
  uploadedAt: string;
  size: number;
  mimetype: string;
}

interface CustomCategory {
  name: string;
  createdAt: string;
}

const FINANCIAL_CATEGORIES = ['Annual Reports', 'Financial Statements', 'Audit Reports', 'Board Minutes', 'Others'];

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  videoUrl?: string;
}

const directors = new Map<string, DirectorAccount>();
const directorFiles: DirectorFile[] = [];
const financialRecords: FinancialFile[] = [];
const generalDownloads: GeneralDownload[] = [];
const customCategories: CustomCategory[] = [];
let newsItems: NewsItem[] = [];

const MANAGER_USERNAME = process.env.MANAGER_USERNAME || "manager";
const MANAGER_ID = "manager";
let currentManagerPassword: string;

const uploadDir = path.resolve(UPLOADS_ROOT, "director-files");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const financialDir = path.resolve(UPLOADS_ROOT, "financial-records");
if (!fs.existsSync(financialDir)) {
  fs.mkdirSync(financialDir, { recursive: true });
}

const generalDownloadsDir = path.resolve(UPLOADS_ROOT, "general-downloads");
if (!fs.existsSync(generalDownloadsDir)) {
  fs.mkdirSync(generalDownloadsDir, { recursive: true });
}

const newsImagesDir = path.resolve(ASSETS_ROOT, "news");
if (!fs.existsSync(newsImagesDir)) {
  fs.mkdirSync(newsImagesDir, { recursive: true });
}

const DIRECTORS_FILE = path.resolve(UPLOADS_ROOT, "directors.json");
const DIRECTOR_FILES_FILE = path.resolve(UPLOADS_ROOT, "director-files.json");
const FINANCIAL_RECORDS_FILE = path.resolve(UPLOADS_ROOT, "financial-records.json");
const GENERAL_DOWNLOADS_FILE = path.resolve(UPLOADS_ROOT, "general-downloads.json");
const CUSTOM_CATEGORIES_FILE = path.resolve(UPLOADS_ROOT, "custom-categories.json");
const NEWS_FILE = path.resolve(UPLOADS_ROOT, "news.json");
const MANAGER_PASSWORD_FILE = path.resolve(UPLOADS_ROOT, "manager-password.txt");

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_ROOT)) {
    fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
  }
}

function loadDirectors(): DirectorAccount[] {
  ensureUploadsDir();
  if (!fs.existsSync(DIRECTORS_FILE)) return [];
  try {
    const data = fs.readFileSync(DIRECTORS_FILE, "utf8");
    return JSON.parse(data) as DirectorAccount[];
  } catch {
    return [];
  }
}

function saveDirectors(accounts: DirectorAccount[]) {
  ensureUploadsDir();
  fs.writeFileSync(DIRECTORS_FILE, JSON.stringify(accounts, null, 2));
}

function loadDirectorFiles(): DirectorFile[] {
  ensureUploadsDir();
  if (!fs.existsSync(DIRECTOR_FILES_FILE)) return [];
  try {
    const data = fs.readFileSync(DIRECTOR_FILES_FILE, "utf8");
    return JSON.parse(data) as DirectorFile[];
  } catch {
    return [];
  }
}

function saveDirectorFiles(files: DirectorFile[]) {
  ensureUploadsDir();
  fs.writeFileSync(DIRECTOR_FILES_FILE, JSON.stringify(files, null, 2));
}

function loadFinancialRecords(): FinancialFile[] {
  ensureUploadsDir();
  if (!fs.existsSync(FINANCIAL_RECORDS_FILE)) return [];
  try {
    const data = fs.readFileSync(FINANCIAL_RECORDS_FILE, "utf8");
    return JSON.parse(data) as FinancialFile[];
  } catch {
    return [];
  }
}

function saveFinancialRecords(files: FinancialFile[]) {
  ensureUploadsDir();
  fs.writeFileSync(FINANCIAL_RECORDS_FILE, JSON.stringify(files, null, 2));
}

function loadGeneralDownloads(): GeneralDownload[] {
  ensureUploadsDir();
  if (!fs.existsSync(GENERAL_DOWNLOADS_FILE)) return [];
  try {
    const data = fs.readFileSync(GENERAL_DOWNLOADS_FILE, "utf8");
    return JSON.parse(data) as GeneralDownload[];
  } catch {
    return [];
  }
}

function saveGeneralDownloads(files: GeneralDownload[]) {
  ensureUploadsDir();
  fs.writeFileSync(GENERAL_DOWNLOADS_FILE, JSON.stringify(files, null, 2));
}

function loadCustomCategories(): CustomCategory[] {
  ensureUploadsDir();
  if (!fs.existsSync(CUSTOM_CATEGORIES_FILE)) return [];
  try {
    const data = fs.readFileSync(CUSTOM_CATEGORIES_FILE, "utf8");
    return JSON.parse(data) as CustomCategory[];
  } catch {
    return [];
  }
}

function saveCustomCategories(cats: CustomCategory[]) {
  ensureUploadsDir();
  fs.writeFileSync(CUSTOM_CATEGORIES_FILE, JSON.stringify(cats, null, 2));
}

function loadNews(): NewsItem[] {
  ensureUploadsDir();
  if (!fs.existsSync(NEWS_FILE)) return [];
  try {
    const data = fs.readFileSync(NEWS_FILE, "utf8");
    return JSON.parse(data) as NewsItem[];
  } catch {
    return [];
  }
}

function saveNews(items: NewsItem[]) {
  ensureUploadsDir();
  fs.writeFileSync(NEWS_FILE, JSON.stringify(items, null, 2));
}

function saveManagerPassword(password: string) {
  ensureUploadsDir();
  fs.writeFileSync(MANAGER_PASSWORD_FILE, password);
}

function loadManagerPassword(): string {
  ensureUploadsDir();
  if (!fs.existsSync(MANAGER_PASSWORD_FILE)) {
    const defaultPass = process.env.MANAGER_PASSWORD || "kfcs@Manager2024";
    saveManagerPassword(defaultPass);
    return defaultPass;
  }
  return fs.readFileSync(MANAGER_PASSWORD_FILE, "utf8").trim();
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + randomUUID() + path.extname(file.originalname!);
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const financialStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, financialDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + randomUUID() + path.extname(file.originalname!);
    cb(null, unique);
  },
});

const financialUpload = multer({
  storage: financialStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const generalDownloadsStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, generalDownloadsDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + randomUUID() + path.extname(file.originalname!);
    cb(null, unique);
  },
});

const generalDownloadsUpload = multer({
  storage: generalDownloadsStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

const newsImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, newsImagesDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + randomUUID() + path.extname(file.originalname!);
    cb(null, unique);
  },
});

const newsUpload = multer({
  storage: newsImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  console.log("[Server] Starting API route registration...");

  // Load persistent data on startup
  const loadedDirectors = loadDirectors();
  directors.clear();
  for (const acc of loadedDirectors) {
    directors.set(acc.id, {
      ...acc,
      mustChangePassword: (acc.mustChangePassword ?? acc.firstLogin ?? true)
    });
  }
  console.log("[Persistence] Loaded", directors.size, "directors from JSON");

  directorFiles.length = 0;
  directorFiles.push(...loadDirectorFiles());
  console.log("[Persistence] Loaded", directorFiles.length, "director files from JSON");

  financialRecords.length = 0;
  financialRecords.push(...loadFinancialRecords());
  console.log("[Persistence] Loaded", financialRecords.length, "financial records from JSON");

  generalDownloads.length = 0;
  generalDownloads.push(...loadGeneralDownloads());
  console.log("[Persistence] Loaded", generalDownloads.length, "general downloads from JSON");

  customCategories.length = 0;
  customCategories.push(...loadCustomCategories());
  console.log("[Persistence] Loaded", customCategories.length, "custom categories from JSON");

  newsItems = loadNews();
  console.log("[Persistence] Loaded", newsItems.length, "news items from JSON");

  currentManagerPassword = loadManagerPassword();

  app.use("/financial-records", express.static(financialDir));
  app.use("/general-downloads", express.static(generalDownloadsDir));
  app.use("/attached_assets/news", express.static(newsImagesDir));

  app.use("/director-files", (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  }, (req: any, res: any, next: any) => {
    const fileName = path.basename(req.path);
    const file = directorFiles.find((f: DirectorFile) => f.filename === fileName);
    if (!file) return res.status(404).json({ message: "File not found" });
    if (req.session!.role === "director" && file.directorId !== req.session!.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  }, (req: any, res: any) => {
    const fileName = path.basename(req.path);
    res.sendFile(path.join(uploadDir, fileName));
  });

  // Manager Password Change Route
  app.post("/api/manager/change-password", (req: Request, res: Response) => {
    console.log("[Manager] POST /api/manager/change-password hit. Session Role:", req.session?.role);
    
    if (req.session?.role !== "manager") {
      return res.status(403).json({ message: "Forbidden: Only managers can update this password." });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required." });
    }

    if (currentPassword !== currentManagerPassword) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    currentManagerPassword = newPassword;
    saveManagerPassword(newPassword);
    console.log("[Manager] Password updated successfully.");
    return res.json({ success: true });
  });

  app.post("/api/directors/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    if (username === MANAGER_USERNAME) {
      const valid = password === currentManagerPassword;
      if (!valid) return res.status(401).json({ message: "Invalid credentials" });
      req.session!.userId = MANAGER_ID;
      req.session!.role = "manager";
      return res.json({ role: "manager", username: MANAGER_USERNAME, fullName: "Manager" });
    }

    for (const [, director] of directors) {
      if (director.username === username) {
        const valid = await bcrypt.compare(password, director.passwordHash);
        if (!valid) return res.status(401).json({ message: "Invalid credentials" });
        req.session!.userId = director.id;
        req.session!.role = "director";
        return res.json({
          role: "director",
          username: director.username,
          fullName: director.fullName,
          id: director.id,
          mustChangePassword: director.mustChangePassword,
        });
      }
    }

    return res.status(401).json({ message: "Invalid credentials" });
  });

  app.post("/api/directors/logout", (req: Request, res: Response) => {
    req.session?.destroy(() => {});
    res.json({ success: true });
  });

  app.get("/api/directors/me", (req: Request, res: Response) => {
    if (!req.session?.userId) return res.status(401).json({ message: "Not authenticated" });
    if (req.session.role === "manager") {
      return res.json({ role: "manager", username: MANAGER_USERNAME, fullName: "Manager", id: MANAGER_ID });
    }
    const director = directors.get(req.session.userId as string);
    if (!director) return res.status(401).json({ message: "Session invalid" });
    return res.json({
      role: "director",
      username: director.username,
      fullName: director.fullName,
      id: director.id,
      mustChangePassword: director.mustChangePassword,
    });
  });

  app.post("/api/directors/accounts", async (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const { username, fullName } = req.body;
    if (!username || !fullName) {
      return res.status(400).json({ message: "username and fullName are required" });
    }
    for (const [, d] of directors) {
      if (d.username === username) return res.status(409).json({ message: "Username already exists" });
    }
    const DEFAULT_PASSWORD = "123456";
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const id = randomUUID();
    const account: DirectorAccount = {
      id, username, passwordHash, fullName,
      createdAt: new Date().toISOString(),
      mustChangePassword: true,
    };
    directors.set(id, account);
    saveDirectors(Array.from(directors.values()));
    return res.status(201).json({ id, username, fullName, createdAt: account.createdAt, mustChangePassword: true });
  });

  app.post("/api/directors/change-password", async (req: Request, res: Response) => {
    if (!req.session?.userId || req.session.role !== "director") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "currentPassword and newPassword are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    const director = directors.get(req.session.userId as string);
    if (!director) return res.status(404).json({ message: "Director not found" });
    const valid = await bcrypt.compare(currentPassword, director.passwordHash);
    if (!valid) return res.status(401).json({ message: "Current password is incorrect" });
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from the current password" });
    }
    director.passwordHash = await bcrypt.hash(newPassword, 10);
    director.mustChangePassword = false;
    saveDirectors(Array.from(directors.values()));
    return res.json({ success: true });
  });

  app.get("/api/directors/accounts", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const list = Array.from(directors.values()).map(d => ({
      id: d.id,
      username: d.username,
      fullName: d.fullName,
      createdAt: d.createdAt,
    }));
    return res.json(list);
  });

  app.delete("/api/directors/accounts/:id", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const { id } = req.params;
    if (!directors.has(id)) return res.status(404).json({ message: "Director not found" });
    directors.delete(id);
    const indices: number[] = [];
    directorFiles.forEach((f, i) => { if (f.directorId === id) indices.push(i); });
    indices.reverse().forEach(i => {
      const [removed] = directorFiles.splice(i, 1);
      try { fs.unlinkSync(path.join(uploadDir, removed.filename)); } catch {}
    });
    saveDirectors(Array.from(directors.values()));
    saveDirectorFiles(directorFiles);
    return res.json({ success: true });
  });

  app.post("/api/directors/files", upload.single("file"), (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { directorId } = req.body;

    if (!directorId) {
      return res.status(400).json({ message: "directorId is required (use 'all' to send to all directors)" });
    }

    const uploadedAt = new Date().toISOString();

    if (directorId === "all") {
      if (directors.size === 0) {
        return res.status(400).json({ message: "No director accounts exist yet" });
      }
      const created: DirectorFile[] = [];
      for (const [id] of directors) {
        const meta: DirectorFile = {
          id: randomUUID(),
          directorId: id,
          filename: (req.file as any).filename,
          originalName: (req.file as any).originalname,
          uploadedAt,
          uploadedBy: MANAGER_USERNAME,
          size: (req.file as any).size,
          mimetype: (req.file as any).mimetype,
        };
        directorFiles.push(meta);
        created.push(meta);
      }
      saveDirectorFiles(directorFiles);
      return res.status(201).json({ broadcastCount: created.length, files: created });
    }

    if (!directors.has(directorId)) {
      return res.status(400).json({ message: "Director not found" });
    }

    const meta: DirectorFile = {
      id: randomUUID(),
      directorId,
      filename: (req.file as any).filename,
      originalName: (req.file as any).originalname,
      uploadedAt,
      uploadedBy: MANAGER_USERNAME,
      size: (req.file as any).size,
      mimetype: (req.file as any).mimetype,
    };
    directorFiles.push(meta);
    saveDirectorFiles(directorFiles);
    return res.status(201).json(meta);
  });

  app.get("/api/directors/files", (req: Request, res: Response) => {
    if (!req.session?.userId) return res.status(401).json({ message: "Not authenticated" });
    if (req.session.role === "manager") {
      const { directorId } = req.query;
      const result = directorId
        ? directorFiles.filter((f: DirectorFile) => f.directorId === directorId)
        : directorFiles;
      return res.json(result);
    }
    const myFiles = directorFiles.filter((f: DirectorFile) => f.directorId === req.session!.userId);
    return res.json(myFiles);
  });

app.delete("/api/directors/files/:id", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const { id } = req.params;
    const idx = directorFiles.findIndex((f: DirectorFile) => f.id === id);
    if (idx === -1) return res.status(404).json({ message: "File not found" });
    const [removed] = directorFiles.splice(idx, 1);
    try { fs.unlinkSync(path.join(uploadDir, removed.filename)); } catch {}
    saveDirectorFiles(directorFiles);
    return res.json({ success: true });
  });

  // Financial Records APIs
  app.post("/api/manager/financial-files", financialUpload.single("file"), (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { category } = req.body;
    if (!category) return res.status(400).json({ message: "category is required" });

    const uploadedAt = new Date().toISOString();

    const meta: FinancialFile = {
      id: randomUUID(),
      category,
      filename: (req.file as any).filename,
      originalName: (req.file as any).originalname,
      uploadedAt,
      size: (req.file as any).size,
      mimetype: (req.file as any).mimetype,
    };
    financialRecords.push(meta);
    saveFinancialRecords(financialRecords);
    return res.status(201).json(meta);
  });

  app.get("/api/manager/financial-files", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    return res.json(financialRecords);
  });

app.get("/api/public/financial-files", (req: Request, res: Response) => {
    const { category } = req.query;
    if (category && typeof category === 'string') {
      const filtered = financialRecords.filter(f => f.category.toLowerCase() === category.toLowerCase());
      return res.json(filtered);
    }
    return res.json(financialRecords);
  });

  app.delete("/api/manager/financial-files/:id", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const { id } = req.params;
    const idx = financialRecords.findIndex((f: FinancialFile) => f.id === id);
    if (idx === -1) return res.status(404).json({ message: "File not found" });
    const [removed] = financialRecords.splice(idx, 1);
    try { fs.unlinkSync(path.join(financialDir, removed.filename)); } catch {}
    saveFinancialRecords(financialRecords);
    return res.json({ success: true });
  });

  // Categories management
  app.get("/api/manager/categories", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const all = [
      ...FINANCIAL_CATEGORIES.map(name => ({ name, viewOnly: true, isFinancial: true })),
      ...customCategories.map(c => ({ name: c.name, viewOnly: false, isFinancial: false, createdAt: c.createdAt })),
    ];
    return res.json(all);
  });

  app.post("/api/manager/categories", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const trimmed = name.trim();
    const allNames = [...FINANCIAL_CATEGORIES, ...customCategories.map(c => c.name)];
    if (allNames.map(n => n.toLowerCase()).includes(trimmed.toLowerCase())) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const cat: CustomCategory = { name: trimmed, createdAt: new Date().toISOString() };
    customCategories.push(cat);
    saveCustomCategories(customCategories);
    return res.status(201).json({ name: cat.name, viewOnly: false, isFinancial: false, createdAt: cat.createdAt });
  });

  app.delete("/api/manager/categories/:name", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const name = decodeURIComponent(req.params.name);
    if (FINANCIAL_CATEGORIES.includes(name)) {
      return res.status(400).json({ message: "Cannot delete built-in financial categories" });
    }
    const idx = customCategories.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
    if (idx === -1) return res.status(404).json({ message: "Category not found" });
    customCategories.splice(idx, 1);
    saveCustomCategories(customCategories);
    return res.json({ success: true });
  });

  // Unified public downloads API (combines financial records + general downloads)
  app.get("/api/public/all-downloads", (_req: Request, res: Response) => {
    const financial = financialRecords.map(f => ({
      id: f.id,
      filename: f.filename,
      originalName: f.originalName,
      category: f.category,
      description: "",
      uploadedAt: f.uploadedAt,
      size: f.size,
      mimetype: f.mimetype,
      viewOnly: true,
      fileUrl: `/financial-records/${f.filename}`,
    }));
    const general = generalDownloads.map(f => ({
      id: f.id,
      filename: f.filename,
      originalName: f.originalName,
      category: f.category || "General",
      description: f.description || "",
      uploadedAt: f.uploadedAt,
      size: f.size,
      mimetype: f.mimetype,
      viewOnly: FINANCIAL_CATEGORIES.includes(f.category),
      fileUrl: `/general-downloads/${f.filename}`,
    }));
    return res.json([...financial, ...general]);
  });

  // General Downloads (public downloadable files)
  app.post("/api/manager/downloads", generalDownloadsUpload.single("file"), (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { description, category } = req.body;
    const meta: GeneralDownload = {
      id: randomUUID(),
      filename: (req.file as any).filename,
      originalName: (req.file as any).originalname,
      description: description || "",
      category: category || "General",
      uploadedAt: new Date().toISOString(),
      size: (req.file as any).size,
      mimetype: (req.file as any).mimetype,
    };
    generalDownloads.push(meta);
    saveGeneralDownloads(generalDownloads);
    return res.status(201).json(meta);
  });

  app.get("/api/manager/downloads", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    return res.json(generalDownloads);
  });

  app.get("/api/public/downloads", (_req: Request, res: Response) => {
    return res.json(generalDownloads);
  });

  app.delete("/api/manager/downloads/:id", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const { id } = req.params;
    const idx = generalDownloads.findIndex((f: GeneralDownload) => f.id === id);
    if (idx === -1) return res.status(404).json({ message: "File not found" });
    const [removed] = generalDownloads.splice(idx, 1);
    try { fs.unlinkSync(path.join(generalDownloadsDir, removed.filename)); } catch {}
    saveGeneralDownloads(generalDownloads);
    return res.json({ success: true });
  });

  // News API
  app.get("/api/news", (_req: Request, res: Response) => {
    return res.json(newsItems);
  });

  app.post("/api/news", newsUpload.single("image"), (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const { title, excerpt, content, date, videoUrl } = req.body;
    if (!title || !excerpt || !content || !date) {
      return res.status(400).json({ message: "title, excerpt, content, date are required" });
    }
    const imagePath = req.file ? `/attached_assets/news/${(req.file as any).filename}` : "";
    const id = newsItems.length > 0 ? Math.max(...newsItems.map((n: NewsItem) => n.id)) + 1 : 1;
    const newNews: NewsItem = { id, title, excerpt, content, image: imagePath, date, videoUrl: videoUrl || "" };
    newsItems.push(newNews);
    saveNews(newsItems);
    return res.status(201).json(newNews);
  });

  app.put("/api/news/:id", newsUpload.single("image"), (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const id = parseInt(req.params.id);
    const item = newsItems.find((n: NewsItem) => n.id === id);
    if (!item) return res.status(404).json({ message: "News item not found" });
    const { title, excerpt, content, date, videoUrl } = req.body;
    if (title) item.title = title;
    if (excerpt) item.excerpt = excerpt;
    if (content) item.content = content;
    if (date) item.date = date;
    if (videoUrl !== undefined) item.videoUrl = videoUrl;
    if (req.file) {
      if (item.image && item.image.startsWith("/attached_assets/news/")) {
        const oldFilename = item.image.split("/").pop();
        try { fs.unlinkSync(path.join(newsImagesDir, oldFilename || "")); } catch {}
      }
      item.image = `/attached_assets/news/${(req.file as any).filename}`;
    }
    saveNews(newsItems);
    return res.json(item);
  });

  app.delete("/api/news/:id", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const id = parseInt(req.params.id);
    const index = newsItems.findIndex((n: NewsItem) => n.id === id);
    if (index === -1) return res.status(404).json({ message: "News item not found" });
    const [item] = newsItems.splice(index, 1);
    saveNews(newsItems);
    if (item.image && item.image.startsWith("/attached_assets/news/")) {
      const filename = item.image.split("/").pop();
      try { fs.unlinkSync(path.join(newsImagesDir, filename || "")); } catch {}
    }
    return res.json({ success: true });
  });

  app.post("/api/send-email", async (req, res) => {
    try {
      const { subject, text } = req.body;

      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpUser || !smtpPass) {
        console.warn("SMTP credentials missing. Email not sent.");
        return res.status(200).json({ success: true, message: "Simulation: SMTP credentials missing." });
      }

const transporter = nodemailer.createTransport({
        host: "kabiangafcs.co.ke",
        port: 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false }
      });

      const mailOptions = {
        from: smtpUser,
        to: "info@kabiangafcs.co.ke",
        subject: subject || "Website Notification",
        text: text || "No content provided.",
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Email error (primary):", error);
      try {
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
const fallbackTransporter = nodemailer.createTransport({
          host: "mail.kabiangafcs.co.ke",
          port: 465,
          secure: true,
          auth: { user: smtpUser, pass: smtpPass },
          tls: { rejectUnauthorized: false }
        });
        await fallbackTransporter.sendMail({
          from: smtpUser,
          to: "info@kabiangafcs.co.ke",
          subject: req.body.subject || "Website Notification",
          text: req.body.text || "No content provided.",
        });
        res.json({ success: true });
      } catch (fallbackError: any) {
        console.error("Email error (fallback):", fallbackError);
        res.status(500).json({ error: fallbackError.message });
      }
    }
  });

  return httpServer;
}
