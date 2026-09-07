import { Router } from "express";

import {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
} from "./meal.controller.js";

import { validate } from "../../middleware/validate.js";
import { createMealSchema, updateMealSchema } from "./meal.schema.js";


const router = Router();

router.post(
  "/",
  validate(createMealSchema),
  createMeal
);

router.get("/", getMeals);

router.get("/:id", getMealById);

router.patch(
  "/:id",
  validate(updateMealSchema),
  updateMeal
);

router.delete("/:id", deleteMeal);

export default router;