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
    const [isDaily, setIsDaily] = useState<boolean>(false);

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
            isDaily,
        });

        onMealCreated(newMeal);

        setName("");
        setDescription("");
        setIndividualPrice("");
        setSmallPotPrice("");
        setLargePotPrice("");
        setImageUrl("");
        setIsDaily(false);
    };

    return (
        <div>
            <h2>Create New Meal</h2>
            <form
             className="meal-form"
             onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="meal-name">Name:</label>
                    <input
                    id="meal-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="meal-description">Description:</label>
                    <input
                    id="meal-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image-url">Image URL:</label>
                    <input
                    id="image-url"
                    value={imageUrl}
                    type="text"
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="meal-daily">
                        <input
                        id="meal-daily"
                        type="checkbox"
                        checked={isDaily}
                        onChange={(e) => setIsDaily(e.target.checked)}
                        /> <span>Include in today's menu</span>
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="individual-price">Individual Price:</label>
                    <input
                    id="individual-price"
                    type="number"
                    value={individualPrice}
                    onChange={(e) => setIndividualPrice(
                        e.target.value )}
                    
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="small-pot-price">Small Pot Price:</label>
                    <input
                    id="small-pot-price"
                    type="number"
                    value={smallPotPrice}
                    onChange={(e) => setSmallPotPrice(
                        e.target.value )}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="large-pot-price">Large Pot Price:</label>
                    <input
                    id="large-pot-price"
                    type="number"
                    value={largePotPrice}
                    onChange={(e) => setLargePotPrice(
                        e.target.value)}
                    />
                </div>
                <div className ="form-actions">
                <button 
                className="btn btn-primary"
                type="submit"
                >
                    Create Meal
                </button>
                </div>
            </form>
        </div>
    );
}

export default MealForm;