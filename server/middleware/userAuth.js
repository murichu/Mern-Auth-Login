import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
    // Check if token exists in cookies
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
    }

    try {
        
        // Verify token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id) {
            req.body.userId = tokenDecode.id;
            req.body.sessionId = tokenDecode.sessionId;
        } else {
            return res.status(401).json({ success: false, message: "Invalid token. Please login again." });
        }

        // Fetch user from database
        const userId = await UserModel.findById(tokenDecode.id);
        if (!userId) {
            return res.status(404).json({ success: false, message: "User not found. Please register again." });
        }

        // Validate session
        if (userId.currentSession && userId.currentSession !== tokenDecode.sessionId) {
            return res.status(403).json({ success: false, message: "Session expired or invalid." });
        }

        next(); // Proceed to the next middleware or route
    } catch (error) {
        console.error("Error in userAuth middleware:", error);
        return res.status(500).json({ success: false, message: "Token validation failed", error: error.message });
    }
};

export default userAuth;
