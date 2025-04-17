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
  }
};

export default setApi;