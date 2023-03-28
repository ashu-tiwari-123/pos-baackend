import express from 'express'
const router= express.Router()

//import user controller
import {UserController} from '../controllers/userController.js'

//import auth middleware
import {authMiddleware} from '../middlewares/auth.js'

//making routes for user controller
router.post('/', UserController.createUser)
router.post('/login', UserController.loginUser)
router.get('/', UserController.getAllUsers)// removed middleware
router.get('/:id', UserController.getUserById)// removed middleware
router.put('/:id', UserController.updateUser)// removed middleware
router.delete('/:id',authMiddleware, UserController.deleteUser)

export default router;