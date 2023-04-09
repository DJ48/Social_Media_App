import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: Number,
        unique: true,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 10,
    },
    role: {
        type: String,
        default: "member"
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => {
            return Date.now();
        }
    },
    updatedAt: {
        type: Date,
        default: () => {
            return Date.now();
        }
    },
    deletedAt: {
        type: Date,
        immutable: true,
        default: null
    },
});

const User = mongoose.model("User", userSchema);

export default User;