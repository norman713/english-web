import axiosClient from "./axiosClient";

// Interface cho dữ liệu từ vựng
export interface VocabWord {
  id?: string;               // thêm id nếu cần render list
  setId?: string;            // liên kết với set
  position?: number;         // để sắp xếp
  word: string;
  pronunciation?: string;
  translation: string;
  example?: string;
  imageUrl?: string;
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

// Giữ nguyên các interface cũ
export interface VocabSet {
  id: string;
  name: string;
  wordCount: number;
  createdBy?: string;
  createAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  version?: string; // Thêm version nếu cần
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
// Response sau khi cập nhật (cả name và words)
export interface UpdateSetResponse {
  id: string;
  name: string;
  version: number;
  updatedBy: string;
  updateAt: string;
}

const setApi = {
  async getAll(page: number, size: number): Promise<GetSetsResponse> {
    const url = `/api/sets?page=${page}&size=${size}`;
    const response = await axiosClient.get<GetSetsResponse>(url);
    return response.data;
  },

  async createSet(userId: string , payload: CreateSetRequest): Promise<CreateSetResponse> {
    const url = `/api/sets?userId=${userId}`;
    const response = await axiosClient.post<CreateSetResponse>(url, payload);
    return response.data;
  },
  // 🆕 Lấy thông tin chi tiết 1 set
  async getSetById(setId: string): Promise<VocabSet> {
    const url = `/api/sets/${setId}`;
    const response = await axiosClient.get<VocabSet>(url);
    return response.data;
  },

  // 🆕 Lấy danh sách từ trong set
  async getWordsBySetId(setId: string, page = 1, size = 10): Promise<GetWordsResponse> {
    const url = `/api/words?setId=${setId}&page=${page}&size=${size}`;
    const response = await axiosClient.get<GetWordsResponse>(url);
    return response.data;
  },
  // PATCH /api/sets/{id}/name
async updateSetName(
  setId: string,
  userId: string,
  name: string
): Promise<UpdateSetResponse> {
  const url = `/api/sets/${setId}/name?userId=${userId}&name=${encodeURIComponent(name)}`;
  const response = await axiosClient.patch<UpdateSetResponse>(url);
  return response.data;
},

// PATCH /api/sets/{id}
async updateSetById(
  setId: string,
  userId: string,
  payload: { words: VocabWord[] }
): Promise<UpdateSetResponse> {
  const url = `/api/sets/${setId}?userId=${userId}`;
  const response = await axiosClient.patch<UpdateSetResponse>(url, payload);
  return response.data;
},

 /** Xoá mềm 1 set (backend sẽ đọc userId từ JWT) */
  async deleteSet(id: string): Promise<void> {
    await axiosClient.delete(`/api/sets`, {
      params: { id },
    });
  },

  /** Lấy danh sách các set đã xóa */
  async getDeletedAll(page: number, size: number): Promise<GetSetsResponse> {
    const url = `/api/sets/deleted?page=${page}&size=${size}`;
    const response = await axiosClient.get<GetSetsResponse>(url);
    return response.data;
  },

  /** Khôi phục 1 set đã xóa (backend đọc userId từ JWT) */
  async restoreSet(id: string): Promise<void> {
    await axiosClient.patch(`/api/sets/restore`, null, {
      params: { id },
    });
  },  


  
};

export default setApi;