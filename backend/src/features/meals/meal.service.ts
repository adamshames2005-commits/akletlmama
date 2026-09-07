import {Meal} from "./meal.model.js";

import type { 
    CreateMealInput,
    UpdateMealInput,

 }from "./meal.schema.js";
    
export const createMealService = async (mealData: CreateMealInput ) => {
    return await Meal.create(mealData);
}

export const getMealsService = async () => {
    return await Meal.find();
}

export const getMealByIdService = async (id: string) => {
    return await Meal.findById(id);
}

export const updateMealService = async (id: string, mealData: UpdateMealInput) => {
    return await Meal.findByIdAndUpdate(id, mealData,
        { 
            new: true,//to return the updated document not the original one
            runValidators: true//to run the validators defined in the schema
        });
}

export const deleteMealService = async (id: string) => {
    return await Meal.findByIdAndDelete(id);
}