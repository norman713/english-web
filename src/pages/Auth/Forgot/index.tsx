import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo-removebg-preview (1).png";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex justify-center">
          <img src={logo} alt="English 4 Us" className="w-[125px] h-[120px]" />
        </div>

        <h2 className="text-center text-[24px] font-bold text-blue-500 mb-4">
          Forgot Password
        </h2>

        {submitted ? (
          <p className="text-center text-sm text-green-600">
            If an account with that email exists, a password reset link has been
            sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-2">
              Enter your email and we’ll send you a link to reset your password.
            </p>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
              className="w-full bg-indigo-400 text-white rounded-full py-2 text-sm font-semibold hover:bg-indigo-500 transition-colors"
              onClick={() => navigate("/reset")}
            >
              Send Reset Code
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
