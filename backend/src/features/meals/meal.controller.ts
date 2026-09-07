import type { Request, Response } from "express";
import { MongoServerError } from "mongodb";

import {
    createMealService,
    getMealsService,
    getMealByIdService,
    updateMealService,
    deleteMealService
}from "./meal.service.js";

export const createMeal = async (req: Request, res: Response) => {
    try {
        const meal = await createMealService(req.body);
        res.status(201).json(meal);
    } catch (error) {
          if (error instanceof MongoServerError && error.code === 11000) {
            return res.status(409).json({
        message: "A meal with this name already exists",
        });
  }

        
        console.error("CREATE MEAL ERROR:", error);
        
        res.status(500).json({ message: "Failed to create meal", error });
    }
};

export const getMeals = async (req: Request, res: Response) => {
    try {
        const meals = await getMealsService();
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch meals", error });
    }
};

export const getMealById = async (req: Request, res: Response) => {
    try {
         
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid meal id",
      });
    }
        const meal = await getMealByIdService(id);
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }
        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ message: "Failed to get meal", error });
    }
};

export const updateMeal = async (req: Request, res: Response) => {
    try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid meal id",
      });
    }
        const meal = await updateMealService(id, req.body);
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }
        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ message: "Failed to update meal", error });
    }
};

export const deleteMeal = async (req: Request, res: Response) => {
    try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid meal id",
      });
    }
        const meal = await deleteMealService(id);
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }
        res.status(200).json({ message: "Meal deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete meal", error });
    }
};