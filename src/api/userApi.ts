// src/api/userApi.ts

import axiosClient from "./axiosClient";

export interface LearnerStatistic {
  userId: string;
  name: string;
  email: string;
  joinAt: string;         // ví dụ "15-01-2024 10:30:00"
  totalTestsTaken: number;
  avgScore: number;       // ví dụ 1 (=100%), 0.5 (=50%), ...
  locked: boolean;
}

export interface LearnerStatisticsResponse {
  learners: LearnerStatistic[];
  totalItems: number;
  totalPages: number;
}

export interface AdminStatistic {
  userId: string;
  name: string;
  email: string;
  joinAt: string;           // ví dụ "05-04-2024 09:15:00"
  totalTestsPublished: number;
  totalSetsPublished: number;
  locked: boolean;
}

export interface AdminStatisticsResponse {
  admins: AdminStatistic[];
  totalItems: number;
  totalPages: number;
}

export interface UserInfo {
  userId: string;
  name: string;
  avatarUrl?: string;
  role: "ADMIN" | "SYSTEM_ADMIN" | "LEARNER";
  locked: boolean;
}

// Các DTO cho avatar/upload
export interface UploadAvatarResponse {
  success: boolean;
  message: string; // chứa URL mới của avatar
}

export interface UpdateProfileRequest {
  name: string;
}

export interface UpdateProfileResponse {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateAdminResponse {
  success: boolean;
  message: string;
}

const userApi = {
  /** Lấy profile (có role, locked, name, email, avatarUrl …) của user hiện tại */
  async getCurrentUser(): Promise<UserInfo> {
    const response = await axiosClient.get<UserInfo>("/api/users");
    return response.data;
  },

  /** POST /api/users/avatar: Upload avatar mới, trả về URL */
  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosClient.post<UploadAvatarResponse>(
      "/api/users/avatar",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  /** PATCH /api/users: Cập nhật tên (và nếu backend hỗ trợ avatarUrl thì cũng có thể truyền) */
  async updateProfile(payload: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await axiosClient.patch<UpdateProfileResponse>(
      "/api/users",
      payload
    );
    return response.data;
  },

  /** GET /api/statistic/learner?page=&size= */
  async getLearnerStatistics(
    page: number,
    size: number
  ): Promise<LearnerStatisticsResponse> {
    const response = await axiosClient.get<LearnerStatisticsResponse>(
      `/api/statistic/learner?page=${page}&size=${size}`
    );
    return response.data;
  },

  /** GET /api/statistic/admin?page=&size= */
  async getAdminStatistics(
    page: number,
    size: number
  ): Promise<AdminStatisticsResponse> {
    const response = await axiosClient.get<AdminStatisticsResponse>(
      `/api/statistic/admin?page=${page}&size=${size}`
    );
    return response.data;
  },

  /**
   * PATCH /api/users/lock?id=<userId>&isLocked=<true|false>
   * Chỉ SYSTEM_ADMIN có quyền
   */
  async lockOrUnlockUser(
    userId: string,
    isLocked: boolean
  ): Promise<{ id: string; name: string; locked: boolean }> {
    const response = await axiosClient.patch<{ id: string; name: string; locked: boolean }>(
      `/api/users/lock?id=${encodeURIComponent(userId)}&isLocked=${isLocked}`
    );
    return response.data;
  },

  /**
   * POST /api/accounts/admin
   * Tạo mới tài khoản admin: { name, email, password }
   */
  async createAdminAccount(
    payload: CreateAdminRequest
  ): Promise<CreateAdminResponse> {
    const response = await axiosClient.post<CreateAdminResponse>(
      "/api/accounts/admin",
      payload
    );
    return response.data;
  },
};

export default userApi;
