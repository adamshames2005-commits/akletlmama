import type { Request, Response } from "express";
import { MongoServerError } from "mongodb";
import { loginUser, registerUser } from "./auth.service.js";

export const signUp = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return res.status(409).json({ message: "An account already exists for this phone number" });
    }
    console.error("SIGN UP ERROR:", error);
    return res.status(500).json({ message: "Could not create account" });
  }
};

export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  if (!result) return res.status(401).json({ message: "Phone number or password is incorrect" });
  return res.status(200).json(result);
};
