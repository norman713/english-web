  // src/pages/User/UserTest/Result/Part1Detail.tsx
  import React, { useState, useEffect } from "react";
  import { useParams } from "react-router-dom";
  import questionApi, { QuestionDetail as APIQuestionDetail } from "../../../../../api/questionApi";

  type QuestionDetail = {
    question: string;
    options: { label: string; text: string }[];
    correctAnswer: string;
    explanation: string;
    position: number; // Thêm position nếu cần
  };

  const PartDetail: React.FC = () => {
    const { questionId } = useParams<{ questionId: string }>();
    const [detail, setDetail] = useState<QuestionDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!questionId) return;
      const fetchDetail = async () => {
        try {
          // Gọi API /api/questions/{id}
          const apiData: APIQuestionDetail = await questionApi.getQuestionById(questionId);
          setDetail({
            question: apiData.content,
            options: apiData.answers.map((ans, i) => ({
              label: String.fromCharCode(65 + i), // A, B, C, D
              text: ans,
            })),
            correctAnswer: apiData.correctAnswer, // lấy luôn
            explanation: apiData.explanation,
            position: apiData.position ?? 1, // Thêm position, fallback nếu không có
          });
        } catch (err) {
          console.error("Lỗi khi tải chi tiết câu hỏi :", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }, [questionId]);

    if (loading) {
      return (
        <div className="p-5 max-w-3xl mx-auto text-center text-gray-500">
          Đang tải chi tiết câu hỏi…
        </div>
      );
    }

    if (!detail) {
      return (
        <div className="p-5 max-w-3xl mx-auto text-center text-red-600">
          Câu hỏi không tồn tại
        </div>
      );
    }

    return (
      <div className="p-5 max-w-3xl mx-auto font-sans">
        <h2 className="text-xl font-bold mb-3">Answer details: #{detail.position} </h2>
        <div className="border rounded p-4 bg-gray-50 mb-4">
          <p className="font-bold mb-2" style={{ color: "rgba(0,0,0,0.5)" }}>
            Câu {detail.position}: {detail.question}
          </p>
          <ul className="list-disc list-inside space-y-1 font-semibold">
            {detail.options.map((opt) => (
              <li key={opt.label} style={{ color: "rgba(0, 0, 0, 0.5)" }}>
                <strong style={{ color: "rgba(0, 0, 0, 0.5)" }}>{opt.label}.</strong>{" "}
                <span style={{ color: "rgba(0, 157, 255, 0.5)", fontWeight: 600 }}>
                  {opt.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="font-semibold mb-2" style={{ color: "rgba(0, 255, 59, 0.5)" }}>
          Đáp án đúng: Câu {detail.correctAnswer}
        </p>

        <p className="font-bold mb-2" style={{ color: "rgba(28, 51, 255, 0.5)" }}>
          Giải thích chi tiết đáp án
        </p>
        <p>{detail.explanation}</p>
      </div>
    );
  };

  export default PartDetail;
