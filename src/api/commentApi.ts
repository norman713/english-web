// src/api/commentApi.ts
import axiosClient from "./axiosClient";

/** Giao diện trả về 1 comment hoặc reply */
export interface CommentItem {
  id: string;          // UUID dạng string
  createAt: string;
  content: string;
  parentId?: string;   // để biết là reply hay comment gốc
  userName?: string;
  avatarUrl?: string;
  replies?: CommentItem[];
}

/** Kết quả khi lấy danh sách comment (phân trang) */
export interface GetCommentsResponse {
  comments: CommentItem[];
  totalItems: number;
  totalPages: number;
}

/** Lấy danh sách comments (có thể server trả riêng cho từng test) */
export async function getComments(
  page: number,
  size: number,
  testId: string
): Promise<GetCommentsResponse> {
  // Giả sử backend hỗ trợ query param testId (nếu không, bỏ testId)
  const url = `/api/comments?page=${page}&size=${size}&testId=${encodeURIComponent(testId)}`;
  const response = await axiosClient.get<GetCommentsResponse>(url);
  return response.data;
}

/** Đăng một comment mới (gốc) */
export async function postComment(
  testId: string,
  content: string
): Promise<CommentItem> {
  const payload = { testId, content };
  const response = await axiosClient.post<CommentItem>(
    "/api/comments",
    payload
  );
  return response.data;
}

/** Trả lời một comment (reply) */
export async function postReply(
  parentId: string,
  content: string
): Promise<CommentItem> {
  const payload = { parentId, content };
  const response = await axiosClient.post<CommentItem>(
    "/api/comments/reply",
    payload
  );
  return response.data;
}

export default {
  getComments,
  postComment,
  postReply,
};
