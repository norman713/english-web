import axiosClient from "./axiosClient";

// Interface cho request/response

// 1.1 Validate trước khi register
export interface ValidateRegisterInfoRequest {
  email: string;
  password: string;
}

// 1.2 Response chung cho validate, register (ActionResponse)
export interface ActionResponse {
  success: boolean;
  message: string;
}

// 1.3 RegisterWithCredentials request
export interface RegisterWithCredentialsRequest {
  name: string;
  email: string;
  password: string;
  verificationCode: string;
}

// 1.4 Login bằng email/password
export interface LoginCredRequest {
  email: string;
  password: string;
}
export interface LoginCredResponse {
  accessToken: string;
  refreshToken: string;
}

// 1.5 Login với OAuth provider
export interface OAuthLoginRequest {
  provider: "google" | "facebook";
  accessToken: string;
}
export interface OAuthLoginResponse {
  accessToken: string;
  refreshToken: string;
}

// 1.6 Refresh token → get new access
export interface RefreshAccessResponse {
  accessToken: string;
}

// 1.7 Kiểm tra email đã đăng ký?
export interface IsAccountRegisteredRequest {
  email: string;
}
export interface IsAccountRegisteredResponse {
  registered: boolean;
}

// 1.8 Gửi mã xác thực qua email
export interface SendVerificationEmailRequest {
  email: string;
  type: string; // e.g., "REGISTER" | "RESET"
}

// 1.9 Đặt lại mật khẩu
export interface ResetPasswordRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
}

// 2. Định nghĩa authApi, không dùng any

const authApi = {
  // 2.1 POST /api/auth/validate
  async validateRegisterInfo(
    payload: ValidateRegisterInfoRequest
  ): Promise<ActionResponse> {
    const url = "/api/auth/validate";
    const response = await axiosClient.post<ActionResponse>(url, payload);
    return response.data;
  },

  // 2.2 POST /api/auth/register
  async registerWithCredentials(
    payload: RegisterWithCredentialsRequest
  ): Promise<ActionResponse> {
    const url = "/api/auth/register";
    const response = await axiosClient.post<ActionResponse>(url, payload);
    return response.data;
  },

  // 2.3 POST /api/auth/cred (login normal)
  async loginWithCred(payload: LoginCredRequest): Promise<LoginCredResponse> {
    const url = "/api/auth/cred";
    const response = await axiosClient.post<LoginCredResponse>(url, payload);
    return response.data;
  },

  // 2.4 POST /api/auth/prov (login OAuth)
  async loginWithProvider(
    payload: OAuthLoginRequest
  ): Promise<OAuthLoginResponse> {
    const url = "/api/auth/prov";
    const response = await axiosClient.post<OAuthLoginResponse>(url, payload);
    return response.data;
  },

  // 2.5 GET /api/auth/access?refreshToken=...
  async refreshAccess(refreshToken: string): Promise<RefreshAccessResponse> {
    const url = `/api/auth/access?refreshToken=${encodeURIComponent(
      refreshToken
    )}`;
    const response = await axiosClient.get<RefreshAccessResponse>(url);
    return response.data;
  },

  // 2.6 GET /api/auth/registered?email=...
  async isAccountRegistered(
    email: string
  ): Promise<IsAccountRegisteredResponse> {
    const url = `/api/auth/registered?email=${encodeURIComponent(email)}`;
    const response = await axiosClient.get<IsAccountRegisteredResponse>(url);
    return response.data;
  },
    async sendResetCode(email: string): Promise<ActionResponse> {
    const url = `/api/auth/reset?email=${encodeURIComponent(email)}`;
    const response = await axiosClient.get<ActionResponse>(url);
    return response.data;
  },
  // 2.7 POST /api/auth/reset
 // Nếu endpoint thực sự là GET /api/auth/reset?email=...
async sendVerificationEmail(email: string): Promise<ActionResponse> {
  const url = `/api/auth/reset?email=${encodeURIComponent(email)}`;
  const response = await axiosClient.get<ActionResponse>(url);
  return response.data;
}
,

  // 2.8 POST /api/auth/register-prov (đăng ký OAuth)
  async registerWithProvider(
    payload: OAuthLoginRequest
  ): Promise<ActionResponse> {
    const url = "/api/auth/register-prov";
    const response = await axiosClient.post<ActionResponse>(url, payload);
    return response.data;
  },

  // 2.9 POST /api/auth/reset
  async resetPassword(
    payload: ResetPasswordRequest
  ): Promise<ActionResponse> {
    const url = "/api/auth/reset";
    const response = await axiosClient.post<ActionResponse>(url, payload);
    return response.data;
  },
};

export default authApi;
