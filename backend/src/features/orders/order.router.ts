import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { createOrder, getMonthlyTotals, getOrders } from "./order.controller.js";
import { createOrderSchema } from "./order.schema.js";

const router = Router();
router.post("/", requireAuth, validate(createOrderSchema), createOrder);
router.get("/", requireAuth, requireAdmin, getOrders);
router.get("/monthly-totals", requireAuth, requireAdmin, getMonthlyTotals);
export default router;
