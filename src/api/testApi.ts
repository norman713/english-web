// src/api/testApi.ts

import axiosClient from "./axiosClient";
import axios from "axios";

/** Dữ liệu bộ đề cơ bản (list) */
export interface TestItem {
  id: string;
  name: string;
  version: number;
  questionCount: number;
  minutes: number;
  topic: string;
}

/** Kết quả phân trang chung */
export interface PaginatedTests {
  tests: TestItem[];
  totalItems: number;
  totalPages: number;
}

/** Dữ liệu chi tiết một test */
export interface TestDetail extends TestItem {
  createdByName: string;
  createByAvatarUrl: string;
  createdAt: string;
  partCount: number;
  questionCount: number;
  completedUsers: number;
  updatedByName: string;
  updatedByAvatarUrl: string;
  updatedAt: string;
  isDeleted: boolean;
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

/** Interface cho response tạo mới test (POST /api/tests & /api/tests/upload) */
export interface CreateTestResponse {
  id: string;
  createdBy: string;
  createdAt: string;
  name: string;
  minutes: number;
  topic: string;
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

/** Một mục thống kê */
export interface StatisticItem {
  time: string;
  testCount: number;
  completedUsers: number;
}

/** Kết quả thống kê */
export interface GetStatisticResponse {
  statistics: StatisticItem[];
}

/** Lấy danh sách bộ đề (chỉ chưa xoá, phân trang) */
export async function getAll(
  page: number,
  size: number
): Promise<PaginatedTests> {
  const url = `/api/tests/all?page=${page}&size=${size}`;
  const response = await axiosClient.get<PaginatedTests>(url);
  return response.data;
}

/** Lấy danh sách bộ đề đã xoá (phân trang) */
export async function getDeleted(
  page: number,
  size: number
): Promise<PaginatedTests> {
  const url = `/api/tests/deleted?page=${page}&size=${size}`;
  const response = await axiosClient.get<PaginatedTests>(url);
  return response.data;
}

/** Tìm kiếm bộ đề theo tên (chưa xoá) */
export async function searchTests(
  name: string
): Promise<PaginatedTests> {
  const url = `/api/tests/search?name=${encodeURIComponent(name)}`;
  const response = await axiosClient.get<PaginatedTests>(url);
  return response.data;
}

/** Tìm kiếm bộ đề đã xoá theo tên */
export async function searchDeletedTests(
  name: string
): Promise<PaginatedTests> {
  const url = `/api/tests/search/deleted?name=${encodeURIComponent(name)}`;
  const response = await axiosClient.get<PaginatedTests>(url);
  return response.data;
}

/** Tạo mới một bộ đề */
export async function createTest(
  payload: CreateTestRequest
): Promise<CreateTestResponse> {
  const response = await axiosClient.post<CreateTestResponse>(
    `/api/tests`,
    payload
  );
  return response.data;
}

/** Upload file Excel để tạo test */
export async function uploadTestFile(
  file: File
): Promise<CreateTestResponse> {
  const url = `/api/tests/upload`;
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post<CreateTestResponse>(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    baseURL: axiosClient.defaults.baseURL,
  });
  return response.data;
}

/** Lấy chi tiết một bộ đề */
export async function getById(id: string): Promise<TestDetail> {
  const url = `/api/tests/${encodeURIComponent(id)}`;
  const response = await axiosClient.get<TestDetail>(url);
  return response.data;
}

/** Xoá mềm một bộ đề */
export async function deleteTest(id: string): Promise<TestUpdateResponse> {
  const url = `/api/tests/${encodeURIComponent(id)}`;
  const response = await axiosClient.delete<TestUpdateResponse>(url);
  return response.data;
}

/** Khôi phục một bộ đề đã xoá */
export async function restoreTest(id: string): Promise<TestUpdateResponse> {
  const url = `/api/tests/restore/${encodeURIComponent(id)}`;
  const response = await axiosClient.patch<TestUpdateResponse>(url);
  return response.data;
}

/** Cập nhật toàn bộ đề (minutes, parts, ...) */
export async function updateTest(
  id: string,
  payload: {
    minutes?: number;
    parts?: Array<{
      content: string;
      questions: Array<{
        content: string;
        answers: string[];
        correctAnswer?: string;
        explanation?: string;
      }>;
    }>;
  }
): Promise<TestUpdateResponse> {
  const url = `/api/tests/${encodeURIComponent(id)}`;
  const response = await axiosClient.patch<TestUpdateResponse>(url, payload);
  return response.data;
}

/** Cập nhật tên và topic của đề */
export async function updateTestGeneral(
  id: string,
  payload: { name: string; topic: string }
): Promise<TestUpdateResponse> {
  const url = `/api/tests/${encodeURIComponent(id)}/general`;
  const response = await axiosClient.patch<TestUpdateResponse>(url, payload);
  return response.data;
}

/** Lấy danh sách tất cả phần (Part) của một test */
export async function getPartsByTestId(
  testId: string
): Promise<PartItem[]> {
  const url = `/api/parts/all?testId=${encodeURIComponent(testId)}`;
  const response = await axiosClient.get<PartItem[]>(url);
  return response.data;
}

/** Lấy chi tiết một câu hỏi theo ID */
export async function getQuestionById(
  id: string
): Promise<QuestionDetail> {
  const url = `/api/questions/${encodeURIComponent(id)}`;
  const response = await axiosClient.get<QuestionDetail>(url);
  return response.data;
}

/** Tải file template (blob) */
async function getTemplate(): Promise<Blob> {
  const response = await axiosClient.get("/api/tests/template", {
    responseType: "blob",
  });
  return response.data;
}

/** Lấy thống kê test đã xuất bản */
export async function getStatistics(
  from: string,
  to: string,
  groupBy: "WEEK" | "MONTH" | "YEAR"
): Promise<GetStatisticResponse> {
  const url = `/api/tests/statistic?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}&groupBy=${encodeURIComponent(groupBy)}`;
  const response = await axiosClient.get<GetStatisticResponse>(url);
  return response.data;
}

export const testApi = {
  getAll,
  getDeleted,
  searchTests,
  searchDeletedTests,
  createTest,
  uploadTestFile,
  getById,
  deleteTest,
  restoreTest,
  updateTest,
  updateTestGeneral,
  getPartsByTestId,
  getQuestionById,
  getTemplate,
  getStatistics,
};

export default testApi;
