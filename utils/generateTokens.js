import jwt from "jsonwebtoken";
import redisClient from "../redisConnect.js";

const generateRefreshToken = async (userId, role) => {

    const refreshToken = jwt.sign({ id: userId, role: role }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME });
    
    await redisClient.set(userId.toString(), JSON.stringify({ token: refreshToken }));

    return refreshToken;
}

export default generateRefreshToken;