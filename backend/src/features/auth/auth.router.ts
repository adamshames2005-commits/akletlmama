import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { login, signUp } from "./auth.controller.js";
import { loginSchema, signUpSchema } from "./auth.schema.js";

const router = Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/login", validate(loginSchema), login);

export default router;
