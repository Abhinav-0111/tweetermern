import express from "express";
import {
    bookmark,
    follow,
    getMyProfile,
    getOtherUsers,
    unFollow,
    userLogin,
    userSignup,
    userlogOut,
} from "../controller/userController.js";
import {
    createTweet,
    deleteTweet,
    getAlltweets,
    getFollowingTweet,
    likeOrDislike,
} from "../controller/tweetController.js";

const route = express.Router();
route.post("/signup", userSignup);
route.post("/login", userLogin);
route.get("/logout", userlogOut);
route.post("/create", createTweet);
route.delete("/delete/:id", deleteTweet);
route.put("/like/:id", likeOrDislike);
route.put("/bookmark/:id", bookmark);
route.get("/profile/:id", getMyProfile);
route.get("/otheuser/:id", getOtherUsers);
route.post("/follow/:id", follow);
route.post("/unfollow/:id", unFollow);
route.get("/alltweets/:id", getAlltweets);
route.get("/followingTweet/:id", getFollowingTweet);
export default route;
