import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaPlus,
} from "react-icons/fa";

// Định nghĩa kiểu cho câu hỏi
type Option = { id: string; text: string };
type Question = { id: number; question: string; options: Option[] };

// Định nghĩa kiểu cho phần (part)
type PartData = {
  description: string;
  questions: Question[];
};

// Định nghĩa kiểu cho toàn bộ partsData
type PartsData = {
  [key: string]: PartData;
};

// Dữ liệu mock ban đầu
const initialPartsData: PartsData = {
  "Part 1": {
    description: `Power Outage Scheduled at City Hall
On Friday, April 14, the city hall’s electricity is scheduled to be shut down at 7 A.M. and restored at 6 P.M. The building ----- (131) for the day. During the power outage, the emergency lighting system will be upgraded. ----- (132) , all circuit panels will be replaced to bring them into compliance with current safety codes.

---(133)— exiting city hall offices on Thursday, please disconnect all desktop computers, wireless servers, and other computer—related equipment. Furthermore, employees are asked to remove any personal contents from the kitchenette. -----(134). Please direct questions or concerns to the director of building maintenance.`,
    questions: [
      {
        id: 1,
        question: "What your name?",
        options: [
          { id: "a", text: "Candy" },
          { id: "b", text: "Hi" },
          { id: "c", text: "How" },
          { id: "d", text: "Wow" },
        ],
      },
      {
        id: 2,
        question: "What your name?",
        options: [
          { id: "a", text: "Candy" },
          { id: "b", text: "Hi" },
          { id: "c", text: "How" },
          { id: "d", text: "Wow" },
        ],
      },
      {
        id: 3,
        question: "What your name?",
        options: [
          { id: "a", text: "Candy" },
          { id: "b", text: "Hi" },
          { id: "c", text: "How" },
          { id: "d", text: "Wow" },
        ],
      },
    ],
  },

  "Part 2": {
    description: `This is the description for Part 2.
It can be different text, specific to Part 2 of the test.`,
    questions: [
      {
        id: 1,
        question: "Question for Part 2 - 1?",
        options: [
          { id: "a", text: "Option 1" },
          { id: "b", text: "Option 2" },
          { id: "c", text: "Option 3" },
          { id: "d", text: "Option 4" },
        ],
      },
    ],
  },

  "Part 3": {
    description: `This is the description for Part 3.
Different content and questions for Part 3.`,
    questions: [
      {
        id: 1,
        question: "Question for Part 3 - 1?",
        options: [
          { id: "a", text: "Answer A" },
          { id: "b", text: "Answer B" },
          { id: "c", text: "Answer C" },
          { id: "d", text: "Answer D" },
        ],
      },
      {
        id: 2,
        question: "Question for Part 3 - 2?",
        options: [
          { id: "a", text: "Answer A" },
          { id: "b", text: "Answer B" },
          { id: "c", text: "Answer C" },
          { id: "d", text: "Answer D" },
        ],
      },
    ],
  },
};

