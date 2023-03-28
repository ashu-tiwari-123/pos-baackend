import { Receipt } from "../models/Receipt.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { Table } from "../models/Table.js";
import { Customer } from "../models/Customer.js";

export class ReceiptController {
  static createReceipt = async (req, res) => {
    //create receipt automatically from order ID
    const { id: orderId } = req.params;
    //const { tip } = req.body; //from front end, form body
    //moving tip to payBill() function
    try {
      const order = await Order.findById(orderId).populate("customer");
      if (!order) return res.status(404).json({ message: "Order not found" });
      const existReceipt = await Receipt.findOne({ order: orderId });
      if (existReceipt)
        return res.status(400).json({ message: "Receipt already exists" });
      else {
        const cust = order.customer;
        //const discount = cust.numTimesDined > 10 ? 0.1 : 0;
        const receipt = new Receipt({
          order: orderId,
          customer: cust,
          waiter: order.waiter,
          // discount: discount,
          billAmt: order.billAmt,
          // tip: tip
        });
        await receipt.save();
        res.status(201).json(receipt);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static createReceiptsFromCustomer = async (req, res) => {
    try {
      const { id: customerId } = req.params;
      //const { tip } = req.body;
      //moving tip to payBill() function

      const cust = await Customer.findById(customerId);
      if (!cust) return res.status(404).json({ message: "Customer not found" });
      else {
        const orders = await Receipt.find({
          customer: customerId,
          paid: false,
        }).populate("order");
        const receipts = [];
        for (const order of orders) {
          const receipt = new Receipt({
            order: order.order,
            customer: cust,
            waiter: order.order.waiter,
            billAmt: order.order.billAmt,
          });
          await receipt.save();
          receipts.push(receipt);
        }
        res
          .status(201)
          .json({ message: "Receipts created successfully", receipts });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static createReceiptForTable = async (req, res) => {
    //create receipt for all orders in a table, group all orders of a table in one receipt
    const { num: tableNum } = req.params;
    const order = await Order.find({ table: tableNum, paid: false }).populate(
      "customer"
    );
    const receipt = new Receipt({
      order: order,
      customer: order.customer,
      waiter: order.waiter,
      billAmt: order.billAmt,
    });
    await receipt.save();
    res
      .status(201)
      .json({ message: `Receipt for table ${tableNum}:`, receipt });
  };

  // static payBill = async (req, res) => {
  //     //pay bill, update receipt, order, and waiter rating
  //     const { id: receiptId } = req.params;
  //     const { rating, tip } = req.body;
  //     try {
  //         const rct = await Receipt.findById(receiptId).populate("order");
  //         if (!rct) return res.status(404).json({ message: "Receipt not found" });
  //         else {
  //             //add tip to bill amount and mark receipt as paid
  //             rct.tip = tip;
  //             rct.billAmt += tip;
  //             rct.paid = true;
  //             await rct.save();

  //             //mark order as paid
  //             const order = rct.order;
  //             order.paid = true;
  //             await order.save();

  //             //update waiter rating
  //             const waiter = await User.findOne({ employeeCode: order.waiter });
  //             waiter.rating = (waiter.rating * waiter.numOrders + rating) / (waiter.numOrders + 1);
  //             waiter.numOrders += 1;
  //             await waiter.save();

  //             //make tables free for future orders
  //             const customerId = order.customer;
  //             const tables = await Table.find({ customer: customerId });
  //             for(const table of tables) {
  //                 table.status = "free";
  //                 await table.save();
  //             }
  //             res.status(200).json({ message: "Receipt paid successfully", receipt: rct });
  //         }
  //     } catch (error) {
  //         res.status(500).json({ message: error.message });
  //     }
  // }

  static payBill = async (req, res) => {
    //pay bill, update receipt, order, and waiter rating
    const { id: receiptId } = req.params;
    const { rating, tip } = req.body;
    try {
      const rct = await Receipt.findById(receiptId).populate("order");
      // console.log(rct);
      if (!rct) return res.status(404).json({ message: "Receipt not found" });
      else {
        //add tip to bill amount and mark receipt as paid
        // rct.tip = tip;
        // rct.billAmt += tip;
        rct.paid = true;
        // await rct.save();

        //mark order as paid
        const order = rct.order;
        order.paid = true;
        await order.save();

        //update waiter rating TODO: fix authorization issue with updating an user
        /* const waiter = await User.findOne({ employeeCode: order.waiter });
                waiter.rating = (waiter.rating * waiter.numOrders + rating) / (waiter.numOrders + 1);
                waiter.numOrders += 1;
                await waiter.save(); */

        res.status(200).json({ receipt: rct });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // show receipt
  static showReceipt = async (req,res) => {
    //here id: receipt ID
    const { id: receiptId } = req.params;
    try {
        const receipt = await Receipt.findById(receiptId).populate('order');
        if (!receipt) return res.status(404).json({ message: "Receipt not found" });
        else {
            res.status(200).json({ message: "Receipt found", receipt });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }
}
