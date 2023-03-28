import { Order } from "../models/Order.js";
import { Receipt } from "../models/Receipt.js";
import { Customer } from "../models/Customer.js";
import { User } from "../models/User.js";
import { Item } from "../models/Item.js";
import { Ingredient } from "../models/Ingredient.js";

export class ReportController {
    //should give report based on monthly, daily or weekly as per query
    static getSalesReport = async (req, res) => {
        const { timeframe } = req.query;
        // console.log(timeframe);
        let startDate, endDate;
        switch (timeframe) {
            case 'day':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'week':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                startDate.setDate(startDate.getDate() - startDate.getDay());
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'month':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                startDate.setDate(1);
                endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + 1);
                endDate.setDate(0);
                endDate.setHours(23, 59, 59, 999);
                break;
            default:
                return res.status(400).json({ message: 'Invalid timeframe parameter' });
        }
        // console.log(startDate)
        // console.log(endDate);
        try {
            const receipts = await Receipt.find({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                },
                paid: true
            });
            // console.log(orders);
            let totalSales = receipts.reduce((acc, receipt) => acc + receipt.billAmt, 0);
            res.status(200).json({ receipts, totalSales: totalSales });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //old function
    /* static getSalesReport = async (req, res) => {
        try {
            const orders = await Order.find({
                createdAt: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                }
            });
            // console.log(orders);
            let totalSales = orders.filter(order => order.paid === true).reduce((acc, order) => acc + order.billAmt, 0);
            res.status(200).json({orders: orders, totalSales: totalSales });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } */

    static getInventory = async (req, res) => {
        try {
            const inventory = await Ingredient.find();
            res.status(200).json({ inventory: inventory });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static getPopularItems = async (req, res) => {
        try {
            const items = await Item.find();
            let orderMap = new Map();
            for (let item of items) {
                orderMap.set(item.name, 0);
            }
            const orders = await Order.find({
                createdAt: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                }
            });
            // console.log("FOR GENERATING POPULAR ITEMS:",orders)
            for (let order of orders) {
                for (let element of order.orderDetails) {
                    // console.log(element.item,element.quantity)
                    orderMap.set(element.item, orderMap.get(element.item) + element.quantity);
                }
            }
            orderMap = [...orderMap.entries()].sort((a, b) => b[1] - a[1]);
            orderMap = orderMap.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
            res.status(200).json({ popularItems: orderMap });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static getLoyalCustomers = async (req, res) => {
        try {
            let customers = await Customer.find().select('name phone numTimesDined');
            
            //sorting to get the filtered customers in descending order
            customers = customers.sort((a, b) => b.numTimesDined - a.numTimesDined);
            
            let tierOne = customers.filter((customer)=>customer.numTimesDined>5 && customer.numTimesDined<=10);
            let tierTwo = customers.filter((customer)=>customer.numTimesDined>10 && customer.numTimesDined<=15);
            let tierThree = customers.filter((customer)=>customer.numTimesDined>15);
            
            res.status(200).json({ tierOne: tierOne, tierTwo: tierTwo, tierThree: tierThree });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static getStaffPerformance = async (req, res) => {
        try {
            const staff = await User.find({ role: 'Waiter' }).select('name rating numOrders');
            res.status(200).json({ staff: staff });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}