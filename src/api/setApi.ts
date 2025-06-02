// src/api/setApi.ts

import axiosClient from "./axiosClient";
import axios from "axios"; // dùng cho multipart/form-data

// Interface cho dữ liệu từ vựng
export interface VocabWord {
  id?: string;            // id do backend tạo (UUID)
  setId?: string;         // liên kết với set
  position?: number;      // thứ tự
  word: string;
  pronunciation?: string;
  translation: string;
  example?: string;
  imageUrl?: string;      // URL ảnh (nếu có)
}

// Interface cho request tạo mới set
export interface CreateSetRequest {
  name: string;
  words: VocabWord[];
}

// Interface cho response tạo mới set
export interface CreateSetResponse {
  id: string;
  name: string;
  wordCount: number;
  createdAt: string;
}

// Interface cho VocabSet (admin)
export interface VocabSet {
  id: string;
  name: string;
  wordCount: number;
  createdBy?: string;
  createAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  version?: string; // Phiên bản
}

export interface GetSetsResponse {
  sets: VocabSet[];
  totalItems: number;
  totalPages: number;
}

export interface GetWordsResponse {
  words: VocabWord[];
  totalItems: number;
  totalPages: number;
}

// Response sau khi cập nhật (cả tên và words)
export interface UpdateSetResponse {
  id: string;
  name: string;
  version: number;
  updatedBy: string;
  updateAt: string;
}
export interface UploadImageResponse {
  success: boolean;
  message: string;
}

const setApi = {
  /** Lấy danh sách các bộ từ (phân trang) */
  async getAll(page: number, size: number): Promise<GetSetsResponse> {
    const url = `/api/sets?page=${page}&size=${size}`;
    const response = await axiosClient.get<GetSetsResponse>(url);
    return response.data;
  },

  /** Tạo mới một bộ từ */
  async createSet(
    userId: string,
    payload: CreateSetRequest
  ): Promise<CreateSetResponse> {
    const url = `/api/sets?userId=${userId}`;
    const response = await axiosClient.post<CreateSetResponse>(url, payload);
    return response.data;
  },

  /** Lấy chi tiết một bộ từ (admin) */
  async getSetById(setId: string): Promise<VocabSet> {
    const url = `/api/sets/${setId}`;
    const response = await axiosClient.get<VocabSet>(url);
    return response.data;
  },

  /** Lấy danh sách từ của một set (phân trang) */
  async getWordsBySetId(
    setId: string,
    page = 1,
    size = 10
  ): Promise<GetWordsResponse> {
    const url = `/api/words?setId=${setId}&page=${page}&size=${size}`;
    const response = await axiosClient.get<GetWordsResponse>(url);
    return response.data;
  },

  /** Upload ảnh cho một từ  
   *  POST /api/words/image?setId=<>&wordId=<>
   */
  async uploadWordImage(
    setId: string,
    wordId: string,
    file: File
  ): Promise<{ success: boolean; message: string }> {
    const url = `/api/words/image?setId=${encodeURIComponent(
      setId
    )}&wordId=${encodeURIComponent(wordId)}`;

    // Tạo FormData rồi gửi multipart/form-data
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /** Cập nhật tên bộ từ (patch) */
  async updateSetName(
    setId: string,
    userId: string,
    name: string
  ): Promise<UpdateSetResponse> {
    const url = `/api/sets/${setId}/name?userId=${userId}&name=${encodeURIComponent(
      name
    )}`;
    const response = await axiosClient.patch<UpdateSetResponse>(url);
    return response.data;
  },

  /** Cập nhật bộ từ theo ID, bao gồm danh sách words */  
  async updateSetById(
    setId: string,
    userId: string,
    payload: { words: VocabWord[] }
  ): Promise<UpdateSetResponse> {
    const url = `/api/sets/${setId}?userId=${userId}`;
    const response = await axiosClient.patch<UpdateSetResponse>(url, payload);
    return response.data;
  },

  /** Xoá mềm một bộ từ (backend lấy userId từ JWT) */
  async deleteSet(id: string): Promise<void> {
    await axiosClient.delete(`/api/sets`, {
      params: { id },
    });
  },

  /** Lấy danh sách bộ từ đã xoá (admin) */
  async getDeletedAll(page: number, size: number): Promise<GetSetsResponse> {
    const url = `/api/sets/deleted?page=${page}&size=${size}`;
    const response = await axiosClient.get<GetSetsResponse>(url);
    return response.data;
  },

  /** Khôi phục một bộ từ đã xoá (admin) */
  async restoreSet(id: string): Promise<void> {
    await axiosClient.patch(`/api/sets/restore`, null, {
      params: { id },
    });
  },
};

export default setApi;
