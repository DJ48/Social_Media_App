import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Todo from "../models/Todo.js";
import Joi from "joi";
import _ from "lodash";
import responseMessage from "../utils/constants.js";

/**
 * Controller for Listing Users
 */

const fetchUsersList= async (req, res) => {
    try {
        const request = {
            search: req.body.search
        }   

        const schema = Joi.object({
            search: Joi.string().allow('')
        })

        const validateRequest = schema.validate(request);
        if (validateRequest.error) {
            return res.status(400).send({
                message: validateRequest.error.message
            })
        }

        const userList = await User.find({"userName": /request.search/ }).limit(20);

        
        return res.status(200).send({
            message: responseMessage.USER_LIST,
            data: userList
        })
        
    }
    catch(err){
        console.error("Error while fetching user list: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_USER_LIST_API
        });
    }
}

/**
 * Controller for User Details
 */

const fetchUserDetails = async (req, res) => {
    try {
        
        const request = {
            userId: req.query.userId
        }   

        const schema = Joi.object({
            userId: Joi.number().required()
        })

        const validateRequest = schema.validate(request);
        if (validateRequest.error) {
            return res.status(400).send({
                message: validateRequest.error.message
            })
        }

        //Check if user exists or not
        const userExists = await User.findOne({ userId: request.userId, deletedAt: null }, 'userId userName role');
        if (_.isEmpty(userExists)) {
            return res.status(400).send({
                message: responseMessage.USER_NOT_FOUND
            })
        }

        //Fetch all Todo of user
        const todoList = await Todo.find({ userId: request.userId }, { '_id': false, '__v': false }); 
        
        //Fetch all Post of user
        const postList = await Post.aggregate([
            {
                $match: { userId: Number(request.userId) }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "postId",
                    foreignField: "postId",
                    pipeline: [
                        { $project: { _id: 0, __v: 0}}
                    ],
                    as: "commentList"
                }
            },
            { $project: { _id: 0, __v: 0}}
        ]);

        return res.status(200).send({
            message: responseMessage.USER_DETAILS,
            data: {
                userDetails: userExists,
                todoList: todoList,
                postList: postList
            }
        })
        
    }
    catch(err){
        console.error("Error while fetching user details: ", err.message);
        res.status(500).send({
            message: responseMessage.ERR_MSG_ISSUE_IN_USER_DETAILS_API
        });
    }
}

export { fetchUsersList, fetchUserDetails };
