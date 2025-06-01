import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo-removebg-preview (1).png";

const ResetPasswordPage = () => {
  const location = useLocation();
  const email = (location.state as any)?.email;
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const correctCode = "123456"; // Mã xác thực cố định để demo

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationCode !== correctCode) {
      alert("Verification code is incorrect.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Gửi mật khẩu mới lên server để cập nhật tại đây
    console.log("Password for", email, "reset to", newPassword);
    alert("Password reset successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-md">
        <div className="flex justify-center">
          <img src={logo} alt="English 4 Us" className="w-[125px] h-[120px]" />
        </div>
        <h2 className="text-center text-2xl font-bold text-blue-500 mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            required
            className="w-full border rounded-full px-4 py-2 text-sm"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border rounded-full px-4 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border rounded-full px-4 py-2 text-sm"
          />
          <button
            className="w-full bg-indigo-400 text-white rounded-full py-2 text-sm font-semibold hover:bg-indigo-500 transition-colors"
            onClick={() => navigate("/")}
          >
            Save New Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
