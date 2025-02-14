import UserModel from '../models/userModel.js';

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if userId exists
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId in request body." });
    }

    // Fetch user by ID
    const user = await UserModel.findById(userId);

    // Handle case where user is not found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
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
