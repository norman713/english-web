// src/api/savedSetApi.ts
import axiosClient from "./axiosClient";

export interface SavedSetItem {
  id: string;       // id của saved-set (do backend tạo ra)
  setId: string;    // id của bộ từ gốc
  userId: string;   // id của user đã lưu
}

export interface GetSavedSetsResponse {
  savedSets: SavedSetItem[];
  totalItems: number;
  totalPages: number;
}

const savedSetApi = {
  /**
   * POST /api/saved-sets
   * Save a vocabulary set cho user hiện tại.
   * Yêu cầu body: { setId: string }
   * Trả về: SavedSetItem
   */
  async saveSet(setId: string): Promise<SavedSetItem> {
    const response = await axiosClient.post<SavedSetItem>(
      `/api/saved-sets`,
      { setId }
    );
    return response.data;
  },

  /**
   * DELETE /api/saved-sets/{id}
   * Xóa một saved-set theo id.
   */
  async deleteSavedSet(savedSetId: string): Promise<void> {
    await axiosClient.delete(`/api/saved-sets/${savedSetId}`);
  },

  /**
   * GET /api/saved-sets?page=<page>&size=<size>
   * Lấy danh sách các set mà user đã lưu (phân trang).
   */
  async getSavedSets(page: number, size: number): Promise<GetSavedSetsResponse> {
    const response = await axiosClient.get<GetSavedSetsResponse>(
      `/api/saved-sets?page=${page}&size=${size}`
    );
    return response.data;
  },

  /**
   * GET /api/saved-sets/state
   * (Tuỳ lựa chọn) Lấy thống kê trạng thái saved set của user.
   */
  async getSavedSetsState(): Promise<unknown> {
    const response = await axiosClient.get<unknown>("/api/saved-sets/state");
    return response.data;
  },
};

export default savedSetApi;
