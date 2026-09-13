import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthRequest = Request & { userId?: string; userRole?: "customer" | "admin" };

const secret = () => process.env.JWT_SECRET ?? "development-secret";

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    const payload = jwt.verify(token, secret()) as { sub?: string; role?: "customer" | "admin" };
    if (!payload.sub) return res.status(401).json({ message: "Invalid token" });
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};
