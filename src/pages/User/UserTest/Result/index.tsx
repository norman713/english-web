import { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { useParams } from "react-router-dom";
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

const UserTestResultPage = () => {
  const { id } = useParams();

  // Dữ liệu demo kết quả
  const totalQuestions = 10;
  const correctAnswers = 5;
  const wrongAnswers = 2;
  const skippedAnswers = 3;
  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(0);
  const timeSpentMinutes = 120;

  const partsResult = [
    {
      partNumber: 1,
      questions: [
        { id: 1, userAnswer: "D", correct: true },
        { id: 2, userAnswer: "D", correct: true },
        { id: 3, userAnswer: "C", correct: false },
        { id: 4, userAnswer: "C", correct: false },
        { id: 5, userAnswer: null, correct: null }, // bỏ qua
      ],
    },
    {
      partNumber: 2,
      questions: [
        { id: 6, userAnswer: "D", correct: true },
        { id: 7, userAnswer: "D", correct: true },
        { id: 8, userAnswer: "C", correct: false },
        { id: 9, userAnswer: "C", correct: false },
        { id: 10, userAnswer: null, correct: null },
      ],
    },
    {
      partNumber: 3,
      questions: [
        { id: 11, userAnswer: "D", correct: true },
        { id: 12, userAnswer: "D", correct: true },
        { id: 13, userAnswer: "C", correct: false },
        { id: 14, userAnswer: "C", correct: false },
        { id: 15, userAnswer: null, correct: null },
      ],
    },
  ];

  // Render trạng thái câu trả lời
  const renderAnswerStatus = (correct: boolean | null) => {
    if (correct === true)
      return <span className="text-green-600 font-bold ml-1">✓</span>;
    if (correct === false)
      return <span className="text-red-600 font-bold ml-1">✗</span>;
    return <span className="text-gray-500 font-bold ml-1">∅</span>;
  };

  //comment
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
    <div className="p-5 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Kết quả bài thi ID: {id}</h1>

      {/* Số câu đúng, sai, bỏ qua */}
      <div className="flex gap-8 mb-6 justify-center ">
        <div className="bg-green-100 rounded-lg px-10 py-6 text-center font-bold text-2xl text-[#000000]">
          {correctAnswers}
          <div
            className="text-base font-bold text-[20px]"
            style={{ color: "rgba(0, 0, 0, 0.5)" }}
          >
            đúng
          </div>
        </div>
        <div className="bg-red-100 rounded-lg px-10 py-6 text-center font-bold text-2xl text-red-600">
          {wrongAnswers}
          <div
            className="text-base font-bold text-[20px]"
            style={{ color: "rgba(0, 0, 0, 0.5)" }}
          >
            sai
          </div>
        </div>
        <div className="bg-[#F3F7FF] rounded-lg px-10 py-6 text-center font-bold text-2xl text-[#000000]">
          {skippedAnswers}
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
        <div className="text-blue-300 font-semibold text-lg mb-2 text-[25px]">
          Tóm tắt kết quả
        </div>
        <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm font-semibold text[20px] ">
          <li>
            Kết quả làm bài{" "}
            <span className="text-blue-300">
              {correctAnswers}/{totalQuestions}
            </span>
          </li>
          <li>
            Độ chính xác <span className="text-blue-300">{accuracy}%</span>
          </li>
          <li>
            Thời gian hoàn thành{" "}
            <span className="text-blue-300">{timeSpentMinutes} phút</span>
          </li>
        </ul>
      </div>

      {/* Chi tiết từng phần */}
      {partsResult.map((part) => (
        <div key={part.partNumber} className="mb-6 text-sm">
          <div className="font-semibold mb-2">Part {part.partNumber}:</div>
          <div className="flex flex-wrap gap-2">
            {part.questions.map((q, idx) => (
              <div
                key={q.id}
                className="flex items-center gap-1 whitespace-nowrap"
              >
                <span className="inline-block w-6 h-6 text-center rounded-full bg-blue-100 text-blue-700 font-bold leading-6">
                  {idx + 1}
                </span>
                <span className="font-bold text-gray-800 select-none">
                  {q.userAnswer !== null ? `${q.userAnswer}:` : "–"}
                </span>
                {renderAnswerStatus(q.correct)}
                <a
                  href={`/user/test/part${part.partNumber}/detail/${q.id}`}
                  className="ml-1 underline font-bold"
                  style={{ color: "rgba(0, 157, 255, 0.5)" }} // Màu #009DFF 50% opacity
                >
                  [chi tiết]
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* comment */}
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

export default UserTestResultPage;
