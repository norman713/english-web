// src/api/cachedSetApi.ts

import axiosClient from "./axiosClient";

/**
 * Interface cho mỗi mục trả về từ GET /api/cached-sets
 * [
 *   {
 *     "setId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *     "setName": "string",
 *     "wordCount": 0,
 *     "learnedWords": 0,
 *     "isDeleted": true
 *   },
 *   ...
 * ]
 */
export interface CachedSetItem {
  setId: string;
  setName: string;
  wordCount: number;
  learnedWords: number;
  isDeleted: boolean;
}

const cachedSetApi = {
  /**
   * GET /api/cached-sets
   * Trả về mảng CachedSetItem[]
   */
  async getAllCachedSets(): Promise<CachedSetItem[]> {
    const response = await axiosClient.get<CachedSetItem[]>(
      `/api/cached-sets`
    );
    return response.data;
  },
};

export default cachedSetApi;
