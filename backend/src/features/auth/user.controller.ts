import type { Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "./user.model.js";
import type { AuthRequest } from "../../middleware/auth.js";

export const getUsers = async (_req: AuthRequest, res: Response) => res.json(await User.find().select("name phone role createdAt").sort({ createdAt: -1 }).lean());

export const updateUser = async (req: AuthRequest, res: Response) => {
  const updates: Record<string, string> = {};
  if (typeof req.body.name === "string") updates.name = req.body.name;
  if (typeof req.body.phone === "string") updates.phone = req.body.phone;
  if (typeof req.body.role === "string") updates.role = req.body.role;
  if (typeof req.body.password === "string" && req.body.password.length >= 8) updates.passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("name phone role createdAt").lean();
  return user ? res.json(user) : res.status(404).json({ message: "User not found" });
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  if (req.params.id === req.userId) return res.status(400).json({ message: "You cannot delete your own account" });
  const user = await User.findByIdAndDelete(req.params.id);
  return user ? res.json({ message: "User deleted" }) : res.status(404).json({ message: "User not found" });
};
