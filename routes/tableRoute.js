import express from 'express'
const router = express.Router()
 
//import Table controller
import { TableController } from '../controllers/new tableController.js'
import OldTableController from '../controllers/tableController.js'
 
//import auth middleware
import { authMiddleware } from '../middlewares/auth.js'
 
//use auth middleware
// router.use(authMiddleware);
 
//Making routes for the Table controller
//functions are to -- view table, assign waiter, book table, take order, view order, create receipts
router.get('/', TableController.getAllTables);
router.post('/create', OldTableController.createTable);
router.get('/view/:num', TableController.viewTable);
router.post('/assign/:num', TableController.assignWaiter);
router.post('/book/:num', TableController.bookTable);
router.post('/order/:num', TableController.createOrder);
router.get('/order/:num', TableController.viewOrders);
router.post('/receipt/:num', TableController.createReceipts);
 
export default router;