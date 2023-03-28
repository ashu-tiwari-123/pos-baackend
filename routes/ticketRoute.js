import express from 'express'
const router = express.Router()

// Import the ticket controller
import { TicketController } from '../controllers/ticketController.js'

// Making routes for the ticket controller
router.get('/', TicketController.getTickets)
router.put('/:id', TicketController.updateStatus)

export default router;