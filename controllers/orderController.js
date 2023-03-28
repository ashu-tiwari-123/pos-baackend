import { Item } from "../models/Item.js";
import { Order } from "../models/Order.js";
import { Customer } from "../models/Customer.js";
import { Table } from "../models/Table.js";
import { User } from "../models/User.js";
import { Ingredient } from "../models/Ingredient.js";
import { Ticket } from "../models/Ticket.js";
export class OrderController {
  static seatParty = async (req, res) => {
    try {
      const { id } = req.params;
      const { partySize } = req.body;
      const customer = await Customer.findById(id);
      if (!customer)
        return res.status(404).json({ message: "Customer not found" });
      customer.partySize = partySize;
      await customer.save();
      const tables = await Table.find({ status: "free" }).sort({ seats: 1 });
      for (let table of tables) {
        if (table.seats >= partySize) {
          table.status = "occupied";
          table.customer = id;
          await table.save();
          // customer.sizeOfParty = partySize;
          // await customer.save();
          break;
        } else {
          table.status = "occupied";
          table.customer = id;
          await table.save();
          partySize -= table.seats;
        }
      }
      res.status(200).json({ message: "Party seated", customer });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static createOrder = async (req, res) => {
    const { orderDetails, tableNumber, waiter, billAmt, diningType } = req.body;
    //orderDetails:[item,quantity]
    try {
      // const table = await Table.find({ number: tableNumber });
      const wait = await User.findOne({ employeeCode: waiter });
      if (!wait || billAmt == 0) {
        return res
          .status(404)
          .json({ message: "Waiter code incorrect or No items found" });
      } else {
        const order = new Order({
          tableNumber,
          orderDetails: [],
          billAmt: billAmt,
          waiter,
        });
        //to make sure that same items are not added as different objects in order
        for (let i = 0; i < orderDetails.length; i++) {
          //find if item exists in order
          const existingItem = order.orderDetails.find((item) => {
            return item.item === orderDetails[i].item;
          });
          if (existingItem) {
            existingItem.quantity += orderDetails[i].quantity;
          } else {
            order.orderDetails.push(orderDetails[i]);
          }
        }
        await order.save();
        const ticket = new Ticket({
          orderId: order._id,
          order: orderDetails,
          tableNumber,
        });
        await ticket.save();
        //TODO: change streams on mongoDB to continously look for new insertions
        res.status(201).json({ message: "Order created successfully", order });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // static createOrder = async (req, res) => {
  //     const {orderDetails, tableNumber, waiter } = req.body;
  //     try {
  //         const table = await Table.find({number: tableNumber}).populate('customer');
  //         const cust = table.customer;
  //         const wait = await User.find({employeeCode: waiter});
  //         if (!wait) return res.status(404).json({ message: "Waiter code incorrect" });
  //         else {
  //             table.waiter = wait;
  //             if(cust.newCustomer){
  //                 cust.newCustomer = false;
  //             }
  //             cust.numTimesDined += 1;
  //             await cust.save();
  //             let billAmt = 0;
  //             for (let i = 0; i < orderDetails.length; i++) {
  //                 const item = await Item.findOne({ name: orderDetails[i].item});
  //                 if(!item) return res.status(404).json({ message: "Item not found"});
  //                 for(let ingredient of item.ingredients){
  //                     const ing = await Ingredient.findOne({name: ingredient.name});
  //                     //assume ingredient is correct, check for quantity
  //                     if(ing.quantity < ingredient.quantity * orderDetails[i].quantity){
  //                         return res.status(200).json({ message: "Ingredient not enough"});
  //                     } else {
  //                         //updating inventory
  //                         ing.quantity -= ingredient.quantity * orderDetails[i].quantity;
  //                         await ing.save();
  //                     }
  //                 }
  //                 billAmt += item.price * orderDetails[i].quantity;
  //             }
  //             const order = new Order({
  //                 cust,
  //                 orderDetails,
  //                 tableNumber,
  //                 billAmt: billAmt,
  //                 waiter
  //             });
  //             await order.save();
  //             const ticket = new Ticket({
  //                 orderId: order._id,
  //                 order: orderDetails,
  //                 tableNumber
  //             });
  //             await ticket.save();
  //             //TODO: change streams on mongoDB to continously look for new insertions
  //             res.status(201).json({ message: "Order created successfully", order });
  //         }
  //     } catch (error) {
  //         res.status(500).json({ message: error.message });
  //     }
  // }

  // static getOrders = async (req, res) => {
  //   // console.log(`Order fetched`);
  //   // res.status(200).json({ message: "Order fetched" })
  //   try {
  //     const orders = await Order.find({orderStatus:"Pending"}).populate("customer").populate("waiter");
  //     res.status(200).json({ message: "Orders fetched", orders });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };

  static getOrders = async (req, res) => {
    const { diningType, orderStatus } = req.query;
    const queryObject = {};
    if (diningType) queryObject.diningType = diningType;
    queryObject.orderStatus = orderStatus ? orderStatus : "Pending";
    try {
      const orders = await Order.find(queryObject);
      res.status(200).json({ message: "Orders fetched", orders });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static getActiveOrders = async (req, res) => {
    const { id } = req.params;
    try {
      const waiter = User.find({ employeeCode: id });
      if (!waiter) return res.status(404).json({ message: "Waiter not found" });
      else {
        const orders = await Order.find({
          waiter: id,
          orderStatus: { $in: ["Pending", "Ready"] },
        })
          .populate("customer")
          .populate("waiter");
        res.status(200).json({ message: "Orders fetched", orders });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static getOrderByTable = async (req, res) => {
    const { tableNumber } = req.params;
    try {
      const orders = await Order.find({
        tableNumber: tableNumber,
        orderStatus: "Pending",
      })
        .populate("customer")
        .populate("waiter");
      if (!orders)
        return res.status(404).json({ message: "Order(s) not found" });
      res.status(200).json({ message: "Orders fetched", orders });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static getOrderById = async (req, res) => {
    // console.log(`Order fetched by id: ${req.params.id}`);
    try {
      const { id } = req.params;
      const order = await Order.findById(id)
        .populate("customer")
        .populate("waiter");
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      else {
        order = await Order.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({ message: "Updated order", order });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //either update inventory and bill amount in this controller, or just make a new order for the table
  static addToCurrentOrder = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      else {
        order.orderDetails.push(req.body);
        //TODO: update inventory, bill amount, ticket
        await order.save();
        res.status(200).json({ message: "Updated order", order });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // static deleteOrder = async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const order = await Order.findByIdAndDelete(id);
  //     if (!order) return res.status(404).json({ message: "Order not found" });
  //     res.status(200).json({ message: "Order deleted", order });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };

  static checkOrder = async (req, res) => {
    try {
      const orders = await Order.find({ orderStatus: "Ready" });
      if (!orders)
        return res.status(404).json({ message: "No orders ready yet" });
      res.status(200).json({ message: "Orders ready", orders });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static updateStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById({ _id: id });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      } else {
        order.orderStatus = req.body.orderStatus;
        await order.save();
        res.status(200).json({ message: "Order status updated", order });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // delete order is changed to cancell order it will soft delete the orde and change the status to cancelled
  static deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById({ _id: id });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      } else {
        order.orderStatus = "Cancelled";
        await order.save();
        res.status(200).json({ message: "Order status updated", order });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
