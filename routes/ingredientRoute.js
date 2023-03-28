import express from 'express'
const router = express.Router()

// Import the Ingredient controller
import { IngredientController } from '../controllers/ingredientController.js'

//import auth middleware
import { authMiddleware } from '../middlewares/auth.js'

//use auth middleware
// router.use(authMiddleware);

// Making routes for the Ingredient controller
router.post('/', IngredientController.addIngredient)
router.get('/', IngredientController.getIngredient)
router.put('/:id', IngredientController.updateIngredient)
router.delete('/:id', IngredientController.deleteIngredient)

export default router;