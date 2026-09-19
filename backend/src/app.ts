import express from "express";
import cors from "cors";
import mealRouter from "./features/meals/meal.router.js";
import authRouter from "./features/auth/auth.router.js";
import userRouter from "./features/auth/user.router.js";
import orderRouter from "./features/orders/order.router.js";
import subscriptionRouter from "./features/subscriptions/subscription.router.js";

const app = express();


app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("api is running")
})

app.use("/api/meals", mealRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/subscriptions", subscriptionRouter);



export default app;