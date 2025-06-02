// src/pages/User/Test/UserTestDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import partApi, { PartItem } from "../../../../api/partApi";
import questionApi, { QuestionDetail } from "../../../../api/questionApi";
import testApi, { TestDetail } from "../../../../api/testApi";
import resultApi from "../../../../api/resultApi";

type Question = {
  id: string;
  text: string;
  options: string[];
  position: number; // thêm position
};

type PartData = {
  partNumber: number;
  description?: string;
  questions: Question[];
};

const UserTestDetailPage: React.FC = () => {
  const { id: testId } = useParams<{ id: string }>(); // ID của bài thi
  const navigate = useNavigate();

  const [parts, setParts] = useState<PartData[]>([]);
  const [currentPart, setCurrentPart] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [modalType, setModalType] = useState<null | "success" | "incomplete">(null);

  const [loadingParts, setLoadingParts] = useState(true);
  const [loadingTestDetail, setLoadingTestDetail] = useState(true);

  // 1. Fetch TestDetail để biết minutes
  useEffect(() => {
    if (!testId) return;
    const fetchTestDetail = async () => {
      try {
        const data: TestDetail = await testApi.getById(testId);
        setTimeLeft(data.minutes * 60);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết bài thi:", err);
      } finally {
        setLoadingTestDetail(false);
      }
    };
    fetchTestDetail();
  }, [testId]);

  // 2. Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft((t) => (t !== null ? t - 1 : t)), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 3. Fetch parts và câu hỏi
  useEffect(() => {
    if (!testId) return;
    const fetchData = async () => {
      try {
        const partItems: PartItem[] = await partApi.getPartsByTestId(testId);
        if (partItems.length === 0) {
          setParts([]);
          return;
        }

        // Gom hết ID câu hỏi để gọi detail
        const allQuestionIds: string[] = partItems.flatMap((p) =>
          p.questions.map((q) => q.id)
        );
        const questionDetails: QuestionDetail[] = await Promise.all(
          allQuestionIds.map((qid) => questionApi.getQuestionById(qid))
        );
        const detailMap: Record<string, QuestionDetail> = {};
        questionDetails.forEach((qd) => {
          detailMap[qd.id] = qd;
        });

        // Build lại parts + questions, kéo thêm luôn "position" từ PartItem.questions
        const mappedParts: PartData[] = partItems.map((p) => ({
          partNumber: p.position,
          description: p.content || undefined,
          questions: p.questions.map((q) => {
            const d = detailMap[q.id];
            return {
              id: q.id,
              text: d.content,
              options: d.answers,
              position: q.position, // position do backend trả về (thường 1-based)
            };
          }),
        }));

        setParts(mappedParts);
        setCurrentPart(mappedParts[0].partNumber);
      } catch (err) {
        console.error("Lỗi khi tải phần hoặc câu hỏi:", err);
      } finally {
        setLoadingParts(false);
      }
    };
    fetchData();
  }, [testId]);

  if (loadingTestDetail || loadingParts || timeLeft === null) {
    return <div className="p-5 text-center text-gray-500">Đang tải dữ liệu…</div>;
  }

  if (parts.length === 0) {
    return <div className="p-5 text-center text-red-600">Phần thi không tồn tại</div>;
  }

  const partData = parts.find((p) => p.partNumber === currentPart);
  if (!partData) {
    return <div className="p-5 text-center text-red-600">Phần thi không tồn tại</div>;
  }

  // Khi user chọn / bỏ chọn đáp án
  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => {
      if (prev[questionId] === optionIndex) {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      } else {
        return { ...prev, [questionId]: optionIndex };
      }
    });
  };

  // Khi bấm sidebar chuyển câu
  const handleSidebarClick = (partNum: number, questionId: string) => {
    setCurrentPart(partNum);
    setTimeout(() => {
      const el = document.getElementById(`question-${questionId}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const allQuestionIds = parts.flatMap((p) => p.questions.map((q) => q.id));
  const checkAllAnswered = () => allQuestionIds.every((qid) => qid in answers);

  // Khi bấm "Nộp bài"
  const handleSubmitClick = () => {
    if (checkAllAnswered()) {
      setModalType("success");
    } else {
      setModalType("incomplete");
    }
  };

  // Khi user xác nhận nộp bài
  const handleConfirmSubmit = async () => {
    if (!testId || timeLeft === null) return;

    // Lấy lại phút ban đầu từ backend để tính giây đã dùng
    let minutes = 0;
    try {
      const detail: TestDetail = await testApi.getById(testId);
      minutes = detail.minutes;
    } catch {
      minutes = 0;
    }
    const secondsSpent = minutes * 60 - (timeLeft || 0);

    // Tạo map questionId -> "A"|"B"|...
    const userAnswers: { [qid: string]: string } = {};
    parts.forEach((part) => {
      part.questions.forEach((q) => {
        const selIdx = answers[q.id];
        userAnswers[q.id] = selIdx !== undefined ? String.fromCharCode(65 + selIdx) : "";
      });
    });

    // Gọi API lưu kết quả, lấy về resultId rồi navigate
    try {
      const { id: newResultId } = await resultApi.postResult(testId, secondsSpent, userAnswers);
      navigate(`/user/test/result/${newResultId}`);
    } catch (err) {
      console.error("Lưu kết quả thất bại:", err);
      alert("Không thể lưu kết quả, vui lòng thử lại.");
    }
  };

  const handleCancelSubmit = () => {
    setModalType(null);
  };

  return (
    <div className="p-5 relative">
      <div className="font-bold text-3xl pb-3">Chi tiết bài thi</div>

      {/* Phần chọn Part */}
      <div className="mb-5 flex gap-3">
        {parts.map((p) => (
          <button
            key={p.partNumber}
            onClick={() => setCurrentPart(p.partNumber)}
            className={`rounded-full px-5 py-1 cursor-pointer border-0 ${
              p.partNumber === currentPart ? "bg-blue-300 font-bold" : "bg-blue-100 font-normal"
            }`}
          >
            Part {p.partNumber}
          </button>
        ))}
      </div>

      {/* Nội dung & sidebar */}
      <div className="flex gap-5 border border-gray-300 rounded-md p-4 min-h-[350px]">
        {/* Nếu Part ≠ 1, show description */}
        {currentPart !== 1 && partData.description && (
          <div className="w-[35%] whitespace-pre-wrap bg-gray-100 p-4 rounded-md text-sm leading-relaxed overflow-y-auto">
            {partData.description}
          </div>
        )}

        {/* Phần câu hỏi & đáp án (chiếm toàn bộ nếu Part 1) */}
        <div className={`${currentPart === 1 ? "flex-1 w-full" : "flex-1"}`}>
          {partData.questions.map((q) => (
            <div
              id={`question-${q.id}`}
              key={q.id}
              className={`border border-gray-300 rounded-md p-3 mb-3 ${
                answers[q.id] !== undefined ? "bg-blue-100" : "bg-white"
              }`}
            >
              <div className="mb-1 font-semibold">
                Câu {q.position}: <span className="font-normal">{q.text}</span>
              </div>
              <div>
                {q.options.map((opt, idx) => {
                  const labelChar = String.fromCharCode(65 + idx); // A, B, C, D
                  return (
                    <label
                      key={idx}
                      className={`block cursor-pointer mb-1 ${
                        answers[q.id] === idx ? "text-blue-600 font-bold" : "text-gray-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={answers[q.id] === idx}
                        onChange={() => handleOptionSelect(q.id, idx)}
                        className="mr-2"
                      />
                      <span className="mr-1 font-bold">{labelChar}.</span>
                      {opt}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar bên phải */}
        <div className="w-[200px] rounded-md p-3 text-sm leading-relaxed overflow-y-auto max-h-[600px]">
          <div className="mb-3">
            <strong>Thời gian còn lại:</strong>
            <div className={`text-2xl font-bold ${timeLeft! <= 60 ? "text-red-600" : ""}`}>
              {formatTime(timeLeft!)}
            </div>
          </div>

          <button
            onClick={handleSubmitClick}
            className="w-full py-2 mb-4 bg-[#9FC7FF] text-[#000000] rounded cursor-pointer hover:bg-blue-800 font-bold text-lg"
          >
            Nộp bài
          </button>

          {parts.map((p) => (
            <div key={p.partNumber} className="mb-4">
              <strong className="block mb-1">Part {p.partNumber}:</strong>
              <div className="flex flex-wrap gap-2">
                {p.questions.map((q) => {
                  const answered = answers[q.id] !== undefined;
                  return (
                    <button
                      key={q.id}
                      title={`Câu ${q.position}`}
                      onClick={() => handleSidebarClick(p.partNumber, q.id)}
                      className={`w-10 h-8 rounded-[10px] font-bold cursor-pointer border transition-colors duration-200 ${
                        answered ? "bg-blue-200 text-blue-700 border-blue-700" : "bg-white text-black border-black"
                      }`}
                    >
                      {q.position}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal xác nhận */}
      {modalType && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-md backdrop-brightness-75">
          <div className="bg-white bg-opacity-90 rounded-xl p-6 max-w-md mx-4 shadow-lg">
            {modalType === "success" ? (
              <p className="text-blue-900 font-semibold mb-4">Bạn có chắc muốn nộp bài không?</p>
            ) : (
              <p className="text-red-600 font-semibold mb-4">
                Vẫn còn một số câu bạn chưa hoàn thành, bạn vẫn muốn nộp chứ?
              </p>
            )}
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleConfirmSubmit}
                className="bg-green-100 rounded-full px-6 py-2 font-semibold hover:bg-green-200"
              >
                Có
              </button>
              <button
                onClick={handleCancelSubmit}
                className="bg-red-100 rounded-full px-6 py-2 font-semibold hover:bg-red-200"
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTestDetailPage;
