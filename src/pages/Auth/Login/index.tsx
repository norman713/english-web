import React, { useState } from "react";
import logo from "../../../assets/logo-removebg-preview (1).png";
import googleLogo from "../../../assets/google.png";
import facebookLogo from "../../../assets/facebook.png";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("admin123@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl relative">
        <div className="flex justify-center">
          <img src={logo} alt="English 4 Us" className="w-[125px] h-[120px]" />
        </div>

        <div
          className="text-center font-bold text-lg mb-6 text-[30px]"
          style={{ color: "rgba(81, 202, 242, 0.54)" }}
        >
          Login
        </div>

        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-600">
            <FaUser className="h-5 w-5" />
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email"
          />
        </div>

        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-600">
            <FaLock className="h-5 w-5" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          className="w-full bg-indigo-400 text-white rounded-full py-2 text-sm font-semibold hover:bg-indigo-500 transition-colors"
          onClick={() => navigate("/user")} // Thay '/dashboard' bằng route đích của anh
        >
          Login
        </button>

        <div className="flex items-center my-6 text-gray-500 text-xs font-semibold">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="space-y-5">
          <button className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-300 py-2 text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
            <img src={facebookLogo} alt="Facebook logo" className="h-5 w-5" />
            Continue with Facebook
          </button>

          <button className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-300 py-2 text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
            <img src={googleLogo} alt="Google logo" className="h-5 w-5" />
            Continue with Google
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          Don't you have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
