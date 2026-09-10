import type { Meal } from "../types/meal.types";
import "./MealCard.css";

type MealCardProps = {
  meal: Meal;
};

export default function MealCard({ meal }: MealCardProps) {
  const availablePrices = Object.values(meal.prices).filter(
    (price): price is number => price !== undefined
  );

  const startingPrice = Math.min(...availablePrices);

  return (
    <article className="meal-card">
      <div className="meal-card-image">
        {meal.imageUrl ? (
          <img src={meal.imageUrl} alt={meal.name} />
        ) : (
          <div className="meal-card-placeholder">🍲</div>
        )}
      </div>

      <div className="meal-card-content">
        <h3>{meal.name}</h3>

        <p>{meal.description}</p>

        <div className="meal-card-footer">
          <strong>From ${startingPrice}</strong>

          <button type="button">
            View Meal
          </button>
        </div>
      </div>
    </article>
  );
}