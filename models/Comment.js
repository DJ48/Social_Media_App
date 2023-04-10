import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    commentId: {
        type: Number,
        unique: true,
        required: true,
    },
    postId: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    commentedUserId: {
        type: Number,
        required: true
    },
    commentedUserName: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        immutable: true,
        default: null
    },
},
    {
        timestamps: true
    }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;