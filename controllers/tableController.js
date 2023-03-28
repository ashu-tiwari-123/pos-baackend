import { Table } from "../models/Table.js";

export default class TableController {
    static async createTable(req, res) {
        try {
            const table = await Table.create(req.body);
            res.status(201).json(table);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllTables(req, res) {
        try {
            const tables = await Table.find();
            res.status(200).json(tables);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateTable(req, res) {
        try {
            const {number} = req.params;
            const table = await Table.findOne({number: number});
            if(!table) return res.status(404).json({message: "Table not found"});
            await Table.findOneAndUpdate({number: number}, req.body, {new: true, runValidators: true});
            res.status(200).json({message: "Table updated successfully", table});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteTable(req, res) {
        try {
            const {number} = req.params;
            const table = await Table.findOne({number: number});
            if(!table) return res.status(404).json({message: "Table not found"});
            await table.remove();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}