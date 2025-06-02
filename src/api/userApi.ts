// src/api/userApi.ts

import axiosClient from "./axiosClient";

export interface UserInfo {
  userId: string;
  name: string;
  email: string;
  joinAt: string;
  locked: boolean;
  role: string;
}

export interface LearnerStatistic {
  userId: string;
  name: string;
  email: string;
  joinAt: string;
  totalTestsTaken: number;
  avgScore: number;
  locked: boolean;
}

export interface AdminStatistic {
  userId: string;
  name: string;
  email: string;
  joinAt: string;
  totalTestsPublished: number;
  totalSetsPublished: number;
  locked: boolean;
}

export interface LearnerStatsResponse {
  learners: LearnerStatistic[];
  totalItems: number;
  totalPages: number;
}

export interface AdminStatsResponse {
  admins: AdminStatistic[];
  totalItems: number;
  totalPages: number;
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
  // … các hàm getLearnerStatistics, getAdminStatistics, createAdminAccount, v.v.

  // PATCH /api/users/lock?id=<userId>&isLocked=<boolean>
  async lockOrUnlockUser(
    userId: string,
    isLocked: boolean
  ): Promise<UserInfo> {
    const response = await axiosClient.patch<UserInfo>(`/api/users/lock`, null, {
      params: { id: userId, isLocked },
    });
    return response.data;
  },

  // GET /api/statistic/learner?page=<page>&size=<size>
  async getLearnerStatistics(
    page: number,
    size: number
  ): Promise<LearnerStatsResponse> {
    const response = await axiosClient.get<LearnerStatsResponse>(
      `/api/statistic/learner?page=${page}&size=${size}`
    );
    return response.data;
  },

  // GET /api/statistic/admin?page=<page>&size=<size>
  async getAdminStatistics(
    page: number,
    size: number
  ): Promise<AdminStatsResponse> {
    const response = await axiosClient.get<AdminStatsResponse>(
      `/api/statistic/admin?page=${page}&size=${size}`
    );
    return response.data;
  },

  // POST /api/accounts/admin
  async createAdminAccount(
    payload: CreateAdminRequest
  ): Promise<CreateAdminResponse> {
    const response = await axiosClient.post<CreateAdminResponse>(
      `/api/accounts/admin`,
      payload
    );
    return response.data;
  },

  // GET /api/users  (lấy thông tin current user)
  async getCurrentUser(): Promise<UserInfo> {
    const response = await axiosClient.get<UserInfo>(`/api/users`);
    return response.data;
  },
};

export default userApi;
