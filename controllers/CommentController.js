import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Joi from "joi";
import _ from "lodash";
import responseMessage from "../utils/constants.js";

/**
 * Controller for Creating Comment
 */

const createComment= async (req, res) => {
    try {
        const request = {
            text: req.body.text,
            postId: req.body.postId,
            commentedUserId: req.sessionData.id,
        }   

        const schema = Joi.object({
            text: Joi.string().min(3).max(30).required(),
            postId: Joi.number().required(),
            commentedUserId: Joi.number(),
        })

        const validateRequest = schema.validate(request);
        if (validateRequest.error) {
            return res.status(400).send({
                message: validateRequest.error.message
            })
        }

        const lastCommentId = await Comment.find({}, 'commentId').sort({ commentId: -1 }).limit(1);

        if (!_.isEmpty(lastCommentId)) {
            request.commentId = lastCommentId[0].commentId + 1;
        } else {
            request.commentId = 1;
        }

        //Fetch UserName
        const userDetails = await User.findOne({ userId: request.commentedUserId, deletedAt: null }, 'userName');
        request.commentedUserName = userDetails.userName;

        //Create Comment
        const data = await Comment.create(request);
        
        return res.status(200).send({
            message: responseMessage.COMMENT_CREATED,
            data: data
        })
        
    }
    catch(err){
        console.error("Error while creating new comment: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_CREATE_COMMENT_API
        });
    }
}

/**
 * Controller for Comment List
 */

const fetchCommentList = async (req, res) => {
    try {
        
        const request = {
            postId: req.query.postId
        }   

        const schema = Joi.object({
            postId: Joi.number().required()
        })

        const validateRequest = schema.validate(request);
        if (validateRequest.error) {
            return res.status(400).send({
                message: validateRequest.error.message
            })
        }

        //Check if user exists or not
        const postExists = await Post.findOne({ postId: request.postId, deletedAt: null });
        if (_.isEmpty(postExists)) {
            return res.status(400).send({
                message: responseMessage.POST_NOT_FOUND
            })
        }

        //Fetch all comment of post
        const commentList = await Comment.find({ postId: request.postId }, {'_id': false, '__v': false}); 

        return res.status(200).send({
            message: responseMessage.COMMENT_LIST,
            data: commentList
        })
        
    }
    catch(err){
        console.error("Error while fetching comment list: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_POST_LIST_API
        });
    }
}

export { createComment, fetchCommentList };
