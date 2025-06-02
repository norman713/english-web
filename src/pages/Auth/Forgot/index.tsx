// src/pages/Auth/ForgotPasswordPage.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../../assets/logo-removebg-preview (1).png";
import authApi, {
  ActionResponse,
  ResetPasswordRequest,
} from "../../../api/authApi";

const ForgotPasswordPage: React.FC = () => {
  // Bước 1: nhập email
  const [email, setEmail] = useState<string>(""); 

  // Bước 2: sau khi gửi mã thành công => show form nhập mã + mật khẩu mới
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Các field cho bước nhập mã + mật khẩu mới
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Thông báo lỗi hoặc thành công
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Gửi mã xác thực về email (GET /api/auth/reset?email=...)
   */
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Vui lòng nhập email.");
      return;
    }

    setLoading(true);
    try {
      const response: ActionResponse = await authApi.sendResetCode(email);

      if (response.success) {
        // Sau khi backend trả về { success: true }
        setSuccessMsg("Mã xác thực đã được gửi vào email của bạn.");
        setSubmitted(true);
      } else {
        setErrorMsg(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err: unknown) {
      let msg = "Không thể kết nối đến server. Vui lòng thử lại sau.";
      if (axios.isAxiosError(err)) {
        // Nếu backend có gửi kèm message trong body
        msg = err.response?.data?.message ?? msg;
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xác nhận mã và lưu mật khẩu mới (POST /api/auth/reset-password)
   */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate cơ bản
    if (!verificationCode.trim()) {
      setErrorMsg("Vui lòng nhập mã xác thực.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu mới và xác nhận mật khẩu phải giống nhau.");
      return;
    }

    setLoading(true);
    try {
      const payload: ResetPasswordRequest = {
        email,
        verificationCode,
        newPassword,
      };

      const response: ActionResponse = await authApi.resetPassword(payload);

      if (response.success) {
        setSuccessMsg("Đổi mật khẩu thành công. Bạn có thể quay lại trang đăng nhập.");
        // Giữ nguyên UI, không auto-redirect. Người dùng có thể click link dưới để về login.
      } else {
        setErrorMsg(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err: unknown) {
      let msg = "Không thể kết nối đến server. Vui lòng thử lại sau.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message ?? msg;
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="English 4 Us"
            className="w-[125px] h-[120px]"
          />
        </div>

        <h2 className="text-center text-2xl font-bold text-blue-500 mb-6">
          {submitted ? "Reset Password" : "Forgot Password"}
        </h2>

        {submitted ? (
          // === Phần UI nhập mã xác thực + mật khẩu mới ===
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Hiển thị email readonly */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-gray-100 border border-gray-300 rounded-full py-2 px-4 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                placeholder="Enter code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-red-500 text-center">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-sm text-green-600 text-center">{successMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-300" : "bg-indigo-400 hover:bg-indigo-500"
              } text-white rounded-full py-2 text-sm font-semibold transition-colors`}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        ) : (
          // === Phần UI nhập email để gửi mã ===
          <form onSubmit={handleSendCode} className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-2">
              Enter your email and we’ll send you a code to reset your password.
            </p>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {errorMsg && (
              <p className="text-sm text-red-500 text-center">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-sm text-green-600 text-center">{successMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-300" : "bg-indigo-400 hover:bg-indigo-500"
              } text-white rounded-full py-2 text-sm font-semibold transition-colors`}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
