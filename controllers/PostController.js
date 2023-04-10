import Post from "../models/Post.js";
import Joi from "joi";
import _ from "lodash";
import responseMessage from "../utils/constants.js";

/**
 * Controller for Creating Post
 */

const createPost= async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description
        }   

        const schema = Joi.object({
            userId: Joi.number(),
            title: Joi.string().min(3).max(30).required(),
            description: Joi.string().min(10).max(250).required()
        })

        const validateRequest = schema.validate(request);
        if (validateRequest.error) {
            return res.status(400).send({
                message: validateRequest.error.message
            })
        }

        const lastPostId = await Post.find({}, 'postId').sort({ postId: -1 }).limit(1);

        if (!_.isEmpty(lastPostId)) {
            request.postId = lastPostId[0].postId + 1;
        } else {
            request.postId = 1;
        }

        //Create Todo
        const data = await Post.create(request);
        
        return res.status(200).send({
            message: responseMessage.POST_CREATED,
            data: data
        })
        
    }
    catch(err){
        console.error("Error while creating new post: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_CREATE_POST_API
        });
    }
}

/**
 * Controller for Post List
 */

const fetchPostList = async (req, res) => {
    try {
        
        const userId = req.body.userId;

        //Fetch all post of user
        const postList = await Post.find({ userId: userId }, {'_id': false, '__v': false}); 

        return res.status(200).send({
            message: responseMessage.POST_LIST,
            data: postList
        })
        
    }
    catch(err){
        console.error("Error while fetching todo list: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_POST_LIST_API
        });
    }
}

export { createPost, fetchPostList };
