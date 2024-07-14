import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const Connection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database Connect Successfully");
    } catch (error) {
        console.log("Data not Connect", error.message);
    }
};
export default Connection;
