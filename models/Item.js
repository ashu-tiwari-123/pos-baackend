import mongoose from "mongoose";
import { Ingredient } from "./Ingredient.js";
const {Schema} = mongoose;

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: "Other",
    },
    ingredients:[{
        name:{
            type: String,
            ref: Ingredient,
            required:true
        },
        quantity:{
            type: Number,
            required:true
        }
    }]
});

export const Item = mongoose.model("Item", ItemSchema);