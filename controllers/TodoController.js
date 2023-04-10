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
        console.error("Error while creating new todo: ", err.message);
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
            completed: req.body.completed,
        }   

        const schema = Joi.object({
            userId: Joi.number(),
            taskId: Joi.number().required(),
            title: Joi.string().min(3).max(30).required(),
            completed: Joi.boolean().required(),
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
            { title: request.title, completed: request.completed },
            { new: true }
        );

        return res.status(200).send({
            message: responseMessage.TODO_UPDATED,
            data: data
        })
        
    }
    catch(err){
        console.error("Error while updating todo: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_UPDATE_TODO_API
        });
    }
}

/**
 * Controller for deleting Todo
 */

const deleteTask = async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            taskId: req.query.id,
        }   

        const schema = Joi.object({
            userId: Joi.number(),
            taskId: Joi.number().required(),
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

        const data = await Task.findOneAndDelete({ taskId: request.taskId });

        return res.status(200).send({
            message: responseMessage.TODO_DELETED,
        })
        
    }
    catch(err){
        console.error("Error while deleting todo: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_DELETE_TODO_API
        });
    }
}


/**
 * Controller for Todo List
 */

const fetchTaskList = async (req, res) => {
    try {
        
        const userId = req.body.userId;

        //Check if todo exists
        const todoList = await Task.find({ userId: userId }, {'_id': false, '__v': false}); 

        return res.status(200).send({
            message: responseMessage.TODO_LIST,
            data: todoList
        })
        
    }
    catch(err){
        console.error("Error while fetching todo list: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_TODO_LIST_API
        });
    }
}



export { createTask, updateTask, deleteTask, fetchTaskList };
