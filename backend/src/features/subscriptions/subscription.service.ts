import mongoose from "mongoose";
import { Meal } from "../meals/meal.model.js";
import { User } from "../auth/user.model.js";
import { SubscriptionSettings } from "./subscription-settings.model.js";
import { Subscription } from "./subscription.model.js";
import type { CreateSubscriptionInput } from "./subscription.schema.js";

const SETTINGS_KEY = "monthly";

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const isValidDate = (date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date && parsed.getUTCDay() !== 0;
};

export const getSubscriptionDiscount = async () => {
  const settings = await SubscriptionSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $setOnInsert: { key: SETTINGS_KEY, discountPercentage: 0 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
  return settings.discountPercentage;
};

export const updateSubscriptionDiscount = async (discountPercentage: number) => {
  return SubscriptionSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $set: { discountPercentage } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
};

export const createSubscription = async (userId: string, input: CreateSubscriptionInput) => {
  if (!mongoose.isValidObjectId(userId)) throw new Error("Invalid user");
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("Account not found");

  for (const selection of input.selections) {
    if (!isValidDate(selection.date)) throw new Error("Dates must be valid non-Sunday dates");
    if (!mongoose.isValidObjectId(selection.mealId)) throw new Error("Invalid meal id");
  }

  const meals = await Meal.find({ _id: { $in: input.selections.map((selection) => selection.mealId) }, isActive: true }).lean();
  const mealMap = new Map(meals.map((meal) => [meal._id.toString(), meal]));
  const selections = input.selections.map((selection) => {
    const meal = mealMap.get(selection.mealId);
    if (!meal) throw new Error("Meal not found or inactive");
    const price = meal.prices?.[selection.size];
    if (price === undefined) throw new Error(`Selected meal does not have a ${selection.size} price`);
    return { date: selection.date, mealId: meal._id, size: selection.size, price: Number(price) };
  });

  const subtotal = roundMoney(selections.reduce((sum, selection) => sum + selection.price, 0));
  const discountPercentage = await getSubscriptionDiscount();
  const discountAmount = roundMoney(subtotal * discountPercentage / 100);
  const total = roundMoney(subtotal - discountAmount);
  return Subscription.create({ userId, selections, subtotal, discountPercentage, discountAmount, total });
};

export const getUserSubscriptions = async (userId: string) =>
  Subscription.find({ userId }).populate("selections.mealId", "name").sort({ createdAt: -1 }).lean();

export const getUserSubscription = async (userId: string, id: string) =>
  Subscription.findOne({ _id: id, userId }).populate("selections.mealId", "name").lean();

export const getAllSubscriptions = async () =>
  Subscription.find().populate("userId", "name phone").populate("selections.mealId", "name").sort({ createdAt: -1 }).lean();

export const getSubscriptionById = async (id: string) =>
  Subscription.findById(id).populate("userId", "name phone").populate("selections.mealId", "name").lean();