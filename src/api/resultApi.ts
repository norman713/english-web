// src/api/resultApi.ts
import axiosClient from "./axiosClient";

export interface ResultDetailDTO {
  id: string;
  testName: string;
  testId: string;
  correctAnswers: number;
  incorrectAnswers: number;
  emptyAnswers: number;
  score: number;
  accuracy: number;
  secondsSpent: number;
  details: Array<{
    id: string;
    questionId: string;
    position: number;
    userAnswer: string;
    state: "CORRECT" | "INCORRECT" | "EMPTY";
  }>;
}

export interface PaginatedResultsDTO {
  results: Array<{
    id: string;
    testName: string;
    submitTime: string;
    score: number;
    secondsSpent: number;
  }>;
  totalItems: number;
  totalPages: number;
}

/**
 * Lưu kết quả của một bài thi.
 * POST /api/results
 * Body: {
 *   testId: string;
 *   secondsSpent: number;
 *   userAnswers: { [questionId: string]: string }
 * }
 * Response: { id: string }
 */
export async function postResult(
  testId: string,
  secondsSpent: number,
  userAnswers: { [questionId: string]: string }
): Promise<{ id: string }> {
  const url = `/api/results`;
  const response = await axiosClient.post<{ id: string }>(url, {
    testId,
    secondsSpent,
    userAnswers,
  });
  return response.data;
}

/**
 * Lấy chi tiết một kết quả theo resultId:
 * GET /api/results/{id}
 */
export async function getResultById(
  resultId: string
): Promise<ResultDetailDTO> {
  const url = `/api/results/${encodeURIComponent(resultId)}`;
  const response = await axiosClient.get<ResultDetailDTO>(url);
  return response.data;
}

/**
 * Lấy danh sách kết quả của user, phân trang:
 * GET /api/results?page={page}&size={size}
 */
export async function getPaginatedResults(
  page: number,
  size: number
): Promise<PaginatedResultsDTO> {
  const url = `/api/results?page=${page}&size=${size}`;
  const response = await axiosClient.get<PaginatedResultsDTO>(url);
  return response.data;
}

export default {
  postResult,
  getResultById,
  getPaginatedResults,
};
