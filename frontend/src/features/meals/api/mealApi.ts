import type {CreateMealInput ,Meal, UpdateMealInput} from "../types/meal.types";

const API_URL = "http://localhost:3000/api/meals";

export const getMeals =async (): Promise<Meal[]> => {
  const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch meals");
    }

    return response.json();
};

export const createMeal = async (mealData: CreateMealInput//(krmel ma nfawet hayala data )
): Promise<Meal> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
    });

    if (!response.ok) {
        throw new Error("Failed to create meal");
    }

    return response.json();
};
export const updateMeal = async (
    id : string,
    mealData: UpdateMealInput
): Promise<Meal> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
    });

    if (!response.ok) {
        throw new Error("Failed to update meal");
    }

    return response.json();
};

export const deleteMeal = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete meal");
    }
};