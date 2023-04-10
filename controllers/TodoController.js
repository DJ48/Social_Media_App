import Task from "../models/Todo.js";
import Joi from "joi";
import _ from "lodash";
import responseMessage from "../utils/constants.js";
import { request } from "express";

/**
 * Controller for Creating Todo
 */

const createTask = async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            title : req.body.title,
        }   

        const schema = Joi.object({
            userId: Joi.number(),
            title: Joi.string().min(3).max(30).required(),
        })

        const validateRequest = schema.validate(request);
        if (validateRequest.error) {
            return res.status(400).send({
                message: validateRequest.error.message
            })
        }

        const lastTaskId = await Task.find({}, 'taskId').sort({ taskId: -1 }).limit(1);

        if (!_.isEmpty(lastTaskId)) {
            request.taskId = lastTaskId[0].taskId + 1;
        } else {
            request.taskId = 1;
        }

        //Create Todo
        const data = await Task.create(request);
        
        return res.status(200).send({
            message: responseMessage.TODO_CREATED,
            data: data
        })
        
    }
    catch(err){
        console.error("Error while creating new user: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_CREATE_TODO_API
        });
    }
}

/**
 * Controller for updating Todo
 */

const updateTask = async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            taskId: req.body.taskId,
            title: req.body.title,
            completed: req.body.Completed,
        }   

        const schema = Joi.object({
            userId: Joi.number(),
            taskId: Joi.number().required(),
            title: Joi.string().min(3).max(30).required(),
            completed: Joi.boolean(),
        })

        const validateRequest = schema.validate(request);
        if (validateRequest.error) {
            return res.status(400).send({
                message: validateRequest.error.message
            })
        }

        //Check if todo exists
        const todoExists = await Task.findOne({ userId: request.userId, taskId: request.taskId });
        if (_.isEmpty(todoExists)) {
            return res.status(400).send({
                message: responseMessage.TODO_NOT_FOUND
            })
        } 

        const data = await Task.findOneAndUpdate({ taskId: request.taskId },
                                    { title: request.title, completed: request.completed });

        return res.status(200).send({
            message: responseMessage.TODO_UPDATED,
            data: data
        })
        
    }
    catch(err){
        console.error("Error while logging in user: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_UPDATE_TODO_API
        });
    }
}

export { createTask, updateTask };
