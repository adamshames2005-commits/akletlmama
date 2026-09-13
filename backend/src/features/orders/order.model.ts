import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
  mealId: { type: Schema.Types.ObjectId, required: true },
  mealName: { type: String, required: true },
  size: { type: String, enum: ["individual", "smallPot", "largePot"], required: true },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  deliveryLocation: { type: String, required: true },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "confirmed", "delivered", "cancelled"], default: "pending" },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
