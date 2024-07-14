import User from "../model/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const userSignup = async (req, res) => {
    try {
        const { name, password, username, email } = req.body;
        const exist = await User.findOne({ username: username });
        if (exist) {
            res.status(401).json("Username already Exists");
        }
        const exist2 = await User.findOne({ email: email });
        if (exist2) {
            res.status(401).json("Email Already Exists");
        }
        const hashedPassword = await bcryptjs.hash(password, 16);
        await User.create({
            name,
            password: hashedPassword,
            username,
            email,
        });
        res.status(200).json({ message: "Account Create Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const userLogin = async (req, res) => {
    let token;
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json("Username not found");
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json("Invaild Password");
        }
        token = await user.generateAuthToken();
        res.cookie("jwttoken", token, {
            expires: new Date(Date.now() + 3599999),
            httpOnly: true,
        });
        res.status(200).json({
            message: `Welcome back ${user.name}`,
            user: {
                user: user._id,
                name: user.name,
                username: user.username,
                followers: user.followers,
                following: user.following,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const userlogOut = async (req, res) => {
    res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "user logout successfully",
    });
};

export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if (user.bookmark.includes(tweetId)) {
            await User.findByIdAndUpdate(loggedInUserId, {
                $pull: { bookmark: tweetId },
            });
            return res.status(200).json({ message: "Bookmark remove" });
        } else {
            await User.findByIdAndUpdate(loggedInUserId, {
                $push: { bookmark: tweetId },
            });
            return res.status(200).json({ message: "Save Bookmark" });
        }
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const otherUser = await User.find({ _id: { $ne: id } }).select(
            "-password"
        );
        if (!otherUser) {
            return res
                .status(401)
                .json({ Message: "Currenty don't have any user" });
        }
        return res.status(200).json({ otherUser });
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
};

export const follow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);
        if (!user.followers.includes(loggedInUser)) {
            await user.updateOne({ $push: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $push: { following: userId } });
        } else {
            return res
                .status(400)
                .json({ message: `User already followed to ${user.name}` });
        }
        return res.status(200).json({
            Message: `${loggedInUser.name} just followed to ${user.name}`,
        });
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
};

export const unFollow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);
        if (loggedInUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $pull: { following: userId } });
        } else {
            return res
                .status(400)
                .json({ Message: `User has not followed yet` });
        }
        return res.status(200).json({
            Message: `${loggedInUser.name} unfollowed to ${user.name}`,
        });
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
};
