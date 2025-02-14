// Import necessary modules and assets
import React, { useState, useContext, useRef } from 'react'; // React hooks for state and context
import { assets } from '../assets/assets'; // Assets for icons and logos
import { useNavigate } from 'react-router-dom'; // Navigation between routes
import axios from 'axios'; // Axios for API requests
import { AppContext } from '../context/AppContext'; // Global context for shared values
import { toast } from 'react-toastify'; // Toast notifications for user feedback

const ResetPassword = () => {
  // Access backend URL and token from context
  const { backendUrl, token } = useContext(AppContext);
  
  // Enable credentials sharing in Axios requests
  axios.defaults.withCredentials = true;

  const navigate = useNavigate(); // Navigation hook

  // State variables for email, password, OTP, and form handling
  const [email, setEmail] = useState(''); // Stores user's email
  const [newPassword, setNewPassword] = useState(''); // Stores new password
  const [confirmPassword, setConfirmPassword] = useState(''); // Stores confirm password
  const [isEmailSent, setIsEmailSent] = useState(false); // Tracks if email is sent
  const [otp, setOtp] = useState(''); // Stores OTP
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false); // Tracks if OTP is submitted
  const inputRefs = useRef([]); // References to OTP input fields
  const [isLoading, setIsLoading] = useState(false); // Loading state for button disable

  // Handle OTP input focus for smooth navigation between fields
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus(); // Move focus to the next input field
    }
  };

  // Handle backspace key navigation between OTP fields
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus(); // Move focus to the previous input field
    }
  };

  // Handle OTP paste functionality for faster input
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, ''); // Extract digits only
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char; // Fill OTP fields with pasted digits
      }
    });
    const lastIndex = Math.min(paste.length, inputRefs.current.length) - 1;
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus(); // Move focus to the last filled field
    }
    setOtp(paste); // Update OTP state
  };

  // Submit email for OTP generation
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Set loading state to true
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message); // Show success toast
        setIsEmailSent(true); // Mark email as sent
      } else {
        toast.error(data.message); // Show error toast
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message); // Show error toast
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Submit OTP for verification
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value); // Collect OTP digits

    if (otpArray.some((digit) => !digit)) {
      toast.error('Please fill in all OTP fields.'); // Show error if any OTP field is empty
      return;
    }
    setOtp(otpArray.join('')); // Combine OTP digits into a single string
    setIsOtpSubmitted(true); // Mark OTP as submitted
  };

  // Submit new password for resetting
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match'); // Show error if passwords don't match
      return;
    }
    try {
      setIsLoading(true); // Set loading state to true
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword, confirmPassword },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message); // Show success toast
        // Reset form states
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        navigate('/login'); // Redirect to login page
      } else {
        toast.error(data.message); // Show error toast
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message); // Show error toast
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // UI rendering based on current state
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      {/* Logo and navigation */}
      <img
        onClick={() => navigate('/')}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      {/* Form for email submission */}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your registered email address.</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="Email" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none text-white"
              type="email"
              placeholder="Your email address"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 mt-2 rounded-full text-center ${
              isLoading ? 'bg-indigo-300' : 'bg-indigo-500 hover:bg-indigo-700'
            } text-white`}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      )}

      {/* Form for OTP input */}
      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitOTP} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email.</p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  aria-label={`OTP Digit ${index + 1}`}
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 mt-1 rounded-full text-center ${
              isLoading ? 'bg-indigo-300' : 'bg-indigo-500 hover:bg-indigo-700'
            } text-white`}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      )}

      {/* Form for new password input */}
      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter and confirm your new password.</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="Password" />
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="bg-transparent outline-none text-white"
              type="password"
              placeholder="New Password"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="Confirm Password" />
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="bg-transparent outline-none text-white"
              type="password"
              placeholder="Confirm Password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || newPassword !== confirmPassword}
            className={`w-full py-2.5 px-4 mt-2 rounded-full text-center ${
              isLoading ? 'bg-indigo-300' : 'bg-indigo-500 hover:bg-indigo-700'
            } text-white`}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;