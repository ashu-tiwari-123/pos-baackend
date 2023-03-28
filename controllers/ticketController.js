import { Ticket } from "../models/Ticket.js";
import { Order } from "../models/Order.js";

export class TicketController {
    static getTickets = async (req, res) => {
        try {
            const tickets = await Ticket.find();
            res.status(200).json({ message: "Tickets fetched", tickets });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static updateStatus = async (req, res) => {
        const {id} = req.params;
        try {
            const ticket = await Ticket.findById(id);
            if(!ticket) return res.status(404).json({ message: "Ticket not found"});
            else{
                if(ticket.status === "Pending"){
                    ticket.status = "Ready";
                    await ticket.save();
                    const order = await Order.findByIdAndUpdate(ticket.orderId, {orderStatus: "Ready"},{new: true, runValidators: true});
                    res.status(200).json({ message: "Ticket updated", ticket });
                }
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}