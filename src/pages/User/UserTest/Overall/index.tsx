import { useState } from "react";
import { FiClock, FiFileText, FiList, FiMessageCircle } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

type Reply = {
  id: number;
  user: string;
  date: string;
  content: string;
};

type Comment = {
  id: number;
  user: string;
  date: string;
  content: string;
  replies: Reply[];
  avatarUrl?: string;
};

const dummyAvatar = (user: string) =>
  `https://i.pravatar.cc/40?u=${encodeURIComponent(user)}`;

const OverallTestPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const testInfo = {
    title: "2024 Practice Toeic Test 1",
    duration: "120 phút",
    totalQuestions: 100,
    totalParts: 3,
    commentsCount: 200,
  };

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "May",
      date: "Tháng 03, 13, 2025",
      content: "Cho mình hỏi câu 2 sao lại là đáp án A vậy",
      avatarUrl: dummyAvatar("Jennie"),
      replies: [
        {
          id: 11,
          user: "Jennie",
          date: "Tháng 03, 13, 2025",
          content:
            "Là 1 nhà đầu cơ thượng thừa, câu 2 phần listening mình chọn ngay đáp án A :) khuyên các bạn phải nghe hết 3 đáp án nhé. chúc các bạn thi tốt",
        },
      ],
    },
    {
      id: 2,
      user: "Jennie",
      date: "Tháng 03, 13, 2025",
      content: "Cho mình hỏi câu 2 sao lại là đáp án A vậy",
      avatarUrl: dummyAvatar("Jennie2"),
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  // Reply states
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handlePostComment = () => {
    if (newComment.trim() === "") return;
    const newCmt: Comment = {
      id: Date.now(),
      user: "Bạn",
      date: new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      content: newComment,
      replies: [],
      avatarUrl: dummyAvatar("Bạn"),
    };
    setComments((prev) => [newCmt, ...prev]);
    setNewComment("");
  };

  const handlePostReply = (commentId: number) => {
    if (replyContent.trim() === "") return;

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          const newReply: Reply = {
            id: Date.now(),
            user: "Bạn",
            date: new Date().toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            content: replyContent,
          };
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return comment;
      })
    );

    setReplyingTo(null);
    setReplyContent("");
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-3">{testInfo.title}</h1>

      <span className="inline-block bg-blue-200 text-blue-900 px-3 py-1 rounded-full mb-5">
        Thông tin đề thi
      </span>

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
          <strong>{testInfo.commentsCount} bình luận</strong>
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

      <div>
        <h2 className="font-semibold mb-2">Bình luận</h2>
        <div className="mb-4 border rounded p-3 bg-gray-100">
          <textarea
            className="w-full p-2 rounded border border-gray-300 resize-none"
            rows={3}
            placeholder="Write your comment here..."
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

        {comments
          .slice(0, showAllComments ? comments.length : 5)
          .map((comment) => (
            <div key={comment.id} className="mb-4">
              <div className="flex items-center gap-3 mb-1">
                {/* Avatar */}
                <img
                  src={comment.avatarUrl}
                  alt={comment.user}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{comment.user}</p>
                  <p className="text-xs text-gray-500">{comment.date}</p>
                </div>
              </div>
              <p className="mb-1">{comment.content}</p>

              {/* Replies */}
              {comment.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="ml-12 mb-2 rounded p-2 bg-gray-100 text-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {/* Replier avatar */}
                    <img
                      src={dummyAvatar(reply.user)}
                      alt={reply.user}
                      className="w-6 h-6 rounded-full object-cover"
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

              {replyingTo === comment.id ? (
                <div className="ml-12 mt-2">
                  <textarea
                    className="w-full p-2 rounded border border-gray-300 resize-none"
                    rows={2}
                    placeholder="Viết trả lời..."
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

        {comments.length > 5 && !showAllComments && (
          <button
            onClick={() => setShowAllComments(true)}
            className="w-full py-2 bg-blue-300 rounded mt-2 font-semibold hover:bg-blue-400"
          >
            Xem thêm
          </button>
        )}
      </div>
    </div>
  );
};

export default OverallTestPage;
