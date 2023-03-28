import mongoose from "mongoose";
const {Schema} = mongoose;
import {Order} from "./Order.js";

const TicketSchema = new Schema({
    orderId:{
        type: mongoose.Types.ObjectId,
        ref: "Order"
    },
    order: {
        type: Array,
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum:["Pending","Ready"],
        default: "Pending"
    }
}, {timestamps: true});

export const Ticket = mongoose.model("Ticket", TicketSchema);