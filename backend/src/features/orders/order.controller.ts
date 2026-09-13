import type { Response } from "express";
import { User } from "../auth/user.model.js";
import { Order } from "./order.model.js";
import type { AuthRequest } from "../../middleware/auth.js";

export const createOrder = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ message: "Account not found" });
  const { items, deliveryLocation, alternatePhone } = req.body;
  const order = await Order.create({
    userId: user._id,
    customerName: user.name,
    customerPhone: alternatePhone || user.phone,
    deliveryLocation,
    items,
    total: items.reduce((sum: number, item: { price: number }) => sum + item.price, 0),
  });
  return res.status(201).json(order);
};

export const getOrders = async (_req: AuthRequest, res: Response) => {
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return res.json(orders);
};

export const getMonthlyTotals = async (_req: AuthRequest, res: Response) => {
  const totals = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, total: { $sum: "$total" }, count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);
  return res.json(totals);
};
