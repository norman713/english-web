// src/api/userApi.ts
import axiosClient from "./axiosClient";

export interface CurrentUserDto {
  id: string;
  name: string;
  avatarUrl?: string;
  joinAt: string;
  isLocked: boolean;
}

const userApi = {
  /**
   * GET /api/users/{id}
   * Trả về thông tin user (id, name, avatarUrl, ...)
   */
  async getUserById(userId: string): Promise<CurrentUserDto> {
    const response = await axiosClient.get<CurrentUserDto>(`/api/users/${userId}`);
    return response.data;
  },

  /**
   * Nếu backend có endpoint "GET /api/accounts/me" (Auth Service) trả về account đã đăng nhập
   * có chứa userId, bạn cũng có thể gọi API đó để lấy userId → rồi dùng getUserById(userId).
   * Ví dụ:
   *
   * async getCurrentAccount(): Promise<{ userId: string; email: string; role: string }> {
   *   const response = await axiosClient.get("/api/accounts/me");
   *   return response.data; 
   * }
   */
};

export default userApi;
