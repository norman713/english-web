import React, { useState } from "react";
import logo from "../../../assets/logo-removebg-preview (1).png";
import { FaUserFriends, FaBookOpen, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import authApi, {
  ValidateRegisterInfoRequest,
  RegisterWithCredentialsRequest,
} from "../../../api/authApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";

const SignUpPage: React.FC = () => {
  // 1. Các state giữ giá trị input và bước hiện tại
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // step = "VALIDATE" (chưa validate) hoặc "REGISTER" (đã validate thành công, đang chờ code để register)
  const [step, setStep] = useState<"VALIDATE" | "REGISTER">("VALIDATE");

  const [loadingValidate, setLoadingValidate] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  const navigate = useNavigate();

  // 2. Bước 1: Validate email + password => backend cũng sẽ gửi code về email (theo message controller)
  //    Nếu thành công, chuyển qua step "REGISTER"
  const handleValidate = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    try {
      setLoadingValidate(true);
      const payload: ValidateRegisterInfoRequest = { email, password };

      const response = await authApi.validateRegisterInfo(payload);
      // response: { success: boolean, message: string }

      if (response.success) {
        toast.success(response.message || "Validate thành công. Mã đã được gửi vào email.");
        setStep("REGISTER");
      } else {
        // backend trả success: false, kèm message
        toast.error(response.message || "Validate thất bại.");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        // Nếu server trả 400/500, lấy message nếu có
        const msg =
          (error.response?.data as { message?: string })?.message ||
          "Có lỗi khi validate. Vui lòng thử lại.";
        toast.error(msg);
      } else {
        toast.error("Lỗi không xác định. Vui lòng thử lại.");
      }
      console.error(error);
    } finally {
      setLoadingValidate(false);
    }
  };

  // 3. Bước 2: Register với code (POST /api/auth/register)
  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !verificationCode.trim()) {
      toast.error("Vui lòng điền đầy đủ: tên, email, mật khẩu và mã xác thực.");
      return;
    }
    try {
      setLoadingRegister(true);
      const payload: RegisterWithCredentialsRequest = {
        name,
        email,
        password,
        verificationCode,
      };

      const response = await authApi.registerWithCredentials(payload);
      // response: { success: boolean, message: string }

      if (response.success) {
        toast.success("Đăng ký thành công! Chuyển đến trang đăng nhập…");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(response.message || "Đăng ký thất bại.");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg =
          (error.response?.data as { message?: string })?.message ||
          "Có lỗi khi đăng ký. Vui lòng thử lại.";
        toast.error(msg);
      } else {
        toast.error("Lỗi không xác định. Vui lòng thử lại.");
      }
      console.error(error);
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <ToastContainer position="top-right" />

      <div className="bg-white rounded-[30px] p-8 w-full max-w-sm shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <img src={logo} alt="English 4 Us" className="w-[120px] h-[100px]" />
        </div>

        {/* Title */}
        <h2 className="text-center text-blue-500 font-bold text-xl mb-6">Sign Up</h2>

        {/* Tên (chỉ cho nhập khi đã bước REGISTER) */}
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
            disabled={step !== "REGISTER"}
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
            disabled={step !== "VALIDATE"}
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
            <FaLock />
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full pl-10 pr-3 py-2 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={step !== "VALIDATE"}
          />
        </div>

        {/* Button Validate (bước 1) */}
        {step === "VALIDATE" && (
          <button
            onClick={handleValidate}
            disabled={loadingValidate}
            className="w-full bg-indigo-400 hover:bg-indigo-500 text-white rounded-full py-2 font-semibold transition-colors mb-4 disabled:opacity-50"
          >
            {loadingValidate ? "Đang kiểm tra…" : "Validate & Send Code"}
          </button>
        )}

        {/* Khi đã validate thành công (step === "REGISTER") */}
        {step === "REGISTER" && (
          <>
            {/* Verification Code */}
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                <FaLock />
              </span>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                className="w-full pl-10 pr-3 py-2 rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Button Sign Up */}
            <button
              onClick={handleRegister}
              disabled={loadingRegister}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-2 font-semibold transition-colors disabled:opacity-50"
            >
              {loadingRegister ? "Đang đăng ký…" : "Sign Up"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
