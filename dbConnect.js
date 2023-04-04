import mongoose from "mongoose";

const dbConnect = () => {
    mongoose.connect(process.env.DB_URL);

    mongoose.connection.on("connected", () => {
        console.log("Connected to database successfully");
    })

    mongoose.connection.on("error", (err) => {
        console.log("Error while connecting to database:" + err);
    })

    mongoose.connection.on("disconnected", () => {
        console.log("Database Disconnected!!!");
    })
}

export default dbConnect;