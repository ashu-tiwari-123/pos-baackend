import mongoose from "mongoose";
import { Order } from "./Order.js";
import { Customer } from "./Customer.js";
import { User } from "./User.js";

const { Schema } = mongoose;

const ReceiptSchema = new Schema({
    order: {
        type: mongoose.Types.ObjectId,
        ref: "Order"
    },
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "Customer"
    },
    waiter: {
        type: String,
        required: true
    },
    billAmt: {
        type: Number,
        required: true
    },
    tip: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    paid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Receipt = mongoose.model("Receipt", ReceiptSchema);