// src/api/questionApi.ts
import axiosClient from "./axiosClient";

export interface QuestionDetail {
  id: string;
  position: number;
  content: string;
  answers: string[];
  correctAnswer: string;
  explanation: string;
  partContent: string;
}

export async function getQuestionById(id: string): Promise<QuestionDetail> {
  const url = `/api/questions/${encodeURIComponent(id)}`;
  const response = await axiosClient.get<QuestionDetail>(url);
  return response.data;
}

export default {
  getQuestionById,
};
