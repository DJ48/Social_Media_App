import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    userId: {
        type: Number,
        unique: true,
        required: true,
    },
    taskId: {
        type: Number,
        unique: true,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
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
    }
});

const Task = mongoose.model("Task", taskSchema);

export default Task;