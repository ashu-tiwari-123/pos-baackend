import { Item } from "../models/Item.js";
export class ItemController {
  static createItem = async (req, res) => {
    try {
      const { name, price, category } = req.body;
      const item = new Item({
        name,
        price,
        category,
      });
      await item.save();
      res.status(201).json({ message: "Item created successfully", item });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static getItems = async (req, res) => {
    try {
      const items = await Item.find();
      res.status(200).json({ message: "Items fetched", items });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static getItemById = async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id });
      if (!item) {
        res.status(404).json({ message: "Item not found" });
      } else {
        res.status(200).json( item );
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static updateItem = async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) {
        res.status(404).json({ message: "Item not found" });
      } else {
        res.status(200).json({ message: "Item updated", item });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static deleteItem = async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findByIdAndDelete(id);
      if (!item) {
        res.status(404).json({ message: "Item not found" });
      } else {
        res.status(200).json({ message: "Item deleted", item });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static getCategories = async (req, res) => {
    try {
      const categories = await Item.find().distinct("category");
      res.status(200).json({ message: "Categories fetched", categories });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
