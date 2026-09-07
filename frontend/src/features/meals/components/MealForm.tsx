import {useState} from "react";
import {createMeal} from "../api/mealApi";
import type {Meal} from "../types/meal.types";

type MealFormProps = {
    onMealCreated: (meal: Meal) => void;
};

const MealForm = ({ onMealCreated }: MealFormProps) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [individualPrice, setIndividualPrice] = useState<number | undefined>(undefined);
    const [smallPotPrice, setSmallPotPrice] = useState<number | undefined>(undefined);
    const [largePotPrice, setLargePotPrice] = useState<number | undefined>(undefined);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const newMeal = await createMeal({
            name,
            description,
            prices: {
                ...(individualPrice !== undefined &&
                     { individual: Number(individualPrice)

                      }),
                ...(smallPotPrice !== undefined &&
                     { smallPot: Number(smallPotPrice)

                      }),
                ...(largePotPrice !== undefined &&
                     { largePot: Number(largePotPrice)

                      }),
            },
        });

        onMealCreated(newMeal);

        setName("");
        setDescription("");
        setIndividualPrice(undefined);
        setSmallPotPrice(undefined);
        setLargePotPrice(undefined);
    };

    return (
        <div>
            <h2>Create New Meal</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="meal-name">Name:</label>
                    <input
                    id="meal-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="meal-description">Description:</label>
                    <input
                    id="meal-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="individual-price">Individual Price:</label>
                    <input
                    id="individual-price"
                    type="number"
                    value={individualPrice}
                    onChange={(e) => setIndividualPrice(e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>
                <div>
                    <label htmlFor="small-pot-price">Small Pot Price:</label>
                    <input
                    id="small-pot-price"
                    type="number"
                    value={smallPotPrice}
                    onChange={(e) => setSmallPotPrice(e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>
                <div>
                    <label htmlFor="large-pot-price">Large Pot Price:</label>
                    <input
                    id="large-pot-price"
                    type="number"
                    value={largePotPrice}
                    onChange={(e) => setLargePotPrice(e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>
                <button type="submit">Create Meal</button>
            </form>
        </div>
    );
}

export default MealForm;