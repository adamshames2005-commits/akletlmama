import mongoose, { Schema } from "mongoose";

const subscriptionSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "monthly" },
    discountPercentage: { type: Number, required: true, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

export const SubscriptionSettings = mongoose.model("SubscriptionSettings", subscriptionSettingsSchema);