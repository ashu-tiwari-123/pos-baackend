import express from "express";
const router = express.Router();

// Import the order controller
import { OrderController } from "../controllers/orderController.js";

// Making routes for the order controller
router.post("/seat/:id", OrderController.seatParty);
router.post("/", OrderController.createOrder);
router.get("/", OrderController.getOrders);
router.get("/table/:tableNumber", OrderController.getOrderByTable);
router.get("/check", OrderController.checkOrder);
router.get("/waiter/:id", OrderController.getActiveOrders);
router.get("/:id", OrderController.getOrderById);
// router.put('/add/:id', OrderController.addToCurrentOrder);
router.put("/:id", OrderController.updateOrder);
// delete order is changed to cancell order it will soft delete the orde and change the status to cancelled
router.put("/stat/:id", OrderController.deleteOrder);
router.put("/status/:id", OrderController.updateStatus);

export default router;
