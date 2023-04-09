/**
 * This file will act as the route
 */

import express from "express";
import { signup, login, logout, generateAccessToken } from "../controllers/AccountSessionController.js";
import { verifyToken, verifyRefreshToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

//Admin Session Routes
router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", verifyToken ,logout);
router.post("/refresh", verifyRefreshToken , generateAccessToken);

export default router;