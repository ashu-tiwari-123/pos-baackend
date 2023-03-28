import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const { Schema } = mongoose

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [4, "password must be at least 4 characters"],
    },
    role: {
        type: String,
        enum: ["Admin", "Waiter", "Chef", "Cleaner"],
        default: "Waiter"
    },
    employeeCode: {
        type: String,
        unique: true
    },
    salary: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
    },
    numOrders: {
        type: Number,
        default: 0
    },
});

UserSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("employeeCode")) {
        user.employeeCode = Math.floor(1000 + Math.random() * 9000).toString();
    }
    if(user.isModified("password")){
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;
        } catch (error) {
            return next(error);
        }
    }

    next();
})

UserSchema.methods.comparePassword = async function (password) {
    const match = await bcrypt.compare(password, this.password);
    return match;
}

UserSchema.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
}

export const User = mongoose.model("User", UserSchema);