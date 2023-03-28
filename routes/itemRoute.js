import express from "express";
const router = express.Router();

// Import the item controller
import { ItemController } from "../controllers/itemController.js";

//import auth middleware
import { authMiddleware } from "../middlewares/auth.js";

// Making routes for the item controller
router.post("/", ItemController.createItem);
router.get("/", ItemController.getItems);
router.get("/categories", ItemController.getCategories);
router.get("/:id", ItemController.getItemById);
router.put("/:id", ItemController.updateItem);
router.delete("/:id", authMiddleware, ItemController.deleteItem);

export default router;
