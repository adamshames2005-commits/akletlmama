import { useEffect, useState } from "react";
import { getMeals } from "../../meals/api/mealApi";
import type { Meal } from "../../meals/types/meal.types";
import { createSubscription, getSubscriptionDiscount } from "../api/subscriptionApi";
import SubscriptionSelectionRow from "../components/SubscriptionSelectionRow";
import type { SubscriptionSelectionInput } from "../types/subscription.types";
import "../components/SubscriptionSelectionRow.css";
import "./MonthlySubscriptionPage.css";

const emptySelection = (): SubscriptionSelectionInput => ({ date: "", mealId: "", size: "individual" });
const isSunday = (date: string) => date !== "" && new Date(`${date}T00:00:00.000Z`).getUTCDay() === 0;

export default function MonthlySubscriptionPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [discount, setDiscount] = useState(0);
  const [selections, setSelections] = useState<SubscriptionSelectionInput[]>([emptySelection()]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getMeals(), getSubscriptionDiscount()])
      .then(([loadedMeals, loadedDiscount]) => { setMeals(loadedMeals.filter((meal) => meal.isActive)); setDiscount(loadedDiscount); })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const updateSelection = (index: number, selection: SubscriptionSelectionInput) => {
    if (isSunday(selection.date)) { setError("Sunday delivery dates are not available."); return; }
    setError("");
    setSelections((current) => current.map((item, itemIndex) => itemIndex === index ? selection : item));
  };

  const subtotal = selections.reduce((total, selection) => {
    const meal = meals.find((item) => item._id === selection.mealId);
    return total + (meal?.prices[selection.size] ?? 0);
  }, 0);
  const discountAmount = subtotal * discount / 100;
  const total = subtotal - discountAmount;
  const isComplete = selections.length === 20 && selections.every((selection) => selection.date && !isSunday(selection.date) && selection.mealId && meals.find((meal) => meal._id === selection.mealId)?.prices[selection.size] !== undefined);

  const submit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError(""); setSuccess("");
    if (!isComplete) { setError("Choose 20 valid lunches before submitting."); return; }
    setIsSubmitting(true);
    try { await createSubscription(selections); setSuccess("Your monthly subscription was created."); setSelections([emptySelection()]); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not create subscription"); }
    finally { setIsSubmitting(false); }
  };

  return <section className="subscription-page"><div className="subscription-content">
    <div className="page-header"><div><span className="section-label">Monthly plan</span><h1>Monthly Subscription</h1><p>20 lunches per month, planned around your days.</p></div><strong className="subscription-progress">{selections.length} / 20 selected</strong></div>
    <form onSubmit={submit}>
      <div className="subscription-card"><div className="subscription-card-heading"><h2>Choose your lunches</h2><p>Sunday dates are unavailable. Meals may repeat.</p></div>{selections.map((selection, index) => <SubscriptionSelectionRow key={index} selection={selection} meals={meals} onChange={(next) => updateSelection(index, next)} onRemove={() => setSelections((current) => current.filter((_, itemIndex) => itemIndex !== index))} />)}{selections.length < 20 && <button className="subscription-add" type="button" onClick={() => setSelections((current) => [...current, emptySelection()])}>+ Add lunch</button>}</div>
      <div className="subscription-summary"><h2>Summary</h2><p>{selections.length} / 20 lunches</p><div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><div><span>Current discount ({discount}%)</span><strong>-${discountAmount.toFixed(2)}</strong></div><div className="subscription-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>{error && <p className="subscription-error" role="alert">{error}</p>}{success && <p className="subscription-success" role="status">{success}</p>}<button className="subscription-submit" type="submit" disabled={!isComplete || isSubmitting}>{isSubmitting ? "Submitting..." : "Create subscription"}</button></div>
    </form>
  </div></section>;
}