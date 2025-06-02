// src/api/cachedSetApi.ts

import axiosClient from "./axiosClient";

/**
 * Each item returned from GET /api/cached-sets
 * {
 *   setId: string;       // ID of the vocabulary set
 *   setName: string;     // Name of the set
 *   wordCount: number;   // Total number of words in the set
 *   learnedWords: number;// Number of words the user has learned in this set
 *   isDeleted: boolean;  // Whether the set has been deleted
 * }
 */
export interface CachedSetItem {
  setId: string;
  setName: string;
  wordCount: number;
  learnedWords: number;
  isDeleted: boolean;
}
export interface CacheResponse {
  message: string;
  data: CachedSetItem;
}

/**
 * GET /api/cached-sets
 * Response body: CachedSetItem[]
 */
export async function getCachedSets(): Promise<CachedSetItem[]> {
  const response = await axiosClient.get<CachedSetItem[]>("​/api/cached-sets");
  return response.data;
}

export async function saveCachedSet(params: {
  setId: string;
  learnedWords: number;
}): Promise<CacheResponse> {
  const response = await axiosClient.post<CacheResponse>(
    `/api/cached-sets`,
    {
      setId: params.setId,
      learnedWords: params.learnedWords,
    }
  );
  return response.data;
}

export default {
  getCachedSets,
  saveCachedSet,
};
