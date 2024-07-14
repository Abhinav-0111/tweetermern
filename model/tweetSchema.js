import mongoose from "mongoose";

export const tweetSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        // photoUrl: {
        //     type: Array,
        // },
        like: {
            type: Object,
            default: [],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        userDetails: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

const tweet = mongoose.model("tweet", tweetSchema);
export default tweet;
