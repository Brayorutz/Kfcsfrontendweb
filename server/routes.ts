import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import express from "express";
import { randomUUID } from "crypto";

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

const MANAGER_USERNAME = process.env.MANAGER_USERNAME || "manager";
const MANAGER_ID = "manager";
let currentManagerPassword: string;

const uploadDir = path.join(process.cwd(), "uploads", "director-files");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const DIRECTORS_FILE = path.resolve("uploads/directors.json");
const DIRECTOR_FILES_FILE = path.resolve("uploads/director-files.json");
const NEWS_FILE = path.resolve("uploads/news.json");
const MANAGER_PASSWORD_FILE = path.resolve("uploads/manager-password.txt");

const newsImagesDir = path.join(process.cwd(), "attached_assets", "news");
if (!fs.existsSync(newsImagesDir)) {
  fs.mkdirSync(newsImagesDir, { recursive: true });
}

function ensureUploadsDir() {
  const uploadDirPath = path.resolve("uploads");
  if (!fs.existsSync(uploadDirPath)) {
    fs.mkdirSync(uploadDirPath, { recursive: true });
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

function saveNews(news: NewsItem[]) {
  ensureUploadsDir();
  fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2));
}

function saveDirectorFiles(files: DirectorFile[]) {
  ensureUploadsDir();
  fs.writeFileSync(DIRECTOR_FILES_FILE, JSON.stringify(files, null, 2));
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

const newsStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, newsImagesDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + randomUUID() + path.extname(file.originalname!);
    cb(null, unique);
  },
});

