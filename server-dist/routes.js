"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const nodemailer_1 = __importDefault(require("nodemailer"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const directors = new Map();
const directorFiles = [];
const MANAGER_USERNAME = process.env.MANAGER_USERNAME || "manager";
const MANAGER_ID = "manager";
let currentManagerPassword;
const uploadDir = path_1.default.join(process.cwd(), "uploads", "director-files");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const DIRECTORS_FILE = path_1.default.resolve("uploads/directors.json");
const DIRECTOR_FILES_FILE = path_1.default.resolve("uploads/director-files.json");
const NEWS_FILE = path_1.default.resolve("uploads/news.json");
const MANAGER_PASSWORD_FILE = path_1.default.resolve("uploads/manager-password.txt");
const newsImagesDir = path_1.default.join(process.cwd(), "attached_assets", "news");
if (!fs_1.default.existsSync(newsImagesDir)) {
    fs_1.default.mkdirSync(newsImagesDir, { recursive: true });
}
function ensureUploadsDir() {
    const uploadDirPath = path_1.default.resolve("uploads");
    if (!fs_1.default.existsSync(uploadDirPath)) {
        fs_1.default.mkdirSync(uploadDirPath, { recursive: true });
    }
}
function loadDirectors() {
    ensureUploadsDir();
    if (!fs_1.default.existsSync(DIRECTORS_FILE))
        return [];
    try {
        const data = fs_1.default.readFileSync(DIRECTORS_FILE, "utf8");
        return JSON.parse(data);
    }
    catch {
        return [];
    }
}
function saveDirectors(accounts) {
    ensureUploadsDir();
    fs_1.default.writeFileSync(DIRECTORS_FILE, JSON.stringify(accounts, null, 2));
}
function loadDirectorFiles() {
    ensureUploadsDir();
    if (!fs_1.default.existsSync(DIRECTOR_FILES_FILE))
        return [];
    try {
        const data = fs_1.default.readFileSync(DIRECTOR_FILES_FILE, "utf8");
        return JSON.parse(data);
    }
    catch {
        return [];
    }
}
function loadNews() {
    ensureUploadsDir();
    if (!fs_1.default.existsSync(NEWS_FILE))
        return [];
    try {
        const data = fs_1.default.readFileSync(NEWS_FILE, "utf8");
        return JSON.parse(data);
    }
    catch {
        return [];
    }
}
function saveNews(news) {
    ensureUploadsDir();
    fs_1.default.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2));
}
function saveDirectorFiles(files) {
    ensureUploadsDir();
    fs_1.default.writeFileSync(DIRECTOR_FILES_FILE, JSON.stringify(files, null, 2));
}
function saveManagerPassword(password) {
    ensureUploadsDir();
    fs_1.default.writeFileSync(MANAGER_PASSWORD_FILE, password);
}
function loadManagerPassword() {
    ensureUploadsDir();
    if (!fs_1.default.existsSync(MANAGER_PASSWORD_FILE)) {
        const defaultPass = process.env.MANAGER_PASSWORD || "kfcs@Manager2024";
        saveManagerPassword(defaultPass);
        return defaultPass;
    }
    return fs_1.default.readFileSync(MANAGER_PASSWORD_FILE, "utf8").trim();
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const unique = Date.now() + "-" + (0, crypto_1.randomUUID)() + path_1.default.extname(file.originalname);
        cb(null, unique);
    },
});
const newsStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, newsImagesDir),
    filename: (_req, file, cb) => {
        const unique = Date.now() + "-" + (0, crypto_1.randomUUID)() + path_1.default.extname(file.originalname);
        cb(null, unique);
    },
});
const newsUpload = (0, multer_1.default)({
    storage: newsStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
});
async function registerRoutes(httpServer, app) {
    console.log("[Server] Starting API route registration...");
    const newsItems = loadNews();
    console.log("[Persistence] Loaded", newsItems.length, "news items from JSON");
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
    app.use("/director-files", (req, res, next) => {
        if (!req.session?.userId) {
            console.warn("[DIRECTOR-FILES] Unauthorized access attempt to /director-files");
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    }, (req, res, next) => {
        const fileName = path_1.default.basename(req.path);
        const userId = req.session.userId;
        const userRole = req.session.role;
        console.log(`[DIRECTOR-FILES] Access attempt for file: ${fileName} by user: ${userId} (role: ${userRole})`);
        const matchingFiles = directorFiles.filter((f) => f.filename === fileName);
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
    app.post("/api/manager/change-password", (req, res) => {
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
    app.post("/api/directors/login", async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }
        if (username === MANAGER_USERNAME) {
            const valid = password === currentManagerPassword;
            if (!valid)
                return res.status(401).json({ message: "Invalid credentials" });
            req.session.userId = MANAGER_ID;
            req.session.role = "manager";
            return res.json({ role: "manager", username: MANAGER_USERNAME, fullName: "Manager" });
        }
        for (const [, director] of directors) {
            if (director.username === username) {
                const valid = await bcrypt_1.default.compare(password, director.passwordHash);
                if (!valid)
                    return res.status(401).json({ message: "Invalid credentials" });
                req.session.userId = director.id;
                req.session.role = "director";
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
    app.post("/api/directors/logout", (req, res) => {
        req.session?.destroy(() => { });
        res.json({ success: true });
    });
    app.get("/api/directors/me", (req, res) => {
        if (!req.session?.userId)
            return res.status(401).json({ message: "Not authenticated" });
        if (req.session.role === "manager") {
            return res.json({ role: "manager", username: MANAGER_USERNAME, fullName: "Manager", id: MANAGER_ID });
        }
        const director = directors.get(req.session.userId);
        if (!director)
            return res.status(401).json({ message: "Session invalid" });
        return res.json({
            role: "director",
            username: director.username,
            fullName: director.fullName,
            id: director.id,
            mustChangePassword: director.mustChangePassword,
        });
    });
    app.post("/api/directors/accounts", async (req, res) => {
        if (req.session?.role !== "manager")
            return res.status(403).json({ message: "Forbidden" });
        const { username, fullName } = req.body;
        if (!username || !fullName) {
            return res.status(400).json({ message: "username and fullName are required" });
        }
        for (const [, d] of directors) {
            if (d.username === username)
                return res.status(409).json({ message: "Username already exists" });
        }
        const DEFAULT_PASSWORD = "123456";
        const passwordHash = await bcrypt_1.default.hash(DEFAULT_PASSWORD, 10);
        const id = (0, crypto_1.randomUUID)();
        const account = {
            id, username, passwordHash, fullName,
            createdAt: new Date().toISOString(),
            mustChangePassword: true,
        };
        directors.set(id, account);
        saveDirectors(Array.from(directors.values()));
        return res.status(201).json({ id, username, fullName, createdAt: account.createdAt, mustChangePassword: true });
    });
    app.post("/api/directors/change-password", async (req, res) => {
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
        if (!director)
            return res.status(404).json({ message: "Director not found" });
        const valid = await bcrypt_1.default.compare(currentPassword, director.passwordHash);
        if (!valid)
            return res.status(401).json({ message: "Current password is incorrect" });
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: "New password must be different from the current password" });
        }
        director.passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        director.mustChangePassword = false;
        saveDirectors(Array.from(directors.values()));
        return res.json({ success: true });
    });
    app.get("/api/directors/accounts", (req, res) => {
        if (req.session?.role !== "manager")
            return res.status(403).json({ message: "Forbidden" });
        const list = Array.from(directors.values()).map(d => ({
            id: d.id,
            username: d.username,
            fullName: d.fullName,
            createdAt: d.createdAt,
        }));
        return res.json(list);
    });
    app.delete("/api/directors/accounts/:id", (req, res) => {
        if (req.session?.role !== "manager")
            return res.status(403).json({ message: "Forbidden" });
        const { id } = req.params;
        if (!directors.has(id))
            return res.status(404).json({ message: "Director not found" });
        directors.delete(id);
        const filesRemovedFromDirector = [];
        let i = directorFiles.length;
        while (i--) {
            if (directorFiles[i].directorId === id) {
                const [removed] = directorFiles.splice(i, 1);
                filesRemovedFromDirector.push(removed);
            }
        }
        for (const removedFile of filesRemovedFromDirector) {
            const remainingReferences = directorFiles.filter(f => f.filename === removedFile.filename).length;
            if (remainingReferences === 0) {
                try {
                    fs_1.default.unlinkSync(path_1.default.join(uploadDir, removedFile.filename));
                    console.log(`[DIRECTOR-DELETE] Physical file ${removedFile.filename} deleted as it was the last reference after director removal.`);
                }
                catch (err) {
                    console.error(`[DIRECTOR-DELETE] Error deleting physical file ${removedFile.filename}:`, err);
                }
            }
        }
        saveDirectors(Array.from(directors.values()));
        saveDirectorFiles(directorFiles);
        return res.json({ success: true, message: `Director ${id} and associated files processed.` });
    });
    app.post("/api/directors/files", upload.single("file"), (req, res) => {
        if (req.session?.role !== "manager")
            return res.status(403).json({ message: "Forbidden" });
        if (!req.file)
            return res.status(400).json({ message: "No file uploaded" });
        const { directorId } = req.body;
        console.log(`[UPLOAD] File received: ${req.file.originalname}, saved as: ${req.file.filename}, path: ${req.file.path}`);
        if (!directorId) {
            return res.status(400).json({ message: "directorId is required (use 'all' to send to all directors)" });
        }
        const uploadedAt = new Date().toISOString();
        const originalFilename = req.file.filename;
        const originalPath = req.file.path;
        const originalName = req.file.originalname;
        const baseName = path_1.default.parse(originalFilename).name;
        const ext = path_1.default.parse(originalFilename).ext;
        const originalSize = req.file.size;
        const originalMimetype = req.file.mimetype;
        if (directorId === "all") {
            if (directors.size === 0) {
                return res.status(400).json({ message: "No director accounts exist yet" });
            }
            const created = [];
            for (const [dirId] of directors) {
                const uniqueFilename = baseName + '_for_' + dirId.slice(0, 8) + ext;
                const uniquePath = path_1.default.join(uploadDir, uniqueFilename);
                fs_1.default.copyFileSync(originalPath, uniquePath);
                console.log('[BROADCAST-COPY] Created copy ' + uniqueFilename + ' for director ' + dirId + ' at ' + uniquePath);
                const stat = fs_1.default.statSync(uniquePath);
                const meta = {
                    id: (0, crypto_1.randomUUID)(),
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
            return res.status(201).json({ broadcastCount: created.length, files: created });
        }
        if (!directors.has(directorId)) {
            return res.status(400).json({ message: "Director not found" });
        }
        const meta = {
            id: (0, crypto_1.randomUUID)(),
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
    app.get("/api/directors/files", (req, res) => {
        if (!req.session?.userId)
            return res.status(401).json({ message: "Not authenticated" });
        if (req.session.role === "manager") {
            const { directorId } = req.query;
            const result = directorId
                ? directorFiles.filter((f) => f.directorId === directorId)
                : directorFiles;
            return res.json(result);
        }
        const myFiles = directorFiles.filter((f) => f.directorId === req.session.userId);
        return res.json(myFiles);
    });
    app.delete("/api/directors/files/:id", (req, res) => {
        if (req.session?.role !== "manager")
            return res.status(403).json({ message: "Forbidden" });
        const { id } = req.params;
        const idx = directorFiles.findIndex((f) => f.id === id);
        if (idx === -1)
            return res.status(404).json({ message: "File not found" });
        const [removed] = directorFiles.splice(idx, 1);
        const remainingReferences = directorFiles.filter(f => f.filename === removed.filename).length;
        if (remainingReferences === 0) {
            try {
                fs_1.default.unlinkSync(path_1.default.join(uploadDir, removed.filename));
                console.log(`[FILE-DELETE] Physical file ${removed.filename} deleted as it was the last reference.`);
            }
            catch (err) {
                console.error(`[FILE-DELETE] Error deleting physical file ${removed.filename}:`, err);
            }
        }
        else {
            console.log(`[FILE-DELETE] Physical file ${removed.filename} not deleted, ${remainingReferences} references still exist.`);
        }
        saveDirectorFiles(directorFiles);
        return res.json({ success: true });
    });
    app.get("/api/news", (req, res) => {
        res.json(newsItems);
    });
    app.post("/api/news", newsUpload.single("image"), (req, res) => {
        if (req.session?.role !== "manager")
            return res.status(403).json({ message: "Forbidden" });
        const { title, excerpt, content, date } = req.body;
        if (!title || !excerpt || !content || !date) {
            return res.status(400).json({ message: "title, excerpt, content, date required" });
        }
        const imagePath = req.file ? `/attached_assets/news/${req.file.filename}` : "";
        const id = newsItems.length > 0 ? Math.max(...newsItems.map(n => n.id)) + 1 : 1;
        const newNews = {
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
    app.put("/api/news/:id", newsUpload.single("image"), (req, res) => {
        if (req.session?.role !== "manager")
            return res.status(403).json({ message: "Forbidden" });
        const id = parseInt(req.params.id);
        const item = newsItems.find(n => n.id === id);
        if (!item)
            return res.status(404).json({ message: "News not found" });
        const { title, excerpt, content, date } = req.body;
        item.title = title || item.title;
        item.excerpt = excerpt || item.excerpt;
        item.content = content || item.content;
        item.date = date || item.date;
        if (req.body.videoUrl !== undefined)
            item.videoUrl = req.body.videoUrl || undefined;
        if (req.file) {
            if (item.image && item.image.startsWith('/attached_assets/news/')) {
                const oldFilename = item.image.split('/').pop();
                try {
                    fs_1.default.unlinkSync(path_1.default.join(newsImagesDir, oldFilename || ''));
                }
                catch { }
            }
            item.image = `/attached_assets/news/${req.file.filename}`;
        }
        saveNews(newsItems);
        res.json(item);
    });
    app.delete("/api/news/:id", (req, res) => {
        if (req.session?.role !== "manager")
            return res.status(403).json({ message: "Forbidden" });
        const id = parseInt(req.params.id);
        const index = newsItems.findIndex(n => n.id === id);
        if (index === -1)
            return res.status(404).json({ message: "News not found" });
        const item = newsItems[index];
        newsItems.splice(index, 1);
        saveNews(newsItems);
        if (item.image && item.image.startsWith('/attached_assets/news/')) {
            const filename = item.image.split('/').pop();
            try {
                fs_1.default.unlinkSync(path_1.default.join(newsImagesDir, filename || ''));
            }
            catch (err) {
                console.error("[NEWS-DELETE] Error deleting image:", err);
            }
        }
        res.json({ success: true });
    });
    app.use("/attached_assets/news", express_1.default.static(newsImagesDir));
    app.post("/api/send-email", async (req, res) => {
        try {
            const { subject, text } = req.body;
            const smtpUser = process.env.SMTP_USER;
            const smtpPass = process.env.SMTP_PASS;
            if (!smtpUser || !smtpPass) {
                console.warn("SMTP credentials missing. Email not sent.");
                return res.status(200).json({ success: true, message: "Simulation: SMTP credentials missing." });
            }
            const transporter = nodemailer_1.default.createTransport({
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
        }
        catch (error) {
            console.error("Email error (primary):", error);
            try {
                const smtpUser = process.env.SMTP_USER;
                const smtpPass = process.env.SMTP_PASS;
                const fallbackTransporter = nodemailer_1.default.createTransport({
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
            }
            catch (fallbackError) {
                console.error("Email error (fallback):", fallbackError);
                res.status(500).json({ error: fallbackError.message });
            }
        }
    });
    app.use("/director-files", (req, res) => {
        const fileName = path_1.default.basename(req.path);
        const filePath = path_1.default.join(uploadDir, fileName);
        if (!fs_1.default.existsSync(filePath)) {
            console.error(`[DIRECTOR-FILES] ERROR: Physical file missing at ${filePath} during final serve attempt.`);
            console.error(`[DIRECTOR-FILES] Physical file missing on disk: ${filePath} for requested filename: ${fileName}`);
            return res.status(404).json({ message: "FILE NOT AVAILABLE ON SITE (Physical file missing)" });
        }
        console.log(`[DIRECTOR-FILES] Serving physical file: ${filePath}`);
        res.sendFile(filePath);
    });
    return httpServer;
}
