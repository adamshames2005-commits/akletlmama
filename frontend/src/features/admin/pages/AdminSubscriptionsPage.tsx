import { useEffect, useState } from "react";
import { getAdminSubscriptionDiscount, getAdminSubscriptions, updateAdminSubscriptionDiscount } from "../../subscriptions/api/subscriptionApi";
import type { Subscription } from "../../subscriptions/types/subscription.types";
import type { Meal } from "../../meals/types/meal.types";
import "./AdminSubscriptionsPage.css";

const mealName = (value: string | Meal) => typeof value === "string" ? value : value.name;
const customerName = (value: Subscription["userId"]) => typeof value === "string" ? value : `${value.name} (${value.phone})`;

export default function AdminSubscriptionsPage() {
  const [discount, setDiscount] = useState(0);
  const [discountInput, setDiscountInput] = useState("0");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    Promise.all([getAdminSubscriptionDiscount(), getAdminSubscriptions()]).then(([loadedDiscount, loadedSubscriptions]) => {
      setDiscount(loadedDiscount); setDiscountInput(String(loadedDiscount)); setSubscriptions(loadedSubscriptions);
    }).catch((reason: Error) => setError(reason.message));
  }, []);

  const saveDiscount = async (event: { preventDefault: () => void }) => {
    event.preventDefault(); setError(""); setFeedback("");
    const value = Number(discountInput);
    if (!Number.isFinite(value) || value < 0 || value > 100) { setError("Discount must be between 0 and 100."); return; }
    try { const saved = await updateAdminSubscriptionDiscount(value); setDiscount(saved); setDiscountInput(String(saved)); setFeedback("Discount saved."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save discount"); }
  };

  return <section className="admin-page"><div className="admin-content">
    <div className="page-header"><div><h1>Subscriptions</h1><p>Manage the monthly plan and customer subscriptions.</p></div></div>
    <div className="admin-card subscription-discount-card"><div><h2>Monthly Subscription Discount</h2><p>Current discount: {discount}%</p></div><form onSubmit={saveDiscount}><label><span>Discount</span><input type="number" min="0" max="100" step="0.01" value={discountInput} onChange={(event) => setDiscountInput(event.target.value)} /></label><span>%</span><button className="btn btn-edit" type="submit">Save Discount</button></form></div>
    <p className="admin-feedback">{error || feedback}</p>
    <div className="admin-card"><h2>All Monthly Subscriptions</h2><div className="subscription-admin-table-wrap"><table className="admin-data-table"><thead><tr><th>Customer</th><th>Created</th><th>Lunches</th><th>Subtotal</th><th>Discount</th><th>Total</th><th>Status</th></tr></thead><tbody>{subscriptions.map((subscription) => <tr key={subscription._id}><td>{customerName(subscription.userId)}</td><td>{new Date(subscription.createdAt).toLocaleDateString()}</td><td><details><summary>View 20 lunches</summary><ul>{subscription.selections.map((selection, index) => <li key={`${subscription._id}-${index}`}>{selection.date} - {mealName(selection.mealId)} - {selection.size} (${selection.price.toFixed(2)})</li>)}</ul></details></td><td>${subscription.subtotal.toFixed(2)}</td><td>{subscription.discountPercentage}% (-${subscription.discountAmount.toFixed(2)})</td><td>${subscription.total.toFixed(2)}</td><td>{subscription.status}</td></tr>)}</tbody></table></div>{subscriptions.length === 0 && <p>No monthly subscriptions yet.</p>}</div>
  </div></section>;
}