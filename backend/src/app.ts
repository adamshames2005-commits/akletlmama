import express from "express";
import cors from "cors";
import mealRouter from "./features/meals/meal.router.js";
import authRouter from "./features/auth/auth.router.js";

const app = express();


app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("api is running")
})

app.use("/api/meals", mealRouter);
app.use("/api/auth", authRouter);



export default app;