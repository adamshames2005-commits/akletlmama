import {useEffect, useState} from "react";
import {getMeals} from "../api/mealApi";
import type {Meal} from "../types/meal.types";
import MealForm from "../components/MealForm";

const AdminMealsPage = () => {
    
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMeals = async () => {
            try {
                const data = await getMeals();
                setMeals(data);
            } catch  {
                setError("Failed to fetch meals");
            } finally {
                setLoading(false);
            }
        };

        loadMeals();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleMealCreated = (newMeal: Meal) => {
  setMeals((currentMeals) => [...currentMeals, newMeal]);
};

    return (
        <div>
            <h1>Meals</h1>

            <MealForm onMealCreated={handleMealCreated} />
            
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Individual</th>
                        <th>Small Pot</th>
                        <th>Large Pot</th>
                        <th>Active</th>
                    </tr>
                </thead>
                <tbody>
                    {meals.map((meal) => (
                        <tr key={meal._id}>
                            <td>{meal.name}</td>
                            <td>{meal.prices.individual ?? "-"}</td>
                            <td>{meal.prices.smallPot ?? "-"}</td>
                            <td>{meal.prices.largePot ?? "-"}</td>
                            <td>{meal.isActive ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}; 

export default AdminMealsPage;