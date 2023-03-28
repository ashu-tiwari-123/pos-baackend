import { Table } from "../models/Table.js";
import { Item } from "../models/Item.js";
import { Order } from "../models/Order.js";
import { Receipt } from '../models/Receipt.js';
 
export class TableController {
    static getAllTables = async (req, res) => {
        try {
            const tables = await Table.find();
            res.status(200).json(tables);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
 
    static viewTable = async (req, res) => {
        const { num } = req.params;
        try {
            const table = await Table.findOne({ number: num });
            if (!table) return res.status(404).json({ message: "Table not found" });
            res.status(200).json({ message: "Table found", table });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
 
    static assignWaiter = async (req, res) => {
        const { num } = req.params;
        const { waiter } = req.body;
        try {
            const table = await Table.findOne({ number: num });
            if (!table) return res.status(404).json({ message: "Table not found" });
            const waiter = await User.findOne({ employeeCode: waiter });
            if (!waiter) return res.status(404).json({ message: "Waiter not found" });
            table.waiter = waiter;
            await table.save();
            res.status(200).json({ message: "Waiter assigned successfully", table });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
 
    static async bookTable(req, res, next) {
        // we need customer phone number, table number is gotten from params, and date and time
        const { phone, name='' } = req.body;
        const { num } = req.params;
        const cust = await Customer.findOne({ phone: phone });
        if (!cust)
            await Customer.create({phone: phone, name: name});
        const table = await Table.findOne({ number: num });
        try {
            table.customer = cust._id;
            table.status = "occupied";
            await table.save();
            res.status(200).json({ message: "Table booked successfully", table });
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
 
    static createOrder = async (req, res) => {
        const { num } = req.params;
        const table = await Table.findOne({ number: num });
        const { orderDetails } = req.body;
        try {
            const order = new Order({
                customer: table.customer,
                orderDetails: orderDetails,
                tableNumber: num,
                waiter: table.waiter
            });
            await order.save();
            //to make sure that same items are not added as different objects in order
            for (let i = 0; i < orderDetails.length; i++) {
                //find if item exists in order
                const existingItem = order.orderDetails.find((item) => {
                    return item.item === orderDetails[i].item
                });
                if (existingItem) {
                    existingItem.quantity += orderDetails[i].quantity;
                } else {
                    order.orderDetails.push(orderDetails[i]);
                }
            }
 
            //calculate billAmt as well -
            order.billAmt = 0;
            for (let i = 0; i < order.orderDetails.length; i++) {
                const item = await Item.findOne({ name: order.orderDetails[i].item });
                order.billAmt = item ? order.billAmt + item.price * order.orderDetails[i].quantity : order.billAmt;
            }
            console.log("Total bill amt:", order.billAmt);
            await order.save();
            const ticket = new Ticket({
                orderId: order._id,
                order: orderDetails,
                num
            });
            await ticket.save();
            res.status(200).json({ message: "Order created", order });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
 
    static viewOrders = async (req, res) => {
        const { num } = req.params;
        try {
            const table = await Table.findOne({ number: num });   //contains customer id
            const orders = await Order.find({ tableNumber: num, customer: table.customer, paid: false });
            //if customer not specified, will return all orders for that table
            res.status(200).json({ message: "Orders found", orders });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    //TODO: fix create receipts -- must do according to schema
    static createReceipts = async (req, res) => {
        const { num } = req.params;
        try {
            const table = await Table.findOne({ number: num });
            const orders = await Order.find({ tableNumber: num, customer: table.customer, paid: false });
            //current orders for that table and customer
            
            const receipts = [];
            for (let i = 0; i < orders.length; i++) {            
                const receipt = new Receipt({
                    order: orders[i]._id,
                    table:num,
                    customer: table.customer,
                    waiter: table.waiter,
                    billAmt: orders[i].billAmt,
                });
                await receipt.save();
                receipts.push(receipt);
            }
            res.status(200).json({ message: "Receipts created", receipts });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}