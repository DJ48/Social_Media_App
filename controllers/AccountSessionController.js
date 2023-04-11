import User from "../models/User.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import _ from "lodash";
import jwt from "jsonwebtoken";
import responseMessage from "../utils/constants.js";
import generateRefreshToken from "../utils/generateTokens.js";
import redisClient from "../redisConnect.js";

/**
 * Controller for Signup / registration
 */

const signup = async (req, res) => {
    try {
        const request = {
            name : req.body.name,
            userName : req.body.userName,
            email : req.body.email,
            password: req.body.password,
        }   

        const schema = Joi.object({
            name: Joi.string(),
            userName: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string(),
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] }
            }),
        })

        const validateRequest = schema.validate(request);
        if (validateRequest.error) {
            return res.status(400).send({
                message: validateRequest.error.message
            })
        }

        //Check if email already registered or not
        const userEmailExists = await User.findOne({ email: request.email });
        if (userEmailExists) {
            return res.status(400).send({
                message: responseMessage.EMAIL_ALREADY_EXISTS
            })
        }

        //Check if user name already registered or not
        const userNameExists = await User.findOne({ userName: request.userName });
        if (userNameExists) {
            return res.status(400).send({
                message: responseMessage.USER_NAME_ALREADY_EXISTS
            })
        }

        const lastUserId = await User.find({}, 'userId').sort({ userId: -1 }).limit(1);

        if (!_.isEmpty(lastUserId)) {
            request.userId = lastUserId[0].userId + 1;
        } else {
            request.userId = 1;
        }

        //Encrypt Password
        const salt = bcrypt.genSaltSync(Number(process.env.SALT));
        const hash = bcrypt.hashSync(request.password, salt);

        request.password = hash;

        //Create User
        await User.create(request);
        
        return res.status(200).send({
            message: responseMessage.SIGN_UP_SUCCESS
        })
        
    }
    catch(err){
        console.error("Error while creating new user: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_SIGNUP_API
        });
    }
}

/**
 * Controller for Login
 */

const login = async (req, res) => {
    try {
        const request = {
            email : req.body.email,
            password: req.body.password,
        }   

        const schema = Joi.object({
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] }
            }),
            password: Joi.string(),
        })

        const validateRequest = schema.validate(request);
        if (validateRequest.error) {
            return res.status(400).send({
                message: validateRequest.error.message
            })
        }

        //Check if user exists or not
        const userExists = await User.findOne({ email: request.email, deletedAt: null }, 'userId userName password role');
        if (_.isEmpty(userExists)) {
            return res.status(400).send({
                message: responseMessage.USER_NOT_FOUND
            })
        } 

        const userId = userExists.userId;
        const userRole = userExists.role;

        const salt = bcrypt.genSaltSync(Number(process.env.SALT));
        const hash = bcrypt.hashSync(request.password, salt);

        const isPasswordVaild = bcrypt.compareSync(request.password, hash);

        if(!isPasswordVaild){
            return res.status(400).send({
                message : responseMessage.PASSWORD_WRONG
            })
        }

        //Generate Access Token
        const accessToken = jwt.sign({ id: userId, role: userRole }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
        const refreshToken = await generateRefreshToken(userId, userRole);

        return res.status(200).send({
            message: responseMessage.LOG_IN_SUCCESS,
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        })
        
    }
    catch(err){
        console.error("Error while logging in user: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_LOGIN_API
        });
    }
}

/**
 * Controller for Logout
 */

const logout = async (req, res) => {
    try {
        const userId = req.sessionData.id;

        const token = req.accessToken;

        // remove the refresh token
        await redisClient.del(userId.toString());

        // blacklist current access token
        await redisClient.set('BL_' + userId.toString(), token);
    
        return res.status(200).send({
            message: responseMessage.LOG_OUT_SUCCESS,
        })
        
    }
    catch(err){
        console.error("Error while logging in user: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_LOGOUT_API
        });
    }
}

/**
 * Controller for generating Access Token
 */

const generateAccessToken = async (req, res) => {
    try {
        const userId = req.sessionData.id;
        const userRole = req.sessionData.role;

        //Generate Access Token
        const accessToken = jwt.sign({ id: userId, role: userRole }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
        const refreshToken = await generateRefreshToken(userId, userRole);
    
        return res.status(200).send({
            message: responseMessage.ACCESS_TOKEN_GENERATED,
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        })
        
    }
    catch(err){
        console.error("Error while logging in user: ", err.message);
        res.status(500).send({
            message : responseMessage.ERR_MSG_ISSUE_IN_LOGOUT_API
        });
    }
}

export { signup, login, logout, generateAccessToken };
