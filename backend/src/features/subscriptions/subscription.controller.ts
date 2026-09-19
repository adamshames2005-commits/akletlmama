import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import {
  createSubscription as createSubscriptionService,
  getAllSubscriptions,
  getSubscriptionById,
  getSubscriptionDiscount,
  getUserSubscription,
  getUserSubscriptions,
  updateSubscriptionDiscount,
} from "./subscription.service.js";

export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await createSubscriptionService(req.userId ?? "", req.body);
    return res.status(201).json(subscription);
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Could not create subscription" });
  }
};

export const getMySubscriptions = async (req: AuthRequest, res: Response) => {
  return res.json(await getUserSubscriptions(req.userId ?? ""));
};

export const getMySubscription = async (req: AuthRequest, res: Response) => {
  const id = typeof req.params.id === "string" ? req.params.id : "";
  const subscription = await getUserSubscription(req.userId ?? "", id);
  if (!subscription) return res.status(404).json({ message: "Subscription not found" });
  return res.json(subscription);
};

export const getCurrentDiscount = async (_req: AuthRequest, res: Response) => {
  return res.json({ discountPercentage: await getSubscriptionDiscount() });
};

export const getAdminDiscount = async (_req: AuthRequest, res: Response) => {
  return res.json({ discountPercentage: await getSubscriptionDiscount() });
};

export const saveAdminDiscount = async (req: AuthRequest, res: Response) => {
  return res.json(await updateSubscriptionDiscount(req.body.discountPercentage));
};

export const getAdminSubscriptions = async (_req: AuthRequest, res: Response) => {
  return res.json(await getAllSubscriptions());
};

export const getAdminSubscription = async (req: AuthRequest, res: Response) => {
  const id = typeof req.params.id === "string" ? req.params.id : "";
  const subscription = await getSubscriptionById(id);
  if (!subscription) return res.status(404).json({ message: "Subscription not found" });
  return res.json(subscription);
};