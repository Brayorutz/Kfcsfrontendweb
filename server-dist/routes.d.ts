import type { Express } from "express";
import { type Server } from "http";
declare module "express-session" {
    interface SessionData {
        userId: string;
        role: "manager" | "director";
    }
}
export declare function registerRoutes(httpServer: Server, app: Express): Promise<Server>;
