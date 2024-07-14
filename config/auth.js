// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// export const isAuthenticated = async (req, res, next) => {
//     console.log(req);
//     try {
//         const token = req.cookies.token;
//         if (!token) {
//             return res.status(401).json({
//                 message: "User not authenticated.",
//                 success: false,
//             });
//         }
//         const decode = jwt.verify(token, process.env.TOKEN_SECRET);
//         req.user = decode.userId;
//         next();
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
