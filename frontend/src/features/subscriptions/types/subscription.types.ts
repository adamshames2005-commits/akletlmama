import type { Meal } from "../../meals/types/meal.types";

export type SubscriptionSize = "individual" | "smallPot" | "largePot";

export type SubscriptionSelectionInput = {
  date: string;
  mealId: string;
  size: SubscriptionSize;
};

export type SubscriptionSelection = SubscriptionSelectionInput & {
  price: number;
  mealId: string | Meal;
};

export type Subscription = {
  _id: string;
  userId: string | { _id: string; name: string; phone: string };
  selections: SubscriptionSelection[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};