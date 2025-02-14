import bcrypt from "bcrypt"; // For hashing passwords
import validator from "validator"; // For validating email and password strength
import jwt from "jsonwebtoken"; // For generating JSON Web Tokens (JWT)
import { v4 as uuidv4 } from "uuid"; // For generating unique session IDs
import UserModel from "../models/userModel.js"; // User model for database operations
import transporter from "../config/nodemailer.js"; // Nodemailer configuration for sending emails
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  USER_EMAIL_SIGNUP,
} from "../config/emailTemplates.js"; // Predefined email templates

// Helper function to send emails
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Generate a secure OTP
const generateOtp = () => {
  return (Math.floor(100000 + Math.random() * 900000)).toString(); // Random 6-digit number
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!validator.isStrongPassword(password, { minLength: 10 })) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be strong (at least 10 characters, including letters, numbers, and symbols)",
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const sessionId = uuidv4();
    const user = new UserModel({ name, email, password: hashedPassword, currentSession: sessionId });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, sessionId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    // Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to our platform",
      html: USER_EMAIL_SIGNUP.replace("{{name}}", user.name).replace("{{email}}", user.email),
    };

    await sendEmail(mailOptions);

    return res.status(201).json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate new session and tokens
    const sessionId = uuidv4();
    user.currentSession = sessionId;
    await user.save();

    const token = jwt.sign({ id: user._id, sessionId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    // Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ success: true, message: "Logged in successfully", token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify token and extract user ID and session ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: userId, sessionId } = decoded;

    // Validate userId
    if (!userId || !validator.isMongoId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Find user in the database
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate session
    if (user.currentSession !== sessionId) {
      return res.status(403).json({ success: false, message: "Session expired or invalid, please login again." });
    }

    // Invalidate session
    user.currentSession = null;
    await user.save();

    // Clear cookies
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({ success: false, message: error.message });
  }
};

// Send verification OTP
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }

    // Rate limit OTP requests
    const rateLimitTime = 3 * 60 * 1000; // 3 minutes
    if (user.otpLastSentAt && Date.now() - user.otpLastSentAt < rateLimitTime) {
      const waitTime = Math.ceil((rateLimitTime - (Date.now() - user.otpLastSentAt)) / 60000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitTime} minute(s) before requesting a new OTP.`,
      });
    }

    // Generate and hash OTP
    const otp = generateOtp();
    user.verifyOtp = await bcrypt.hash(otp, 10);
    user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    user.otpLastSentAt = Date.now();
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Account Verification OTP",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
    };

    await sendEmail(mailOptions);

    return res.status(200).json({ success: true, message: "Verification OTP sent to email" });
  } catch (error) {
    console.error("OTP send error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify email using OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body; // Extract userId and OTP from request body

  // Check if userId and OTP are provided
  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    // Find the user by ID
    const user = await UserModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Compare the provided OTP with the hashed OTP in the database
    const isOtpValid = await bcrypt.compare(otp, user.verifyOtp);

    // Check if the OTP is invalid
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Check if the OTP has expired
    if (user.verifyOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // Mark the user's account as verified and clear the OTP fields
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    // Save the updated user data
    await user.save();

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    // Handle any errors that occur during email verification
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    // Return success response if the user is authenticated
    return res.status(200).json({ success: true });
  } catch (error) {
    // Handle any errors that occur during authentication check
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Send password reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body; // Extract email from request body

  // Check if email is provided
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Rate limit OTP requests
    const rateLimitTime = 3 * 60 * 1000; // 3 minutes
    if (user.resetOtpLastSentAt && Date.now() - user.resetOtpLastSentAt < rateLimitTime) {
      const waitTime = Math.ceil((rateLimitTime - (Date.now() - user.resetOtpLastSentAt)) / 60000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitTime} minute(s) before requesting a new OTP.`,
      });
    }

    // Generate a 6-digit OTP
    const otp = generateOtp();

    // Hash the OTP and set its expiration time (15 minutes from now)
    user.resetOtp = await bcrypt.hash(otp, 10);
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    user.resetOtpLastSentAt = Date.now();

    // Save the updated user data
    await user.save();

    // Send the OTP to the user's email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      //text: `Your OTP for resetting your password is ${otp}. Do not share this OTP with anyone.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };

    await sendEmail(mailOptions);

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password reset OTP sent to your email" });
  } catch (error) {
    // Handle any errors that occur during OTP sending
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Reset user password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body; // Extract email, OTP, new password, and confirm password from request body

  // Check if required fields are missing
  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

    // Validate password strength
    if (!validator.isStrongPassword(newPassword, { minLength: 10 })) {
      return res.status(400).json({
      success: false,
      message: "New Password must be strong (at least 10 characters, including letters, numbers, and symbols)",
    });
}

  // Check if newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Compare the provided OTP with the hashed OTP in the database
    const isOtpValid = await bcrypt.compare(otp, user.resetOtp);

    // Check if the OTP is invalid or expired
    if (!isOtpValid || user.resetOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash the new password and clear the OTP fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    // Save the updated user data
    await user.save();

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    // Handle any errors that occur during password reset
    return res.status(500).json({ success: false, message: error.message });
  }
};