const TestDetailPage: React.FC = () => {

  const parts = Object.keys(initialPartsData);
  const [activePart, setActivePart] = useState<string>(parts[0]);

  // State quản lý dữ liệu test theo phần, để cho phép edit/xóa
  const [partsData, setPartsData] = useState<PartsData>(initialPartsData);

  // State edit cho description
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(
    partsData[activePart].description
  );

  // State edit câu hỏi/lựa chọn: lưu id câu hỏi đang sửa, hoặc null
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  // State lưu bản nháp câu hỏi đang sửa
  const [questionDraft, setQuestionDraft] = useState<string>("");

  // State lưu id câu hỏi và option id đang sửa option
  const [editingOption, setEditingOption] = useState<{
    questionId: number;
    optionId: string;
  } | null>(null);
  const [optionDraft, setOptionDraft] = useState<string>("");

  // Cập nhật description khi activePart thay đổi
  React.useEffect(() => {
    setDescriptionDraft(partsData[activePart].description);
    setIsEditingDescription(false);
    setEditingQuestionId(null);
    setEditingOption(null);
  }, [activePart, partsData]);

  // Thông tin chung của bộ đề
  const testDetail = {
    title: "2024 Toeic Test",
    testTime: "90 phút",
    testType: "Toeic",
    creator: "Admin",
    createdAt: "22/05/2025",
    updatedAt: "22/05/2025",
    updatedBy: "Admin",
    version: "1.0",
  };

  // Hàm lưu mô tả mới
  const saveDescription = () => {
    setPartsData((prev) => ({
      ...prev,
      [activePart]: {
        ...prev[activePart],
        description: descriptionDraft,
      },
    }));
    setIsEditingDescription(false);
  };

  // Hàm xóa câu hỏi
  const deleteQuestion = (questionId: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa câu hỏi này không?");
    if (!confirmed) return; // Nếu người dùng bấm Hủy thì dừng, không xóa

    setPartsData((prev) => {
      const updatedQuestions = prev[activePart].questions.filter(
        (q) => q.id !== questionId
      );
      return {
        ...prev,
        [activePart]: {
          ...prev[activePart],
          questions: updatedQuestions,
        },
      };
    });
    if (editingQuestionId === questionId) setEditingQuestionId(null);
  };

  // Hàm lưu chỉnh sửa câu hỏi
  const saveQuestion = (questionId: number) => {
    setPartsData((prev) => {
      const updatedQuestions = prev[activePart].questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, question: questionDraft };
        }
        return q;
      });
      return {
        ...prev,
        [activePart]: {
          ...prev[activePart],
          questions: updatedQuestions,
        },
      };
    });
    setEditingQuestionId(null);
  };

  // Hàm lưu chỉnh sửa lựa chọn
  const saveOption = (questionId: number, optionId: string) => {
    setPartsData((prev) => {
      const updatedQuestions = prev[activePart].questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) => {
              if (opt.id === optionId) {
                return { ...opt, text: optionDraft };
              }
              return opt;
            }),
          };
        }
        return q;
      });
      return {
        ...prev,
        [activePart]: {
          ...prev[activePart],
          questions: updatedQuestions,
        },
      };
    });
    setEditingOption(null);
  };

  return (
    <div className="w-full p-3">
      <h1 className="text-2xl font-bold text-[#31373F] mb-6">
        Chi tiết bộ đề thi {testDetail.title}
      </h1>

      {/* Thông tin chung bộ đề */}
      <div className="bg-[#7CC8F680] p-4 px-[200px] space-y-2 max-w-[900px] mx-auto rounded">
        <Field label="Tên" value={testDetail.title} />
        <Field label="Thời gian" value={testDetail.testTime} />
        <Field label="Chủ đề" value={testDetail.testType} />
        <Field label="Người tạo" value={testDetail.creator} />
        <Field label="Ngày tạo" value={testDetail.createdAt} />
        <Field label="Chỉnh lần cuối" value={testDetail.updatedAt} />
        <Field label="Người chỉnh" value={testDetail.updatedBy} />
        <Field label="Phiên bản" value={testDetail.version} />
      </div>

      {/* Tabs */}
      <div className="bg-[#EEF5FF] p-4 flex items-center space-x-3 rounded-md mb-6 max-w-[900px] mx-auto">
        {parts.map((part) => (
          <button
            key={part}
            className={`px-4 py-1 rounded-full text-sm font-medium cursor-pointer
              ${
                part === activePart
                  ? "bg-blue-300 text-blue-800"
                  : "bg-blue-100 text-blue-400"
              }
            `}
            onClick={() => setActivePart(part)}
          >
            {part}
          </button>
        ))}
      </div>

      {/* Description */}
      {(activePart === "Part 2" || activePart === "Part 3") && (
        <div className="max-w-[900px] mx-auto bg-[#EEF5FF] p-4 rounded border border-gray-300 whitespace-pre-line mb-6 relative">
          {partsData[activePart].description || isEditingDescription ? (
            <>
              {!isEditingDescription ? (
                <>
                  {/* Mô tả + nút sửa + nút xóa */}
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <button
                        onClick={() => {
                          setIsEditingDescription(true);
                          setDescriptionDraft(
                            partsData[activePart].description
                          );
                        }}
                        className="text-[#71869D] hover:text-blue-800"
                        title="Chỉnh sửa mô tả"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Bạn có chắc muốn xóa đoạn văn này không?"
                          );
                          if (!confirmed) return; // Nếu hủy thì không xóa

                          setPartsData((prev) => ({
                            ...prev,
                            [activePart]: {
                              ...prev[activePart],
                              description: "",
                            },
                          }));
                          setIsEditingDescription(false);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa đoạn văn"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="mt-2 whitespace-pre-line">
                      {partsData[activePart].description}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Textarea nhập mô tả mới, hiện cả khi description trống */}
                  <textarea
                    value={descriptionDraft}
                    onChange={(e) => setDescriptionDraft(e.target.value)}
                    rows={6}
                    className="w-full p-2 rounded border border-gray-400"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={saveDescription}
                      className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <FaSave /> Lưu
                    </button>
                    <button
                      onClick={() => setIsEditingDescription(false)}
                      className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      <FaTimes /> Hủy
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <button
              className="bg-[#9FFFA7] text-[#000000] gap-3  px-4 py-2 font-bold rounded inline-flex items-center hover:bg-green-500 mt-4"
              onClick={() => {
                setIsEditingDescription(true);
                setDescriptionDraft(""); // Reset draft thành trống để nhập mới
              }}
              type="button"
            >
              <span>Thêm đoạn văn</span>{" "}
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-700 text-white">
                <FaPlus />
              </span>
            </button>
          )}
        </div>
      )}

      {/* list of question */}
      <div className="max-w-[900px] mx-auto space-y-4">
        {partsData[activePart].questions.map((q: Question, index: number) => (
          <div
            key={q.id}
            className="bg-[#EEF5FF] rounded p-4 border border-gray-300 relative"
          >
            <div className="flex justify-between items-center mb-2">
              {editingQuestionId === q.id ? (
                <>
                  <input
                    type="text"
                    value={questionDraft}
                    onChange={(e) => setQuestionDraft(e.target.value)}
                    className="w-full p-1 rounded border border-gray-400 mr-2"
                  />
                  <button
                    onClick={() => saveQuestion(q.id)}
                    className="text-green-600 hover:text-green-800 mr-2"
                    title="Lưu câu hỏi"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => setEditingQuestionId(null)}
                    className="text-gray-500 hover:text-gray-800"
                    title="Hủy chỉnh sửa"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <p className="font-semibold text-blue-800">
                    Câu {index + 1}: {q.question}
                  </p>
                  <div>
                    <button
                      onClick={() => {
                        setEditingQuestionId(q.id);
                        setQuestionDraft(q.question);
                      }}
                      className="text-[#71869D] hover:text-blue-800 mr-2"
                      title="Chỉnh sửa câu hỏi"
                      type="button"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Xóa câu hỏi"
                      type="button"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Lựa chọn */}
            <ul className="list-disc list-inside space-y-1">
              {q.options.map((opt: Option) =>
                editingOption &&
                editingOption.questionId === q.id &&
                editingOption.optionId === opt.id ? (
                  <li key={opt.id} className="flex items-center gap-2">
                    <span className="font-bold">{opt.id.toUpperCase()}.</span>
                    <input
                      type="text"
                      value={optionDraft}
                      onChange={(e) => setOptionDraft(e.target.value)}
                      className="flex-grow p-1 rounded border border-gray-400"
                    />
                    <button
                      onClick={() => saveOption(q.id, opt.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Lưu lựa chọn"
                      type="button"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => setEditingOption(null)}
                      className="text-gray-500 hover:text-gray-800"
                      title="Hủy chỉnh sửa"
                      type="button"
                    >
                      <FaTimes />
                    </button>
                  </li>
                ) : (
                  <li
                    key={opt.id}
                    className="flex justify-between items-center text-gray-600 cursor-pointer hover:text-blue-700"
                  >
                    <span>
                      <b>{opt.id.toUpperCase()}.</b> {opt.text}
                    </span>
                    <div>
                      <button
                        onClick={() => {
                          setEditingOption({
                            questionId: q.id,
                            optionId: opt.id,
                          });
                          setOptionDraft(opt.text);
                        }}
                        className="text-[#71869D] hover:underline"
                        title="Chỉnh sửa lựa chọn"
                        type="button"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}

        {/* Add question */}
        <button
          className="bg-[#9FFFA7] text-[#000000] gap-3  px-4 py-2 font-bold rounded inline-flex items-center hover:bg-green-500 mt-4"
          type="button"
          onClick={() => {
            setPartsData((prev) => {
              const newQuestionId =
                Math.max(...prev[activePart].questions.map((q) => q.id)) + 1;
              const newQuestion: Question = {
                id: newQuestionId,
                question: "New question?",
                options: [
                  { id: "a", text: "Option A" },
                  { id: "b", text: "Option B" },
                  { id: "c", text: "Option C" },
                  { id: "d", text: "Option D" },
                ],
              };
              return {
                ...prev,
                [activePart]: {
                  ...prev[activePart],
                  questions: [...prev[activePart].questions, newQuestion],
                },
              };
            });
          }}
        >
          <span>Thêm câu</span>
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-700 text-white">
            <FaPlus />
          </span>
        </button>
      </div>
      {/* Xác nhận  */}

      <div className="max-w-[900px] mx-auto mt-8">
        <button
          type="button"
          className="w-full bg-[#9FDAFF] hover:bg-blue-400 rounded-full py-3 px-6 flex justify-center items-center gap-3 font-bold text-black"
          onClick={() => {
            // Thêm hàm xử lý khi bấm xác nhận ở đây
            alert("Đã xác nhận!");
          }}
        >
          <span>Xác nhận</span>
        </button>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm text-blue-800 font-semibold text-[16px]">{label}</p>
    <div className="bg-[#EEF5FF] rounded-full px-4 py-1 text-gray-600">
      {value}
    </div>
  </div>
);

export default TestDetailPage;
