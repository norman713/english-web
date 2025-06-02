// src/pages/User/Test/UserTestResultPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import resultApi, { ResultDetailDTO } from "../../../../api/resultApi";
import questionApi, { QuestionDetail as APIQuestionDetail } from "../../../../api/questionApi";

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

type DetailWithPart = {
  questionId: string;
  userAnswer: string;
  state: "CORRECT" | "INCORRECT" | "EMPTY";
  position: number;         // vị trí câu trong part do backend trả
  partContent: string;      // chuỗi mô tả Part (vd: "Part 1", "Part 2", …)
};

const UserTestResultPage: React.FC = () => {
  const { id: resultId } = useParams<{ id: string }>();
  const [result, setResult] = useState<ResultDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Mảng đã nhóm theo partContent
  const [detailsByPart, setDetailsByPart] = useState<Record<string, DetailWithPart[]>>({});

  // comment state (giữ nguyên như cũ)
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
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // 1. Fetch result details và phụ thuộc vào đó fetch thêm questionDetail để lấy partContent
  useEffect(() => {
    if (!resultId) return;
    const fetchAll = async () => {
      try {
        // Lấy result
        const data: ResultDetailDTO = await resultApi.getResultById(resultId);
        setResult(data);

        // Với mỗi detail trong data.details, gọi questionApi để lấy partContent
        const detailsWithPart: DetailWithPart[] = await Promise.all(
          data.details.map(async (d) => {
            const qd: APIQuestionDetail = await questionApi.getQuestionById(d.questionId);
            return {
              questionId: d.questionId,
              userAnswer: d.userAnswer ?? "",
              state: d.state,
              position: d.position,        // vị trí API trả (1-based)
              partContent: qd.partContent, // chuỗi mô tả Part (vd: "Part 1", "Part 2", …)
            };
          })
        );

        // Nhóm theo partContent
        const grouped: Record<string, DetailWithPart[]> = {};
        detailsWithPart.forEach((item) => {
          if (!grouped[item.partContent]) {
            grouped[item.partContent] = [];
          }
          grouped[item.partContent].push(item);
        });

        // Trong mỗi nhóm, sort lại theo position nếu cần
        Object.keys(grouped).forEach((pc) => {
          grouped[pc].sort((a, b) => a.position - b.position);
        });

        setDetailsByPart(grouped);
      } catch (err) {
        console.error("Lỗi khi tải kết quả hoặc chi tiết câu hỏi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [resultId]);

  if (loading) {
    return <div className="p-5 text-center text-gray-500">Đang tải kết quả…</div>;
  }
  if (!result) {
    return <div className="p-5 text-center text-red-600">Không tìm thấy kết quả này.</div>;
  }

  // Render trạng thái câu trả lời
  const renderAnswerStatus = (state: "CORRECT" | "INCORRECT" | "EMPTY") => {
    if (state === "CORRECT")
      return <span className="text-green-600 font-bold ml-1">✓</span>;
    if (state === "INCORRECT")
      return <span className="text-red-600 font-bold ml-1">✗</span>;
    return <span className="text-gray-500 font-bold ml-1">∅</span>;
  };

  const totalQuestions =
    result.correctAnswers + result.incorrectAnswers + result.emptyAnswers;
  const accuracyPct = (result.accuracy * 100).toFixed(0);
  const minutesSpent = Math.floor(result.secondsSpent / 60);
  const secondsRemainder = result.secondsSpent % 60;
  const timeSpentDisplay = `${minutesSpent} phút ${
    secondsRemainder < 10 ? "0" : ""
  }${secondsRemainder} giây`;

  // Hàm đăng comment mới
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

  // Hàm đăng reply
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
    <div className="p-5 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Kết quả bài thi: {result.testName}</h1>

      {/* Số câu đúng, sai, bỏ qua */}
      <div className="flex gap-8 mb-6 justify-center">
        <div className="bg-green-100 rounded-lg px-10 py-6 text-center font-bold text-2xl text-[#000000]">
          {result.correctAnswers}
          <div
            className="text-base font-bold text-[20px]"
            style={{ color: "rgba(0, 0, 0, 0.5)" }}
          >
            đúng
          </div>
        </div>
        <div className="bg-red-100 rounded-lg px-10 py-6 text-center font-bold text-2xl text-red-600">
          {result.incorrectAnswers}
          <div
            className="text-base font-bold text-[20px]"
            style={{ color: "rgba(0, 0, 0, 0.5)" }}
          >
            sai
          </div>
        </div>
        <div className="bg-[#F3F7FF] rounded-lg px-10 py-6 text-center font-bold text-2xl text-[#000000]">
          {result.emptyAnswers}
          <div
            className="text-base font-bold text-[20px]"
            style={{ color: "rgba(0, 0, 0, 0.5)" }}
          >
            bỏ qua
          </div>
        </div>
      </div>

      {/* Tóm tắt kết quả */}
      <div className="mb-6">
        <div className="text-blue-400 font-semibold text-lg mb-2 text-[25px]">
          Tóm tắt kết quả
        </div>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm font-semibold">
          <li>
            Kết quả làm bài{" "}
            <span className="text-blue-600">
              {result.correctAnswers}/{totalQuestions}
            </span>
          </li>
          <li>
            Độ chính xác <span className="text-blue-600">{accuracyPct}%</span>
          </li>
          <li>
            Thời gian hoàn thành{" "}
            <span className="text-blue-600">{timeSpentDisplay}</span>
          </li>
        </ul>
      </div>

      {/* Chi tiết từng Part */}
      {Object.entries(detailsByPart).map(([partContent, questionsOfPart], idx) => {
        // idx = 0 → Part 1, idx = 1 → Part 2, …
        const partNumber = idx + 1;
        return (
          <div key={partContent} className="mb-6 text-sm">
            {/* Hiển thị tên Part */}
            <div className="font-semibold mb-2">Part {partNumber}:</div>
            <div className="flex flex-wrap gap-2">
              {questionsOfPart.map((q) => (
                <div
                  key={q.questionId}
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <span className="inline-block w-6 h-6 text-center rounded-full bg-blue-100 text-blue-700 font-bold leading-6">
                    {q.position}
                  </span>
                  <span className="font-bold text-gray-800 select-none">
                    {q.userAnswer !== "" ? `${q.userAnswer}:` : "–"}
                  </span>
                  {renderAnswerStatus(q.state)}
                  <a
                    href={`/user/test/part/detail/${q.questionId}`}
                    className="ml-1 underline font-bold"
                    style={{ color: "rgba(0, 157, 255, 0.5)" }}
                  >
                    [chi tiết]
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bình luận */}
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

              {comment.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="ml-12 mb-2 rounded p-2 bg-gray-100 text-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
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

export default UserTestResultPage;
