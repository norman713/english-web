// src/api/partApi.ts
import axiosClient from "./axiosClient";

export interface PartItem {
  id: string;
  position: number;
  content: string;
  questionCount: number;
  questions: Array<{
    id: string;
    position: number;
    content: string;
    answers: string[];
  }>;
}

export async function getPartsByTestId(testId: string): Promise<PartItem[]> {
  const url = `/api/parts/all?testId=${encodeURIComponent(testId)}`;
  const response = await axiosClient.get<PartItem[]>(url);
  return response.data;
}

export default {
  getPartsByTestId,
};
