import { Customer } from "../models/Customer.js";

export class CustomerController {
    static createCustomer = async (req, res) => {
        const {name,email,phone} = req.body;
        let customer = await Customer.findOne({phone});
        if(customer) return res.status(400).json({ message: "Customer already exists", customer: customer._id});
        else{
            try {
                customer = new Customer({
                    name,
                    email,
                    phone
                });
                await customer.save();
                res.status(201).json({ message: "Customer registered successfully" });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    }

    static getCustomer = async (req, res) => {
        try {
            const customers = await Customer.find();
            res.status(200).json({ message: "Customers fetched", customers });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static getCustomerById = async (req, res) => {
        const {id} = req.params;
        try {
            const customer = await Customer.findById(id);
            if(!customer) return res.status(404).json({ message: "Customer not found"});
            res.status(200).json({ message: "Customer fetched", customer });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static updateCustomer = async (req, res) => {
        const {id} = req.params;
        try {
            const {name,email,phone} = req.body;
            const customer = await Customer.findByIdAndUpdate(id, {name,email,phone}, {new: true, runValidators: true});
            if(!customer) return res.status(404).json({ message: "Customer not found"});
            res.status(200).json({ message: "Customer updated", customer });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static deleteCustomer = async (req, res) => {
        const {id} = req.params;
        try {
            const customer = await Customer.findByIdAndDelete(id);
            if(!customer) return res.status(404).json({ message: "Customer not found"});
            res.status(200).json({ message: "Customer deleted", customer });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}