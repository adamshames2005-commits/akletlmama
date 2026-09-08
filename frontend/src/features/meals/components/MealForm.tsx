import {useState} from "react";
import {createMeal} from "../api/mealApi";
import type {Meal} from "../types/meal.types";

type MealFormProps = {
    onMealCreated: (meal: Meal) => void;
};

const MealForm = ({ onMealCreated }: MealFormProps) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [individualPrice, setIndividualPrice] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [smallPotPrice, setSmallPotPrice] = useState<string>("");
    const [largePotPrice, setLargePotPrice] = useState<string>("");

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const newMeal = await createMeal({
            name,
            description,
            imageUrl: imageUrl || undefined,
            prices: {
                ...(individualPrice !== "" &&
                     { individual: Number(individualPrice)

                      }),
                      //... used like if true individual=number(individualPrice) else nothing
                ...(smallPotPrice !== "" &&
                     { smallPot: Number(smallPotPrice)

                      }),
                ...(largePotPrice !== "" &&
                     { largePot: Number(largePotPrice)

                      }),
            },
        });

        onMealCreated(newMeal);

        setName("");
        setDescription("");
        setIndividualPrice("");
        setSmallPotPrice("");
        setLargePotPrice("");
        setImageUrl("");
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
                    <label htmlFor="image-url">Image URL:</label>
                    <input
                    id="image-url"
                    value={imageUrl}
                    type="text"
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    />
                </div>
                <div>
                    <label htmlFor="individual-price">Individual Price:</label>
                    <input
                    id="individual-price"
                    type="number"
                    value={individualPrice}
                    onChange={(e) => setIndividualPrice(
                        e.target.value )}
                    
                    />
                </div>
                <div>
                    <label htmlFor="small-pot-price">Small Pot Price:</label>
                    <input
                    id="small-pot-price"
                    type="number"
                    value={smallPotPrice}
                    onChange={(e) => setSmallPotPrice(
                        e.target.value )}
                    />
                </div>
                <div>
                    <label htmlFor="large-pot-price">Large Pot Price:</label>
                    <input
                    id="large-pot-price"
                    type="number"
                    value={largePotPrice}
                    onChange={(e) => setLargePotPrice(
                        e.target.value)}
                    />
                </div>
                <button type="submit">Create Meal</button>
            </form>
        </div>
    );
}

export default MealForm;