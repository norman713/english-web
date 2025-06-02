// src/api/statisticApi.ts

import axiosClient from "./axiosClient";


//
// Interfaces for Learner Statistics API
//
export interface Learner {
  userId: string;
  name: string;
  email: string;
  joinAt: string;
  totalTestsTaken: number;
  avgScore: number;
  locked: boolean;
}

export interface LearnerStatsResponse {
  learners: Learner[];
  totalItems: number;
  totalPages: number;
}

/**
 * Lấy thống kê learner.
 * GET /api/statistic/learner?page={page}&size={size}
 */
export async function getLearnerStats(
  page: number,
  size: number = 10
): Promise<LearnerStatsResponse> {
  const url = `/api/statistic/learner`;
  const response = await axiosClient.get<LearnerStatsResponse>(url, {
    params: { page, size },
  });
  return response.data;
}
export interface ResultStatisticDTO {
  time: string;
  resultCount: number;
  avgSecondsSpent: number;
  avgAccuracy: number;
}

/**
 * Lấy thống kê kết quả theo khoảng thời gian và nhóm WEEK|MONTH|YEAR
 * GET /api/results/statistic?from={from}&to={to}&groupBy={groupBy}
 */
export async function getResultStatistics(
  from: string,
  to: string,
  groupBy: "WEEK" | "MONTH" | "YEAR"
): Promise<ResultStatisticDTO[]> {
  const url = `/api/results/statistic?from=${from}&to=${to}&groupBy=${groupBy}`;
  const response = await axiosClient.get<ResultStatisticDTO[]>(url);
  return response.data;
}

export default {
  getResultStatistics,
};