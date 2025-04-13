import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = "http://localhost:8080"; // Update with your gateway URL

// =====================
// Interfaces
// =====================
export interface VocabularyWord {
  id?: string;
  setId?: string;
  position?: number;
  word: string;
  pronunciation: string;
  translation: string;
  example: string;
  imageUrl?: string;
}

export interface VocabularySet {
  id?: string;
  name: string;
  wordCount?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  isDeleted?: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

// =====================
// Set Operations
// =====================

export const createVocabularySet = async (userId: string, data: {
  name: string;
  words?: VocabularyWord[];
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/sets`, data, {
      params: { userId }
    });
    return response.data;
  } catch (err) {
    console.error("Error creating vocabulary set:", err);
    throw err;
  }
};

export const getVocabularySetById = async (setId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sets/${setId}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching vocabulary set:", err);
    throw err;
  }
};

export const getVocabularySets = async (page: number = 1, size: number = 10): Promise<PaginatedResponse<VocabularySet>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sets`, {
      params: { page, size }
    });
    return {
      data: response.data.sets || [],
      totalItems: response.data.totalItems || 0,
      totalPages: response.data.totalPages || 1
    };
  } catch (err) {
    console.error("Error fetching vocabulary sets:", err);
    throw err;
  }
};

export const searchVocabularySets = async (query: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<VocabularySet>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sets/search`, {
      params: { query, page, size }
    });
    return {
      data: response.data.sets || [],
      totalItems: response.data.totalItems || 0,
      totalPages: response.data.totalPages || 1
    };
  } catch (err) {
    console.error("Error searching vocabulary sets:", err);
    throw err;
  }
};

export const updateVocabularySet = async (setId: string, data: {
  name?: string;
  isDeleted?: boolean;
}) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/sets/${setId}`, data);
    return response.data;
  } catch (err) {
    console.error("Error updating vocabulary set:", err);
    throw err;
  }
};

export const deleteVocabularySet = async (setId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/sets/${setId}`);
    return response.data;
  } catch (err) {
    console.error("Error deleting vocabulary set:", err);
    throw err;
  }
};

// =====================
// Word Operations
// =====================

export const createVocabularyWords = async (request: {
  setId: string;
  words: VocabularyWord[];
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/words`, request);
    return response.data.words || [];
  } catch (err) {
    console.error("Error creating vocabulary words:", err);
    throw err;
  }
};

export const getVocabularyWords = async (setId: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<VocabularyWord>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/words`, {
      params: { setId, page, size }
    });
    return {
      data: response.data.words || [],
      totalItems: response.data.totalItems || 0,
      totalPages: response.data.totalPages || 1
    };
  } catch (err) {
    console.error("Error fetching vocabulary words:", err);
    throw err;
  }
};

export const searchVocabularyWords = async (setId: string, query: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<VocabularyWord>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/words/search`, {
      params: { setId, query, page, size }
    });
    return {
      data: response.data.words || [],
      totalItems: response.data.totalItems || 0,
      totalPages: response.data.totalPages || 1
    };
  } catch (err) {
    console.error("Error searching vocabulary words:", err);
    throw err;
  }
};

export const updateVocabularyWord = async (wordId: string, data: {
  word?: string;
  pronunciation?: string;
  translation?: string;
  example?: string;
  imageUrl?: string;
}) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/words/${wordId}`, data);
    return response.data;
  } catch (err) {
    console.error("Error updating vocabulary word:", err);
    throw err;
  }
};

export const switchWordPositions = async (setId: string, firstWordId: string, secondWordId: string) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/words/switch-position`, {
      setId,
      firstWordId,
      secondWordId
    });
    return response.data;
  } catch (err) {
    console.error("Error switching word positions:", err);
    throw err;
  }
};

export const uploadWordImage = async (wordId: string, imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/words/${wordId}/image`, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error uploading word image:", err);
    throw err;
  }
};

export const deleteVocabularyWords = async (wordIds: string[]) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/words`, {
      data: { wordIds }
    });
    return response.data;
  } catch (err) {
    console.error("Error deleting vocabulary words:", err);
    throw err;
  }
};

// =====================
// Utility Functions
// =====================

const generateSampleWords = (count: number): VocabularyWord[] => {
  const sampleWords = [
    {
      word: "apple",
      pronunciation: "/ˈæp.əl/",
      translation: "quả táo",
      example: "I eat an apple every day.",
      imageUrl: "https://example.com/apple.jpg"
    },
    {
      word: "book",
      pronunciation: "/bʊk/",
      translation: "cuốn sách",
      example: "This book is very interesting.",
      imageUrl: "https://example.com/book.jpg"
    }
  ];

  return Array.from({ length: count }, (_, i) => ({
    ...sampleWords[i % sampleWords.length],
    id: uuidv4()
  }));
};

export const generateSampleVocabularySets = async (count = 5) => {
  const userId = uuidv4();
  const promises = [];

  for (let i = 1; i <= count; i++) {
    const words = generateSampleWords(5);
    const payload = {
      name: `Bộ từ mẫu ${i}`,
      words
    };
    promises.push(createVocabularySet(userId, payload));
  }

  return Promise.all(promises);
};