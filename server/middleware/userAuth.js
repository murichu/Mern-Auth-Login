import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  try {
    // Check if token exists in cookies
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Please login again." });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken?.id || !decodedToken?.sessionId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token. Please login again." });
    }

    // Fetch user from database
    const user = await UserModel.findById(decodedToken.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found. Please register again." });
    }

    // Validate session
    if (user.currentSession && user.currentSession !== decodedToken.sessionId) {
      return res
        .status(403)
        .json({ success: false, message: "Session expired or invalid." });
    }

    // Attach user info to request
    req.body.userId = decodedToken.id;
    req.body.sessionId = decodedToken.sessionId;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    console.error("Error in userAuth middleware:", error);
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token. Please login again." });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired. Please login again." });
    }
    return res.status(500).json({
      success: false,
      message: "An error occurred while validating the token.",
      error: error.message,
    });
  }
};

export default userAuth;
