import mongoose from "mongoose";
const {Schema} = mongoose;

const IngredientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
});

export const Ingredient = mongoose.model("Ingredient", IngredientSchema);
