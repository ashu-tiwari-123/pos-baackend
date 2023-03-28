import { Ingredient } from "../models/Ingredient.js";
export class IngredientController {
    static addIngredient = async (req, res) => {
        try {
            const ingredient = new Ingredient(req.body);
            await ingredient.save();
            res.status(201).json({ message: "ingredient created successfully", ingredient });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // created by spidy
    static getIngredient = async (req, res) => {
        try {
            const ingredient = await Ingredient.find();
            res.status(200).json({ message: "ingredient fetched", ingredient });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static updateIngredient = async (req, res) => {
        try {
            const { id } = req.params;
            const ingredient = await Ingredient.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
            if (!ingredient) {
                res.status(404).json({ message: "Ingredient not found" });
            } else {
                res.status(200).json({ message: "Ingredient updated", ingredient });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static deleteIngredient = async (req, res) => {
        try {
            const { id } = req.params;
            const ingredient = await Ingredient.findByIdAndDelete(id);
            if (!ingredient) {
                res.status(404).json({ message: "Ingredient not found" });
            } else {
                res.status(200).json({ message: "Ingredient deleted", ingredient });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}