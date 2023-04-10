/**
 * This file will act as the route
 */

import express from "express";
import { signup, login, logout, generateAccessToken } from "../controllers/AccountSessionController.js";
import { verifyToken, verifyRefreshToken } from "../middlewares/auth.middleware.js";
import { createTask, updateTask, deleteTask, fetchTaskList } from "../controllers/TodoController.js";

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

export default router;