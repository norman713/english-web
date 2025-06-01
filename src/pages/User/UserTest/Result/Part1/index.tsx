import { useParams } from "react-router-dom";

type QuestionDetail = {
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
};

const questionDetails: Record<string, QuestionDetail> = {
  "1": {
    question:
      "The custodial staff _____ that we clean our dishes before leaving the kitchen.",
    options: [
      { label: "A", text: "request" },
      { label: "B", text: "behaves" },
      { label: "C", text: "uses" },
      { label: "D", text: "visit" },
    ],
    correctAnswer: "A",
    explanation: `Dựa vào nghĩa của từ để chọn đáp án đúng
A. requests: yêu cầu
B. behaves: cư xử
C. uses: sử dụng
D. visits: thăm
Tạm dịch: Nhân viên giám sát yêu cầu chúng tôi rửa bát trước khi rời khỏi bếp`,
  },
  "2": {
    question: "What time does the meeting start tomorrow?",
    options: [
      { label: "A", text: "At 9 AM" },
      { label: "B", text: "At 10 AM" },
      { label: "C", text: "At 11 AM" },
      { label: "D", text: "At noon" },
    ],
    correctAnswer: "B",
    explanation: `Cuộc họp bắt đầu lúc 10 giờ sáng.
Từ "start tomorrow" cho biết thời gian bắt đầu.`,
  },
  "3": {
    question: "Which department should you contact for support?",
    options: [
      { label: "A", text: "Human Resources" },
      { label: "B", text: "Sales" },
      { label: "C", text: "Technical Support" },
      { label: "D", text: "Finance" },
    ],
    correctAnswer: "C",
    explanation: `Phòng hỗ trợ kỹ thuật là bộ phận liên hệ cho các vấn đề kỹ thuật.`,
  },
  "4": {
    question: "The new software update will improve ____ performance.",
    options: [
      { label: "A", text: "system" },
      { label: "B", text: "business" },
      { label: "C", text: "market" },
      { label: "D", text: "network" },
    ],
    correctAnswer: "A",
    explanation: `Bản cập nhật phần mềm sẽ cải thiện hiệu suất hệ thống.`,
  },
  "5": {
    question: "Please submit your reports by the end of ____.",
    options: [
      { label: "A", text: "the day" },
      { label: "B", text: "the week" },
      { label: "C", text: "the month" },
      { label: "D", text: "the year" },
    ],
    correctAnswer: "B",
    explanation: `Hãy gửi báo cáo trước cuối tuần.`,
  },
};

const Part1Detail = () => {
  const { questionId } = useParams<{ questionId: string }>();

  const detail = questionDetails[questionId ?? "1"];

  if (!detail) {
    return (
      <div className="p-5 max-w-3xl mx-auto font-sans text-center text-red-600">
        Câu hỏi không tồn tại
      </div>
    );
  }

  return (
    <div className="p-5 max-w-3xl mx-auto font-sans">
      <h2 className="text-xl font-bold mb-3">Answer details: #{questionId}</h2>
      <div className="border rounded p-4 bg-gray-50 mb-4">
        <p className="font-bold mb-2" style={{ color: "rgba(0,0,0,0.5)" }}>
          Câu {questionId}: {detail.question}
        </p>

        {/* Danh sách lựa chọn */}
        <ul className="list-disc list-inside space-y-1 font-semibold">
          {detail.options.map((opt) => (
            <li key={opt.label} style={{ color: "rgba(0, 0, 0, 0.5)" }}>
              <strong style={{ color: "rgba(0, 0, 0, 0.5)" }}>
                {opt.label}.
              </strong>{" "}
              <span
                style={{ color: "rgba(0, 157, 255, 0.5)", fontWeight: 600 }}
              >
                {opt.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p
        className="font-semibold mb-2"
        style={{ color: "rgba(0, 255, 59, 0.5)" }}
      >
        Đáp án đúng: Câu {detail.correctAnswer}
      </p>

      <p className="font-bold mb-2" style={{ color: "rgba(28, 51, 255, 0.5)" }}>
        Giải thích chi tiết đáp án
      </p>
      <p>{detail.explanation}</p>
    </div>
  );
};

export default Part1Detail;
