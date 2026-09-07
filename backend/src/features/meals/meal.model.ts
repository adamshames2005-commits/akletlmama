import mongoose ,{ Schema } from "mongoose";


const mealSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    }, 
    imageUrl:{
        type:String,
    },

    prices:{
        individual:{
            type:Number,
            min:0,
        },
        smallPot:{
            type:Number,
            min:0,
        },
         largePot:{
            type:Number,
            min:0,
        },
    },

    isActive:{
        type:Boolean,
        default:true,
    },
},
{
    timestamps: true,
}
)

export const Meal = mongoose.model("Meal", mealSchema);