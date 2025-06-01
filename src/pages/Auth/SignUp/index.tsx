import React, { useState } from "react";
import logo from "../../../assets/logo-removebg-preview (1).png";
import { FaUserFriends, FaBookOpen, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignUp = () => {
    console.log("Sign up with:", { name, email, password });
    navigate("/"); // hoặc bất kỳ đường dẫn nào bạn muốn
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="bg-white rounded-[30px] p-8 w-full max-w-sm shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <img src={logo} alt="English 4 Us" className="w-[120px] h-[100px]" />
        </div>

        {/* Title */}
        <h2 className="text-center text-blue-500 font-bold text-xl mb-6">
          Sign Up
        </h2>

        {/* Name */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
            <FaUserFriends />
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full pl-10 pr-3 py-2 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
            <FaBookOpen />
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-10 pr-3 py-2 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
            <FaLock />
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full pl-10 pr-3 py-2 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          className="w-full bg-indigo-400 hover:bg-indigo-500 text-white rounded-full py-2 font-semibold transition-colors"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
