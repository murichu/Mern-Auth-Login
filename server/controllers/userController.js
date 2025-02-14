import UserModel from '../models/userModel.js';

export const getUserData = async (req, res) => {
  try {
    const { token } = req.cookies;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify token and extract user ID and session ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: userId } = decoded;

    // Validate userId
    if (!userId || !validator.isMongoId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Check if userId exists
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId in request body." });
    }


    // Find user in the database
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Return user data
    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in getUserData:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving user data.",
      error: error.message,
    });
  }
};
