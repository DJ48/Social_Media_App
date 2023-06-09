import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema({
    postId: {
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
        required: true
    },
    description: {
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

const Post = mongoose.model("Post", postSchema);

export default Post;