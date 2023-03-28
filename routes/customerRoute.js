import express from 'express';
const router = express.Router();

//Import auth middleware
import { authMiddleware } from '../middlewares/auth.js';
// Import the customer controller
import { CustomerController } from '../controllers/customerController.js';

//Use auth middleware
router.use(authMiddleware);

//Making routes for the customer controller
router.post('/', CustomerController.createCustomer);
router.get('/', CustomerController.getCustomer);
router.get('/:id', CustomerController.getCustomerById);
router.put('/:id', CustomerController.updateCustomer);
router.delete('/:id', CustomerController.deleteCustomer);

export default router;