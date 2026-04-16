"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const memorystore_1 = __importDefault(require("memorystore"));
const routes_1 = require("./routes");
const static_1 = require("./static");
const http_1 = require("http");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use(express_1.default.json({
    verify: (req, _res, buf) => {
        req.rawBody = buf;
    },
}));
app.use(express_1.default.urlencoded({ extended: false }));
const MStore = (0, memorystore_1.default)(express_session_1.default);
app.use((0, express_session_1.default)({
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
app.use("/attached_assets", express_1.default.static("attached_assets"));
function log(message, source = "express") {
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
    let capturedJsonResponse = undefined;
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
    await (0, routes_1.registerRoutes)(httpServer, app);
    app.use((err, _req, res, _next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        throw err;
    });
    (0, static_1.serveStatic)(app);
    let port = parseInt(process.env.PORT || "5000", 10);
    const startServer = async (startPort) => {
        let currentPort = startPort;
        while (currentPort < startPort + 100) {
            try {
                await new Promise((resolve, reject) => {
                    const onError = (err) => {
                        if (err.code === 'EADDRINUSE') {
                            httpServer.removeListener('error', onError);
                            reject(err);
                        }
                        else {
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
            }
            catch (err) {
                if (err.code === 'EADDRINUSE') {
                    log(`Port ${currentPort} in use, trying ${currentPort + 1}`);
                    currentPort++;
                }
                else {
                    log(`Server error: ${err.message}`);
                    process.exit(1);
                }
            }
        }
        throw new Error("Could not find an available port");
    };
    await startServer(port);
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
