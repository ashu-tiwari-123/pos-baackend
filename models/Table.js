import mongoose from "mongoose";
const { Schema } = mongoose;

//create table schema with number of seats, waiter, status and customer(?)
const tableSchema = new Schema({
    number: {
        type: Number,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    waiter: {
        type: String,
    },
    status: {
        type: String,
        enum: ['free', 'occupied', 'reserved'],
        default: 'free',
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
    },
}, {collection: 'restaurant'});

//create table model
export const Table = mongoose.model('Table', tableSchema);
