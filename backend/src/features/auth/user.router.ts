import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { deleteUser, getUsers, updateUser } from "./user.controller.js";

const router = Router();
router.use(requireAuth, requireAdmin);
router.get("/", getUsers);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
export default router;
