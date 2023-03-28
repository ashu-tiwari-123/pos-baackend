import mongoose from "mongoose";
const { Schema } = mongoose;
import { Customer } from "./Customer.js";
import { Item } from "./Item.js";
import { User } from "./User.js";

const OrderSchema = new Schema(
  {
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
    },
    orderDetails: [
      {
        item: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        note: {
          type: String,
          default: "",
        },
        cost: {
          type: Number,
          require: true,
        },
      },
    ],
    tableNumber: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Ready", "Delivered", "Cancelled"],
      default: "Pending",
    },
    diningType: {
      type: String,
      enum: ["Dine", "Takeaway"],
      default: "Dine",
    },
    billAmt: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    waiter: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
