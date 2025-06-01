import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Question = {
  id: number;
  text: string;
  options: string[];
};

type PartData = {
  partNumber: number;
  description?: string;
  questions: Question[];
};

const testData: PartData[] = [
  {
    partNumber: 1,
    questions: [
      {
        id: 1,
        text: "The custodial staff _____ that we clean our dishes before leaving the kitchen.",
        options: ["request", "behaves", "uses", "visit"],
      },
      {
        id: 2,
        text: "The custodial staff _____ that we clean our dishes before leaving the kitchen.",
        options: ["request", "behaves", "uses", "visit"],
      },
      {
        id: 3,
        text: "The custodial staff _____ that we clean our dishes before leaving the kitchen.",
        options: ["request", "behaves", "uses", "visit"],
      },
      {
        id: 4,
        text: "The custodial staff _____ that we clean our dishes before leaving the kitchen.",
        options: ["request", "behaves", "uses", "visit"],
      },
    ],
  },
  {
    partNumber: 2,
    description: `Sales Lunch Workshop
Attention sales associates! Are you new to CMG Direct Retail? Is your sales sheet looking a little short? Do you want to increase your commissions but can't seem to find new clients? Come to this month's lunch workshop, where Senior Sales Manager Chad Avakian will share his secrets for locating, securing, and expanding new accounts!

Lunch is not provided, so be sure to pack something for yourself. After the meeting, a digital recording of the full presentation will be made available on the company's training Web site, so there's no need to bring a laptop for notes. Please RSVP to the training department at events@cmgdr.com to reserve your space.`,
    questions: [
      {
        id: 5,
        text: "What are attendees advised to bring to the meeting?",
        options: [
          "Some food",
          "Sales sheets",
          "Registration forms",
          "A laptop computer",
        ],
      },
      {
        id: 6,
        text: "What are attendees advised to bring to the meeting?",
        options: [
          "Some food",
          "Sales sheets",
          "Registration forms",
          "A laptop computer",
        ],
      },
      {
        id: 7,
        text: "What are attendees advised to bring to the meeting?",
        options: [
          "Some food",
          "Sales sheets",
          "Registration forms",
          "A laptop computer",
        ],
      },
    ],
  },
  {
    partNumber: 3,
    description: `Sales Lunch Workshop
Attention sales associates! Are you new to CMG Direct Retail? Is your sales sheet looking a little short? Do you want to increase your commissions but can't seem to find new clients? Come to this month's lunch workshop, where Senior Sales Manager Chad Avakian will share his secrets for locating, securing, and expanding new accounts!

Lunch is not provided, so be sure to pack something for yourself. After the meeting, a digital recording of the full presentation will be made available on the company's training Web site, so there's no need to bring a laptop for notes. Please RSVP to the training department at events@cmgdr.com to reserve your space.`,
    questions: [
      {
        id: 8,
        text: "What are attendees advised to bring to the meeting?",
        options: [
          "Some food",
          "Sales sheets",
          "Registration forms",
          "A laptop computer",
        ],
      },
      {
        id: 9,
        text: "What are attendees advised to bring to the meeting?",
        options: [
          "Some food",
          "Sales sheets",
          "Registration forms",
          "A laptop computer",
        ],
      },
      {
        id: 10,
        text: "What are attendees advised to bring to the meeting?",
        options: [
          "Some food",
          "Sales sheets",
          "Registration forms",
          "A laptop computer",
        ],
      },
    ],
  },
];

const UserTestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [currentPart, setCurrentPart] = useState(1);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  // State modal: null = ẩn, "success" hoặc "incomplete" = hiển thị modal tương ứng
  const [modalType, setModalType] = useState<null | "success" | "incomplete">(
    null
  );

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const partData = testData.find((p) => p.partNumber === currentPart);
  if (!partData) return <div>Phần thi không tồn tại</div>;

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
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

  const handleSidebarClick = (partNum: number, questionId: number) => {
    setCurrentPart(partNum);
    setTimeout(() => {
      const el = document.getElementById(`question-${questionId}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const checkAllAnswered = () => {
    const allQuestionIds = testData.flatMap((p) =>
      p.questions.map((q) => q.id)
    );
    return allQuestionIds.every((id) => answers[id] !== undefined);
  };

  const handleSubmitClick = () => {
    if (checkAllAnswered()) {
      setModalType("success");
    } else {
      setModalType("incomplete");
    }
  };

  const handleConfirmSubmit = () => {
    setModalType(null);
    navigate(`/user/test/result/${id}`);
  };

  const handleCancelSubmit = () => {
    setModalType(null);
  };

  return (
    <div className="p-5 relative">
      <div className="font-bold text-3xl pb-3">2024 Practice Toeic Test 1</div>

      {/* Part selection*/}
      <div className="mb-5 flex gap-3">
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            onClick={() => setCurrentPart(p)}
            className={`rounded-full px-5 py-1 cursor-pointer border-0 ${
              p === currentPart
                ? "bg-blue-300 font-bold"
                : "bg-blue-100 font-normal"
            }`}
          >
            Part {p}
          </button>
        ))}
      </div>

      {/* Nội dung và sidebar nằm ngang hàng */}
      <div className="flex gap-5 border border-gray-300 rounded-md p-4 min-h-[350px]">
        {/* Mô tả bên trái (part 2,3) */}
        {currentPart !== 1 && (
          <div className="w-[35%] whitespace-pre-wrap bg-gray-100 p-4 rounded-md text-sm leading-relaxed overflow-y-auto">
            {partData.description}
          </div>
        )}

        {/* Câu hỏi và đáp án */}
        <div className="flex-1">
          {partData.questions.map((q, i) => (
            <div
              id={`question-${q.id}`}
              key={q.id}
              className={`border border-gray-300 rounded-md p-3 mb-3 ${
                answers[q.id] !== undefined ? "bg-blue-100" : "bg-white"
              }`}
            >
              <div className="mb-1 font-semibold">
                Câu {i + 1}: <span className="font-normal">{q.text}</span>
              </div>
              <div>
                {q.options.map((opt, idx) => {
                  const labelChar = String.fromCharCode(65 + idx); // A, B, C, D
                  return (
                    <label
                      key={idx}
                      className={`block cursor-pointer mb-1 ${
                        answers[q.id] === idx
                          ? "text-blue-600 font-bold"
                          : "text-gray-800"
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
        <div className="w-[200px]  rounded-md p-3 text-sm leading-relaxed overflow-y-auto max-h-[600px]">
          <div className="mb-3">
            <strong>Thời gian còn lại:</strong>
            <div
              className={`text-2xl font-bold ${
                timeLeft <= 60 ? "text-red-600" : ""
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>

          <button
            onClick={handleSubmitClick}
            className="w-full py-2 mb-4 bg-[#9FC7FF] text-[#000000] rounded cursor-pointer hover:bg-blue-800 font-bold text-lg"
          >
            Nộp bài
          </button>

          {[1, 2, 3].map((partNum) => {
            const part = testData.find((p) => p.partNumber === partNum);
            if (!part) return null;
            return (
              <div key={partNum} className="mb-4">
                <strong className="block mb-1">Part {partNum}:</strong>
                <div className="flex flex-wrap gap-2">
                  {part.questions.map((q, index) => {
                    const answered = answers[q.id] !== undefined;
                    return (
                      <button
                        key={q.id}
                        title={`Câu ${index + 1}`}
                        onClick={() => handleSidebarClick(partNum, q.id)}
                        className={`w-10 h-8 rounded-[10px] font-bold cursor-pointer border transition-colors duration-200 ${
                          answered
                            ? "bg-blue-200 text-blue-700 border-blue-700"
                            : "bg-white text-black border-black"
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-md backdrop-brightness-75">
          <div className="bg-white bg-opacity-90 rounded-xl p-6 max-w-md mx-4 shadow-lg">
            {modalType === "success" ? (
              <p className="text-blue-900 font-semibold mb-4">
                Bạn có chắc muốn nộp bài không?
              </p>
            ) : (
              <p className="text-red-600 font-semibold mb-4">
                Vẫn còn một số câu bạn vẫn chưa hoàn thành, bạn vẫn muốn nộp
                chứ?
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
