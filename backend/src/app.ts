import express from "express";
import cors from "cors";
import mealRouter from "./features/meals/meal.router.js";

const app = express();


app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("api is running")
})

app.use("/api/meals", mealRouter);



export default app;