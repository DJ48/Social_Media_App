import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskId: {
        type: Number,
        unique: true,
        required: true,
    },
    userId: {
        type: Number,
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
    }
},
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;