const newsUpload = multer({
  storage: newsStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for images
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
console.log("[Server] Starting API route registration...");

  const newsItems: NewsItem[] = loadNews();
  console.log("[Persistence] Loaded", newsItems.length, "news items from JSON");

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

  currentManagerPassword = loadManagerPassword();
  console.log(`[Server] Upload directory: ${uploadDir}`);

  app.use("/director-files", (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.userId) {
      console.warn("[DIRECTOR-FILES] Unauthorized access attempt to /director-files");
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  }, (req: Request, res: Response, next: NextFunction) => {
    const fileName = path.basename(req.path);
    const userId = req.session!.userId;
    const userRole = req.session!.role;

    console.log(`[DIRECTOR-FILES] Access attempt for file: ${fileName} by user: ${userId} (role: ${userRole})`);

    const matchingFiles = directorFiles.filter((f: DirectorFile) => f.filename === fileName);
    if (matchingFiles.length === 0) {
      console.warn(`[DIRECTOR-FILES] File metadata not found for filename: ${fileName}`);
      return res.status(404).json({ message: "File not found" });
    }
    if (userRole === "director") {
      const directorFile = matchingFiles.find(f => f.directorId === userId);
      if (!directorFile) {
        console.warn(`[DIRECTOR-FILES] Director ${userId} forbidden from accessing file ${fileName}. No matching metadata entry.`);
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    next();
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
    console.log('[ADD-DIRECTOR] POST /api/directors/accounts hit');
    console.log('[ADD-DIRECTOR] Session:', { userId: req.session?.userId, role: req.session?.role });
    if (req.session?.role !== "manager") {
      console.log('[ADD-DIRECTOR] 403 Forbidden - role check failed');
      return res.status(403).json({ message: "Forbidden" });
    }
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

    const filesRemovedFromDirector: DirectorFile[] = [];
    // Remove all file metadata entries associated with this director
    let i = directorFiles.length;
    while (i--) {
      if (directorFiles[i].directorId === id) {
        const [removed] = directorFiles.splice(i, 1);
        filesRemovedFromDirector.push(removed);
      }
    }

    // For each file removed, check if its physical file still has references
    for (const removedFile of filesRemovedFromDirector) {
      const remainingReferences = directorFiles.filter(f => f.filename === removedFile.filename).length;
      if (remainingReferences === 0) {
        try {
          fs.unlinkSync(path.join(uploadDir, removedFile.filename));
          console.log(`[DIRECTOR-DELETE] Physical file ${removedFile.filename} deleted as it was the last reference after director removal.`);
        } catch (err) {
          console.error(`[DIRECTOR-DELETE] Error deleting physical file ${removedFile.filename}:`, err);
        }
      }
    }

    // Save the updated list of directors (after one was deleted)
    saveDirectors(Array.from(directors.values()));
    // Save the updated list of director files (after entries for the deleted director were removed)
    saveDirectorFiles(directorFiles);
    return res.json({ success: true, message: `Director ${id} and associated files processed.` });
  });

  app.post("/api/directors/files", upload.single("file"), (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { directorId } = req.body;

    console.log(`[UPLOAD] File received: ${req.file.originalname}, saved as: ${req.file.filename}, path: ${req.file.path}`);
    if (!directorId) {
      return res.status(400).json({ message: "directorId is required (use 'all' to send to all directors)" });
    }

    const uploadedAt = new Date().toISOString();
    const originalFilename = (req.file as any).filename;
    const originalPath = (req.file as any).path;
    const originalName = (req.file as any).originalname;
    const baseName = path.parse(originalFilename).name;
    const ext = path.parse(originalFilename).ext;
    const originalSize = (req.file as any).size;
    const originalMimetype = (req.file as any).mimetype;

    if (directorId === "all") {
      if (directors.size === 0) {
        return res.status(400).json({ message: "No director accounts exist yet" });
      }
      const created: DirectorFile[] = [];
      for (const [dirId] of directors) {
        const uniqueFilename = baseName + '_for_' + dirId.slice(0,8) + ext;

        const uniquePath = path.join(uploadDir, uniqueFilename);
        fs.copyFileSync(originalPath, uniquePath);
        console.log('[BROADCAST-COPY] Created copy ' + uniqueFilename + ' for director ' + dirId + ' at ' + uniquePath);

        
        const stat = fs.statSync(uniquePath);
        const meta: DirectorFile = {
          id: randomUUID(),
          directorId: dirId,
          filename: uniqueFilename,
          originalName,
          uploadedAt,
          uploadedBy: MANAGER_USERNAME,
          size: stat.size,
          mimetype: originalMimetype,
        };
        directorFiles.push(meta);
        created.push(meta);
      }
      saveDirectorFiles(directorFiles);
      // Keep original file as backup, or delete if desired
      // fs.unlinkSync(originalPath);
      return res.status(201).json({ broadcastCount: created.length, files: created });
    }

    if (!directors.has(directorId)) {
      return res.status(400).json({ message: "Director not found" });
    }

    const meta: DirectorFile = {
      id: randomUUID(),
      directorId,
      filename: originalFilename,
      originalName,
      uploadedAt,
      uploadedBy: MANAGER_USERNAME,
      size: originalSize,
      mimetype: originalMimetype,
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

    // Check if this is the last reference to the physical file
    const remainingReferences = directorFiles.filter(f => f.filename === removed.filename).length;
    if (remainingReferences === 0) {
      try {
        fs.unlinkSync(path.join(uploadDir, removed.filename));
        console.log(`[FILE-DELETE] Physical file ${removed.filename} deleted as it was the last reference.`);
      } catch (err) {
        console.error(`[FILE-DELETE] Error deleting physical file ${removed.filename}:`, err);
      }
    } else {
      console.log(`[FILE-DELETE] Physical file ${removed.filename} not deleted, ${remainingReferences} references still exist.`);
    }
    saveDirectorFiles(directorFiles);
    return res.json({ success: true });
  });

  // News APIs

app.get("/api/news", (req: Request, res: Response) => {
  res.json(newsItems);
});

  app.post("/api/news", newsUpload.single("image"), (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });

    const { title, excerpt, content, date } = req.body;
    if (!title || !excerpt || !content || !date) {
      return res.status(400).json({ message: "title, excerpt, content, date required" });
    }

    const imagePath = req.file ? `/attached_assets/news/${req.file.filename}` : "";
    const id = newsItems.length > 0 ? Math.max(...newsItems.map(n => n.id)) + 1 : 1;

    const newNews: NewsItem = {
      id,
      title,
      excerpt,
      content,
      image: imagePath,
      date,
      videoUrl: req.body.videoUrl || undefined,
    };

    newsItems.push(newNews);
    saveNews(newsItems);
    res.status(201).json(newNews);
  });

  app.put("/api/news/:id", newsUpload.single("image"), (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });

    const id = parseInt(req.params.id);
    const item = newsItems.find(n => n.id === id);
    if (!item) return res.status(404).json({ message: "News not found" });

    const { title, excerpt, content, date } = req.body;

    item.title = title || item.title;
    item.excerpt = excerpt || item.excerpt;
    item.content = content || item.content;
    item.date = date || item.date;
    if (req.body.videoUrl !== undefined) item.videoUrl = req.body.videoUrl || undefined;

    if (req.file) {
      // Delete old image if exists
      if (item.image && item.image.startsWith('/attached_assets/news/')) {
        const oldFilename = item.image.split('/').pop();
        try {
          fs.unlinkSync(path.join(newsImagesDir, oldFilename || ''));
        } catch {}
      }
      item.image = `/attached_assets/news/${req.file.filename}`;
    }

    saveNews(newsItems);
    res.json(item);
  });

  app.delete("/api/news/:id", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });

    const id = parseInt(req.params.id);
    const index = newsItems.findIndex(n => n.id === id);
    if (index === -1) return res.status(404).json({ message: "News not found" });

    const item = newsItems[index];
    newsItems.splice(index, 1);
    saveNews(newsItems);

    // Delete image file
    if (item.image && item.image.startsWith('/attached_assets/news/')) {
      const filename = item.image.split('/').pop();
      try {
        fs.unlinkSync(path.join(newsImagesDir, filename || ''));
      } catch (err) {
        console.error("[NEWS-DELETE] Error deleting image:", err);
      }
    }

    res.json({ success: true });
  });

  // Serve news images publicly
  app.use("/attached_assets/news", express.static(newsImagesDir));

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

  // Final middleware to serve the physical file after all checks
  app.use("/director-files", (req: Request, res: Response) => {
    const fileName = path.basename(req.path);
    const filePath = path.join(uploadDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.error(`[DIRECTOR-FILES] ERROR: Physical file missing at ${filePath} during final serve attempt.`);
      console.error(`[DIRECTOR-FILES] Physical file missing on disk: ${filePath} for requested filename: ${fileName}`);
      return res.status(404).json({ message: "FILE NOT AVAILABLE ON SITE (Physical file missing)" });
    }
    console.log(`[DIRECTOR-FILES] Serving physical file: ${filePath}`);
    res.sendFile(filePath);
  });

  return httpServer;
}
