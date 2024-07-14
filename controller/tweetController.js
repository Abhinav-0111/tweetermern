import tweet from "../model/tweetSchema.js";
import User from "../model/userSchema.js";

export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;
        if (!id) {
            return res.status(401).json({ message: "user id not found" });
        }
        if (!description) {
            return res.status(401).json({ message: "All field are required" });
        }
        const user = await User.findById(id).select("-password");
        await tweet.create({
            description,
            userId: id,
            // photoUrl,
            userDetails: user,
        });
        res.status(200).json({ message: "Tweet Created Successfully" });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

export const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params;
        await tweet.findByIdAndDelete(id);
        return res.status(200).json({ Message: "Tweet Delete successfully" });
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
};

export const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const Tweet = await tweet.findById(tweetId);
        if (Tweet.like.includes(loggedInUserId)) {
            await tweet.findByIdAndUpdate(tweetId, {
                $pull: { like: loggedInUserId },
            });
            return res.status(200).json({ message: "User dislike your post" });
        } else {
            await tweet.findByIdAndUpdate(tweetId, {
                $push: { like: loggedInUserId },
            });
            return res.status(200).json({ message: "User like your post" });
        }
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getAlltweets = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUserTweet = await tweet.find({ userId: id });
        const followingUserTweet = await Promise.all(
            loggedInUser.following.map((otherUserId) => {
                return tweet.find({ userId: otherUserId });
            })
        );
        if (!loggedInUserTweet && !followingUserTweet) {
            res.status(400).json({ message: "No Tweet Yet" });
        }
        return res
            .status(200)
            .json({ tweets: loggedInUserTweet.concat(...followingUserTweet) });
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getFollowingTweet = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const followingUserTweet = await Promise.all(
            loggedInUser.following.map((otherUserId) => {
                return tweet.find({ userId: otherUserId });
            })
        );
        return res.status(200).json({
            tweets: [].concat(...followingUserTweet),
        });
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
};
