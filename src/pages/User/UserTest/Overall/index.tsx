// src/pages/Admin/Test/OverallTestPage.tsx
import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiFileText,
  FiList,
  FiMessageCircle,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import testApi, { TestDetail } from "../../../../api/testApi";
import userApi, { UserInfo } from "../../../../api/userApi";
import commentApi, { CommentItem as APICommentItem } from "../../../../api/commentApi";

// Import ảnh user.png từ thư mục assets
import userPlaceholder from "../../../../assets/user.png";

type Reply = {
  id: string;
  user: string;
  date: string;
  content: string;
};

type Comment = {
  id: string;
  user: string;
  date: string;
  content: string;
  replies: Reply[];
  avatarUrl?: string;
};

const OverallTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // testId

  // 1. Thông tin bài thi
  const [testInfo, setTestInfo] = useState<{
    title: string;
    duration: string;
    totalQuestions: number;
    totalParts: number;
  }>({
    title: "",
    duration: "",
    totalQuestions: 0,
    totalParts: 0,
  });
  const [loadingTestInfo, setLoadingTestInfo] = useState(true);

  // 2. Thông tin user hiện tại
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 3. Danh sách comment/reply
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // 4. Trạng thái nhập comment/reply mới
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Fetch chi tiết bài thi
  useEffect(() => {
    const fetchTestInfo = async () => {
      if (!id) return;
      try {
        const data: TestDetail = await testApi.getById(id);
        setTestInfo({
          title: data.name,
          duration: `${data.minutes} phút`,
          totalQuestions: data.questionCount,
          totalParts: data.partCount,
        });
      } catch (err) {
        console.error("Lỗi khi tải thông tin bài thi:", err);
      } finally {
        setLoadingTestInfo(false);
      }
    };
    fetchTestInfo();
  }, [id]);

  // Fetch user hiện tại
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData: UserInfo = await userApi.getCurrentUser();
        setCurrentUser(userData);
      } catch (err) {
        console.error("Lỗi khi tải thông tin user:", err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserInfo();
  }, []);

  // Fetch comment/reply cho bài thi này
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      try {
        const data = await commentApi.getComments(1, 1000, id);
        const mapped: Comment[] = data.comments.map((c: APICommentItem) => ({
          id: c.id,
          user: c.userName || "Người dùng",
          date: new Date(c.createAt).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          content: c.content,
          avatarUrl: c.avatarUrl || undefined, // nếu server trả avatarUrl
          replies:
            Array.isArray(c.replies) && c.replies.length > 0
              ? c.replies.map((r) => ({
                  id: r.id,
                  user: r.userName || "Người dùng",
                  date: new Date(r.createAt!).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                  content: r.content,
                }))
              : [],
        }));
        setComments(mapped);
      } catch (err) {
        console.error("Lỗi khi tải bình luận:", err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [id]);

  // Nếu testInfo hoặc user chưa load xong, hiển thị loading
  if (loadingTestInfo || loadingUser) {
    return (
      <div className="max-w-3xl mx-auto p-5 text-center text-gray-500">
        Đang tải dữ liệu…
      </div>
    );
  }

  // Hàm đăng comment mới
  const handlePostComment = async () => {
    if (newComment.trim() === "" || !currentUser || !id) return;
    try {
      const created: APICommentItem = await commentApi.postComment(
        id,
        newComment
      );
      const newCmt: Comment = {
        id: created.id,
        user: currentUser.name,
        date: new Date(created.createAt).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        content: created.content,
        replies: [],
        // Lấy avatar của chính user hiện tại
        avatarUrl: currentUser.avatarUrl || undefined,
      };
      setComments((prev) => [newCmt, ...prev]);
      setNewComment("");
      setShowAllComments(true);
    } catch (err) {
      console.error("Lỗi khi đăng bình luận mới:", err);
    }
  };

  // Hàm đăng reply cho một comment
  const handlePostReply = async (commentId: string) => {
    if (
      replyContent.trim() === "" ||
      replyingTo !== commentId ||
      !currentUser
    )
      return;
    try {
      const createdReply: APICommentItem = await commentApi.postReply(
        commentId,
        replyContent
      );
      const newReply: Reply = {
        id: createdReply.id,
        user: currentUser.name,
        date: new Date(createdReply.createAt).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        content: createdReply.content,
      };
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: [...c.replies, newReply],
            };
          }
          return c;
        })
      );
      setReplyingTo(null);
      setReplyContent("");
    } catch (err) {
      console.error("Lỗi khi đăng reply:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      {/* Tiêu đề bài thi */}
      <h1 className="text-3xl font-bold mb-3">{testInfo.title}</h1>

      <span className="inline-block bg-blue-200 text-blue-900 px-3 py-1 rounded-full mb-5">
        Thông tin đề thi
      </span>

      {/* Hiển thị chi tiết bài thi */}
      <div className="bg-blue-50 p-4 rounded mb-6 text-gray-700 space-y-2">
        <p className="flex items-center gap-2">
          <FiClock className="text-blue-600" /> Thời gian làm bài:{" "}
          <strong>{testInfo.duration}</strong>
        </p>
        <p className="flex items-center gap-2">
          <FiFileText className="text-blue-600" /> Tổng số câu hỏi:{" "}
          <strong>{testInfo.totalQuestions} câu hỏi</strong>
        </p>
        <p className="flex items-center gap-2">
          <FiList className="text-blue-600" /> Tổng số phần thi:{" "}
          <strong>{testInfo.totalParts} phần thi</strong>
        </p>
        <p className="flex items-center gap-2">
          <FiMessageCircle className="text-blue-600" /> Bình luận:{" "}
          <strong>{comments.length} bình luận</strong>
        </p>

        <button
          onClick={() => {
            if (id) navigate(`/user/test/${id}`);
          }}
          className="mt-3 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Bắt đầu bài thi
        </button>
      </div>

      {/* Phần bình luận */}
      <div>
        <h2 className="font-semibold mb-2">Bình luận</h2>

        {/* Nhập comment mới */}
        <div className="mb-4 border rounded p-3 bg-gray-100">
          <textarea
            className="w-full p-2 rounded border border-gray-300 resize-none"
            rows={3}
            placeholder="Viết bình luận…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end mt-2 gap-2">
            <button
              className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setNewComment("")}
            >
              Cancel
            </button>
            <button
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handlePostComment}
            >
              Post
            </button>
          </div>
        </div>

        {/* Hiển thị comment + replies */}
        {loadingComments ? (
          <div className="text-center text-gray-500">Đang tải bình luận…</div>
        ) : (
          <>
            {comments
              .slice(
                0,
                showAllComments ? comments.length : Math.min(5, comments.length)
              )
              .map((comment) => (
                <div key={comment.id} className="mb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <img
                      src={comment.avatarUrl || userPlaceholder}
                      alt={comment.user}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        // Nếu URL avatar lỗi, dùng userPlaceholder
                        const target = e.currentTarget;
                        if (target.src !== userPlaceholder) {
                          target.src = userPlaceholder;
                        }
                      }}
                    />
                    <div>
                      <p className="font-semibold">{comment.user}</p>
                      <p className="text-xs text-gray-500">{comment.date}</p>
                    </div>
                  </div>
                  <p className="mb-1">{comment.content}</p>

                  {/* Hiển thị replies */}
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="ml-12 mb-2 rounded p-2 bg-gray-100 text-sm"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={currentUser?.avatarUrl || userPlaceholder}
                          alt={reply.user}
                          className="w-6 h-6 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== userPlaceholder) {
                              target.src = userPlaceholder;
                            }
                          }}
                        />
                        <p className="font-semibold">{reply.user}</p>
                        <p className="text-xs text-gray-500">{reply.date}</p>
                      </div>
                      <p>{reply.content}</p>
                      <button
                        className="text-blue-600 mt-1 text-sm"
                        onClick={() => setReplyingTo(comment.id)}
                      >
                        Trả lời
                      </button>
                    </div>
                  ))}

                  {/* Nếu đang reply vào comment này */}
                  {replyingTo === comment.id ? (
                    <div className="ml-12 mt-2">
                      <textarea
                        className="w-full p-2 rounded border border-gray-300 resize-none"
                        rows={2}
                        placeholder="Viết trả lời…"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div className="flex justify-end mt-2 gap-2">
                        <button
                          className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => handlePostReply(comment.id)}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="text-blue-600 text-sm"
                      onClick={() => setReplyingTo(comment.id)}
                    >
                      Trả lời
                    </button>
                  )}
                </div>
              ))}

            {/* Nút “Xem thêm” */}
            {comments.length > 5 && !showAllComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="w-full py-2 bg-blue-300 rounded mt-2 font-semibold hover:bg-blue-400"
              >
                Xem thêm
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OverallTestPage;
