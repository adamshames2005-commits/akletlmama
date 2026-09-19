import type { Meal } from "../../meals/types/meal.types";
import type { SubscriptionSelectionInput, SubscriptionSize } from "../types/subscription.types";

type Props = Readonly<{
  selection: SubscriptionSelectionInput;
  meals: Meal[];
  onChange: (selection: SubscriptionSelectionInput) => void;
  onRemove: () => void;
}>;

const sizeLabels: Record<SubscriptionSize, string> = {
  individual: "Individual",
  smallPot: "Small pot",
  largePot: "Large pot",
};

export default function SubscriptionSelectionRow({ selection, meals, onChange, onRemove }: Props) {
  const meal = meals.find((item) => item._id === selection.mealId);
  const sizes = meal ? (Object.keys(meal.prices) as SubscriptionSize[]).filter((size) => meal.prices[size] !== undefined) : [];

  return (
    <div className="subscription-selection-row">
      <label><span>Date</span><input type="date" value={selection.date} onChange={(event) => onChange({ ...selection, date: event.target.value })} /></label>
      <label><span>Meal</span><select value={selection.mealId} onChange={(event) => onChange({ ...selection, mealId: event.target.value, size: "individual" })}><option value="">Choose a meal</option>{meals.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label>
      <label><span>Size</span><select value={selection.size} onChange={(event) => onChange({ ...selection, size: event.target.value as SubscriptionSize })} disabled={!meal}>{sizes.map((size) => <option key={size} value={size}>{sizeLabels[size]} - ${meal?.prices[size]?.toFixed(2)}</option>)}</select></label>
      <strong className="subscription-row-price">${meal?.prices[selection.size]?.toFixed(2) ?? "0.00"}</strong>
      <button type="button" className="subscription-remove" onClick={onRemove} aria-label="Remove lunch">Remove</button>
    </div>
  );
}