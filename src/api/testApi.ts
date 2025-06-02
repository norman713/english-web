// src/api/testApi.ts

import axiosClient from "./axiosClient";

/** Dữ liệu bộ đề cơ bản (list) */
export interface TestItem {
  id: string;
  name: string;
  questionCount: number;
  minutes: number;
  topic: string;
  version: number;
  isDeleted?: boolean;
}

/** Dữ liệu chi tiết một test */
export interface TestDetail extends TestItem {
  createdByName: string;
  createByAvatarUrl: string;
  createdAt: string;
  partCount: number;
  completedUsers: number;
  updatedByName: string;
  updatedByAvatarUrl: string;
  updatedAt: string;
}

/** Kết quả phân trang */
export interface GetTestsResponse {
  tests: TestItem[];
  totalItems: number;
  totalPages: number;
}

/** Kết quả cập nhật/xoá/restore */
export interface TestUpdateResponse {
  id: string;
  updatedBy: string;
  updatedAt: string;
  isDeleted?: boolean;
  name?: string;
  version?: number;
  minutes?: number;
  topic?: string;
}

/** Interface cho request tạo mới test */
export interface CreateTestRequest {
  name: string;
  minutes: number;
  topic: string;
  parts: Array<{
    content: string;
    questions: Array<{
      content: string;
      answers: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  }>;
}

/** Interface cho response tạo mới test */
export interface CreateTestResponse {
  id: string;
  createdBy: string;
  createdAt: string;
  name: string;
  minutes: number;
  topic: string;
}

/** Chi tiết một câu hỏi */
export interface QuestionDetail {
  id: string;
  position: number;
  content: string;
  answers: string[];
  correctAnswer: string;
  explanation: string;
  partContent: string;
}

/** Một phần (Part) kèm danh sách câu hỏi tóm tắt */
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

/** Lấy danh sách bộ đề (chỉ chưa xoá, phân trang) */
async function getAll(
  page: number,
  size: number
): Promise<GetTestsResponse> {
  const url = `/api/tests/all?page=${page}&size=${size}`;
  const response = await axiosClient.get<GetTestsResponse>(url);
  return response.data;
}

/** Lấy danh sách bộ đề đã xoá */
async function getDeleted(
  page: number,
  size: number
): Promise<GetTestsResponse> {
  const url = `/api/tests/deleted?page=${page}&size=${size}`;
  const response = await axiosClient.get<GetTestsResponse>(url);
  return response.data;
}

/** Lấy chi tiết một bộ đề */
async function getById(id: string): Promise<TestDetail> {
  const url = `/api/tests/${id}`;
  const response = await axiosClient.get<TestDetail>(url);
  return response.data;
}

/** Xoá mềm một bộ đề */
async function deleteTest(id: string): Promise<TestUpdateResponse> {
  const url = `/api/tests/${id}`;
  const response = await axiosClient.delete<TestUpdateResponse>(url);
  return response.data;
}

/** Khôi phục một bộ đề đã xoá */
async function restoreTest(id: string): Promise<TestUpdateResponse> {
  const url = `/api/tests/restore/${id}`;
  const response = await axiosClient.patch<TestUpdateResponse>(url);
  return response.data;
}

/** Cập nhật toàn bộ đề (minutes, parts, ...) */
async function updateTest(
  id: string,
  payload: {
    minutes?: number;
    parts?: Array<{
      content: string;
      questions: Array<{
        content: string;
        answers: string[];
        correctAnswer: string;
        explanation: string;
      }>;
    }>;
  }
): Promise<TestUpdateResponse> {
  const url = `/api/tests/${id}`;
  const response = await axiosClient.patch<TestUpdateResponse>(url, payload);
  return response.data;
}

/** Cập nhật tên và topic của đề */
async function updateTestGeneral(
  id: string,
  payload: { name?: string; topic?: string }
): Promise<TestUpdateResponse> {
  const url = `/api/tests/${id}/general`;
  const response = await axiosClient.patch<TestUpdateResponse>(url, payload);
  return response.data;
}

/** Tạo mới một bộ đề */
async function createTest(
  payload: CreateTestRequest
): Promise<CreateTestResponse> {
  const response = await axiosClient.post<CreateTestResponse>(
    `/api/tests`,
    payload
  );
  return response.data;
}

/** Lấy chi tiết một câu hỏi theo ID */
async function getQuestionById(id: string): Promise<QuestionDetail> {
  const url = `/api/questions/${id}`;
  const response = await axiosClient.get<QuestionDetail>(url);
  return response.data;
}

/** Lấy tất cả các phần (Part) của một test, kèm danh sách câu hỏi tóm tắt */
async function getPartsByTestId(testId: string): Promise<PartItem[]> {
  const url = `/api/parts/all?testId=${encodeURIComponent(testId)}`;
  const response = await axiosClient.get<PartItem[]>(url);
  return response.data;
}

const testApi = {
  getAll,
  getDeleted,
  getById,
  deleteTest,
  restoreTest,
  updateTest,
  updateTestGeneral,
  createTest,
  getQuestionById,
  getPartsByTestId,
};

export default testApi;
