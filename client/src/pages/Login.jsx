import React, { useState, useContext} from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';


const Login = () => {
  const navigate = useNavigate();

  const { backendUrl,setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const endpoint =
        state === "login"
          ? `${backendUrl}/api/auth/login`
          : `${backendUrl}/api/auth/register`;

      const payload =
        state === "login" ? { email, password } : { name, email, password };

        const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response Error:", error.response.data);
        toast.error(error.response.data.message || "An error occurred.");
      } else if (error.request) {
        console.error("Request Error:", error.request);
        toast.error("No response from the server. Please try again later.");
      } else {
        console.error("Unexpected Error:", error.message);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign up"
            ? "Create your account"
            : "Login to your account!"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="Name" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="Email" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email ID"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="Password" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-400 cursor-pointer"
          >
            Forgot Password?
          </p>

          {/* Submit Button */}
          <button
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
            type="submit"
          >
            {state === "Sign up" ? "Sign up" : "Login"}
          </button>
        </form>
       
        <p className="text-gray-400 text-center text-xs mt-4">
          {state === "Sign up" ? (
            <>
              Already have an account?{"  "}
              <button
                type="button"
                onClick={() => setState("login")}
                className="text-blue-400 cursor-pointer"
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{"  "}
              <button
                type="button"
                onClick={() => setState("Sign up")}
                className="text-blue-400 cursor-pointer"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
