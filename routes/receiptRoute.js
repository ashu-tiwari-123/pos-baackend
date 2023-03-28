import express from 'express'
import { ReceiptController } from "../controllers/receiptController.js";

const router = express.Router()

//Making routes for the receipt controller
router.get('/:id',ReceiptController.showReceipt);   //id is receipt ID
router.post('/create/:id', ReceiptController.createReceipt);    //id here is order id
// router.post('/create/customer/:id', ReceiptController.createReceiptsFromCustomer); //id here is customer id
// router.post('/create/table/:num', ReceiptController.createReceiptForTable); //id here is table id
router.post('/pay/:id', ReceiptController.payBill); //id here is receipt id

export default router;