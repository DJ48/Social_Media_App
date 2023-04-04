import express from "express";
import { config } from "dotenv";
import dbConnect from "./dbConnect.js";

config();
dbConnect();

const app = express();

//Start The server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Server Started on the port: " + port);
});