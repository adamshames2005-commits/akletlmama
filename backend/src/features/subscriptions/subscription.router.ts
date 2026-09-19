import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  createSubscription,
  getAdminDiscount,
  getAdminSubscription,
  getAdminSubscriptions,
  getCurrentDiscount,
  getMySubscription,
  getMySubscriptions,
  saveAdminDiscount,
} from "./subscription.controller.js";
import { createSubscriptionSchema, updateSubscriptionDiscountSchema } from "./subscription.schema.js";

const router = Router();

router.get("/discount", requireAuth, getCurrentDiscount);
router.post("/", requireAuth, validate(createSubscriptionSchema), createSubscription);
router.get("/mine", requireAuth, getMySubscriptions);
router.get("/mine/:id", requireAuth, getMySubscription);
router.get("/admin/discount", requireAuth, requireAdmin, getAdminDiscount);
router.patch("/admin/discount", requireAuth, requireAdmin, validate(updateSubscriptionDiscountSchema), saveAdminDiscount);
router.get("/admin", requireAuth, requireAdmin, getAdminSubscriptions);
router.get("/admin/:id", requireAuth, requireAdmin, getAdminSubscription);

export default router;