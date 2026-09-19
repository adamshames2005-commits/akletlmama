import mongoose, { Schema } from "mongoose";

const subscriptionSelectionSchema = new Schema({
  date: { type: String, required: true },
  mealId: { type: Schema.Types.ObjectId, ref: "Meal", required: true },
  size: { type: String, enum: ["individual", "smallPot", "largePot"], required: true },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });

const subscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  selections: { type: [subscriptionSelectionSchema], required: true, validate: (value: unknown[]) => value.length === 20 },
  subtotal: { type: Number, required: true, min: 0 },
  discountPercentage: { type: Number, required: true, min: 0, max: 100 },
  discountAmount: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
}, { timestamps: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);