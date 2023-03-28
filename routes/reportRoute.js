import express from 'express'
const router = express.Router()

//Import the report controller
import { ReportController } from '../controllers/reportController.js'

//import auth middleware
import { authMiddleware } from '../middlewares/auth.js'

//use auth middleware
router.use(authMiddleware);

//Making routes for the report controller
router.get('/sales', ReportController.getSalesReport);
router.get('/inventory', ReportController.getInventory);
router.get('/popular', ReportController.getPopularItems);
router.get('/loyalCustomers', ReportController.getLoyalCustomers);
router.get('/performance', ReportController.getStaffPerformance);


export default router;