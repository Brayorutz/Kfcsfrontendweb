import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
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
  mustChangePassword: boolean;
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

const directors = new Map<string, DirectorAccount>();
const directorFiles: DirectorFile[] = [];

const MANAGER_USERNAME = process.env.MANAGER_USERNAME || "manager";
const MANAGER_PASSWORD = process.env.MANAGER_PASSWORD || "kfcs@Manager2024";
const MANAGER_ID = "manager-root";

const uploadDir = path.resolve("uploads/director-files");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use("/director-files", (req, res, next) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  }, (req, res, next) => {
    const fileName = path.basename(req.path);
    const file = directorFiles.find(f => f.filename === fileName);
    if (!file) return res.status(404).json({ message: "File not found" });
    if (req.session!.role === "director" && file.directorId !== req.session!.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  }, (req, res) => {
    const fileName = path.basename(req.path);
    res.sendFile(path.join(uploadDir, fileName));
  });

  app.post("/api/directors/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    if (username === MANAGER_USERNAME) {
      const valid = password === MANAGER_PASSWORD;
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
    const director = directors.get(req.session.userId);
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
    const director = directors.get(req.session.userId);
    if (!director) return res.status(404).json({ message: "Director not found" });
    const valid = await bcrypt.compare(currentPassword, director.passwordHash);
    if (!valid) return res.status(401).json({ message: "Current password is incorrect" });
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from the current password" });
    }
    director.passwordHash = await bcrypt.hash(newPassword, 10);
    director.mustChangePassword = false;
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
          filename: req.file.filename,
          originalName: req.file.originalname,
          uploadedAt,
          uploadedBy: MANAGER_USERNAME,
          size: req.file.size,
          mimetype: req.file.mimetype,
        };
        directorFiles.push(meta);
        created.push(meta);
      }
      return res.status(201).json({ broadcastCount: created.length, files: created });
    }

    if (!directors.has(directorId)) {
      return res.status(400).json({ message: "Director not found" });
    }

    const meta: DirectorFile = {
      id: randomUUID(),
      directorId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadedAt,
      uploadedBy: MANAGER_USERNAME,
      size: req.file.size,
      mimetype: req.file.mimetype,
    };
    directorFiles.push(meta);
    return res.status(201).json(meta);
  });

  app.get("/api/directors/files", (req: Request, res: Response) => {
    if (!req.session?.userId) return res.status(401).json({ message: "Not authenticated" });
    if (req.session.role === "manager") {
      const { directorId } = req.query;
      const result = directorId
        ? directorFiles.filter(f => f.directorId === directorId)
        : directorFiles;
      return res.json(result);
    }
    const myFiles = directorFiles.filter(f => f.directorId === req.session!.userId);
    return res.json(myFiles);
  });

  app.delete("/api/directors/files/:id", (req: Request, res: Response) => {
    if (req.session?.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    const { id } = req.params;
    const idx = directorFiles.findIndex(f => f.id === id);
    if (idx === -1) return res.status(404).json({ message: "File not found" });
    const [removed] = directorFiles.splice(idx, 1);
    try { fs.unlinkSync(path.join(uploadDir, removed.filename)); } catch {}
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
