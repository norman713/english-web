// src/api/testApi.ts

import axiosClient from "./axiosClient";

export interface TestItem {
  id: string;
  name: string;
  version: number;
  questionCount: number;
  minutes: number;
  topic: string;
}

export interface GetTestsResponse {
  tests: TestItem[];
  totalItems: number;
  totalPages: number;
}

const testApi = {
  /**
   * GET /api/tests/all?page=<page>&size=<size>
   * Trả về paginated list of tests.
   */
  async getAll(page: number, size: number): Promise<GetTestsResponse> {
    const url = `/api/tests/all?page=${page}&size=${size}`;
    const response = await axiosClient.get<GetTestsResponse>(url);
    return response.data;
  },

  /**
   * DELETE /api/tests/{id}
   * Xóa một test theo id.
   */
  async deleteTest(id: string): Promise<void> {
    await axiosClient.delete(`/api/tests/${id}`);
  },
};

export default testApi;
