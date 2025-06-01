// src/pages/Auth/LoginPage.tsx

import React, { useState } from "react";
import logo from "../../../assets/logo-removebg-preview (1).png";
import googleLogo from "../../../assets/google.png";
import facebookLogo from "../../../assets/facebook.png";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import authApi, { LoginCredRequest, OAuthLoginRequest } from "../../../api/authApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";

/**
 * Hàm helper: giải mã phần payload của JWT (base64URL → JSON)
 * Trả về Record<string, unknown> thay vì any.
 */
function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 =
      base64Url.replace(/-/g, "+").replace(/_/g, "/") +
      "===".slice((base64Url.length + 3) % 4);
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload) as Record<string, unknown>;
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

const LoginPage: React.FC = () => {
  // 1. State
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const navigate = useNavigate();

  // 2. Login bằng email/password
  const handleLogin = async (): Promise<void> => {
    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng nhập email và mật khẩu.");
      return;
    }
    try {
      setLoadingLogin(true);
      const payload: LoginCredRequest = { email, password };
      const response = await authApi.loginWithCred(payload);

      // 2.1. Lưu token vào localStorage
      const { accessToken, refreshToken } = response;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 2.2. Giải mã JWT để lấy thông tin role
      const decoded = parseJwt(accessToken);
      const userRole = decoded?.role as string | undefined;

      toast.success("Đăng nhập thành công!");

      // 2.3. Điều hướng theo role
      if (userRole === "ADMIN" || userRole === "SYSTEM_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg =
          (error.response?.data as { message?: string })?.message ||
          "Đăng nhập thất bại.";
        toast.error(msg);
      } else {
        toast.error("Lỗi không xác định. Vui lòng thử lại.");
      }
      console.error(error);
    } finally {
      setLoadingLogin(false);
    }
  };

  // 3. Login OAuth (Google/Facebook)
  const handleOAuthLogin = async (provider: "google" | "facebook"): Promise<void> => {
    try {
      // TODO: Tích hợp SDK OAuth để lấy accessToken thật từ Google/Facebook
      const oauthToken = ""; // placeholder
      if (!oauthToken) {
        toast.error("Không lấy được token từ " + provider);
        return;
      }

      const payload: OAuthLoginRequest = { provider, accessToken: oauthToken };
      const response = await authApi.loginWithProvider(payload);

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      // Cũng cần decode JWT và điều hướng tương tự
      const decoded = parseJwt(response.accessToken);
      const userRole = decoded?.role as string | undefined;

      toast.success(`Đăng nhập với ${provider} thành công!`);

      if (userRole === "ADMIN" || userRole === "SYSTEM_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg =
          (error.response?.data as { message?: string })?.message ||
          `Đăng nhập ${provider} thất bại.`;
        toast.error(msg);
      } else {
        toast.error(`Lỗi khi đăng nhập ${provider}.`);
      }
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <ToastContainer position="top-right" />
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl relative">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="English 4 Us" className="w-[125px] h-[120px]" />
        </div>

        <div
          className="text-center font-bold text-[30px] mb-6"
          style={{ color: "rgba(81, 202, 242, 0.54)" }}
        >
          Login
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-600">
            <FaUser />
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-600">
            <FaLock />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loadingLogin}
          className="w-full bg-indigo-400 text-white rounded-full py-2 text-sm font-semibold hover:bg-indigo-500 transition-colors mb-3 disabled:opacity-50"
        >
          {loadingLogin ? "Đang đăng nhập…" : "Login"}
        </button>

        <div className="text-center text-xs text-blue-600 font-semibold mb-4">
          <button
            onClick={() => navigate("/forgot-password")}
            className="hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <div className="flex items-center my-6 text-gray-500 text-xs font-semibold">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="space-y-5">
          <button
            onClick={() => handleOAuthLogin("facebook")}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-300 py-2 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
          >
            <img
              src={facebookLogo}
              alt="Facebook logo"
              className="h-5 w-5"
            />
            Continue with Facebook
          </button>

          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-300 py-2 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
          >
            <img src={googleLogo} alt="Google logo" className="h-5 w-5" />
            Continue with Google
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Don't you have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
