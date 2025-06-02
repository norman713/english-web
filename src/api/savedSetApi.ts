// src/api/savedSetApi.ts
import axiosClient from "./axiosClient";

/**
 * Mỗi phần tử trong mảng "sets" trả về từ GET /api/saved-sets
 * {
 *   id: string;          // ID của bản ghi saved-set (do backend tạo)
 *   setId: string;       // ID của bộ từ gốc
 *   setName: string;     // Tên bộ từ
 *   wordCount: number;   // Tổng số từ trong bộ
 *   learnedWords: number;// Số từ đã học (trong bộ này)
 *   isDeleted: boolean;  // Bộ này có bị xóa không
 * }
 */
export interface SavedSetItem {
  id: string;
  setId: string;
  setName: string;
  wordCount: number;
  learnedWords: number;
  isDeleted: boolean;
}

/**
 * GET /api/saved-sets?page=&size=
 * Response body:
 * {
 *   "sets": SavedSetItem[],
 *   "totalItems": number,
 *   "totalPages": number
 * }
 */
export interface GetSavedSetsResponse {
  sets: SavedSetItem[];
  totalItems: number;
  totalPages: number;
}

/**
 * GET /api/saved-sets/state
 * Response:
 * {
 *   "notLearned": number,
 *   "learning": number,
 *   "learned": number
 * }
 */
export interface SavedSetsState {
  notLearned: number;
  learning: number;
  learned: number;
}

const savedSetApi = {
  /**
   * POST /api/saved-sets
   * Save một bộ từ cho user hiện tại. Body: { setId: string }
   * Trả về SavedSetItem mới tạo.
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
   * Xóa (soft delete) một SavedSet theo ID của record.
   */
  async deleteSavedSet(savedSetId: string): Promise<void> {
    await axiosClient.delete(`/api/saved-sets/${savedSetId}`);
  },

  /**
   * GET /api/saved-sets?page=<page>&size=<size>
   * Lấy danh sách các SavedSetItem (phân trang).
   */
  async getSavedSets(page: number, size: number): Promise<GetSavedSetsResponse> {
    const response = await axiosClient.get<GetSavedSetsResponse>(
      `/api/saved-sets?page=${page}&size=${size}`
    );
    return response.data;
  },

  /**
   * GET /api/saved-sets/state
   * Lấy thống kê tình trạng (notLearned, learning, learned).
   */
  async getSavedSetsState(): Promise<SavedSetsState> {
    const response = await axiosClient.get<SavedSetsState>(
      `/api/saved-sets/state`
    );
    return response.data;
  },
};

export default savedSetApi;
