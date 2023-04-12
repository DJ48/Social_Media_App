/**
 * This file will act as the route
 */

import express from "express";
import { signup, login, logout, generateAccessToken } from "../controllers/AccountSessionController.js";
import { verifyToken, verifyRefreshToken } from "../middlewares/auth.middleware.js";
import { createTask, updateTask, deleteTask, fetchTaskList } from "../controllers/TodoController.js";
import { createPost, fetchPostList } from "../controllers/PostController.js";
import { createComment, fetchCommentList } from "../controllers/CommentController.js";
import { fetchUserDetails, fetchUsersList } from "../controllers/UserController.js";

const router = express.Router();

//Admin Session Routes
router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", verifyToken , logout);
router.post("/refresh", verifyRefreshToken, generateAccessToken);

//Todo Controller Routes
router.post("/create/todo", verifyToken, createTask);
router.put("/update/todo", verifyToken, updateTask);
router.delete("/delete/todo", verifyToken, deleteTask);
router.get("/todo/list", verifyToken, fetchTaskList);

//Post Controller Routes
router.post("/create/post", verifyToken, createPost);
router.get("/post/list", verifyToken, fetchPostList);

//Comment Controller Routes
router.post("/create/comment", verifyToken, createComment);
router.get("/comment/list", verifyToken, fetchCommentList);

//User Controller Routes
router.post("/user/list", fetchUsersList);
router.get("/user/details", fetchUserDetails);

export default router;