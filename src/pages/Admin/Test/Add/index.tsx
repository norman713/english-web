// src/pages/Admin/AdminTest/AddTestPage.tsx

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import testApi from "../../../../api/testApi";

// Định nghĩa câu hỏi và lựa chọn
type Option = { id: string; text: string };
type Question = { id: number; question: string; options: Option[] };

// Định nghĩa phần (Part)
type PartData = {
  description: string;
  questions: Question[];
};
// Kiểu cho toàn bộ partsData (key là tên Part)
type PartsData = { [key: string]: PartData };

// Khởi tạo dữ liệu trống cho 3 phần
const initialPartsData: PartsData = {
  "Part 1": { description: "", questions: [] },
  "Part 2": { description: "", questions: [] },
  "Part 3": { description: "", questions: [] },
};

const AddTestPage: React.FC = () => {
  const navigate = useNavigate();

  // Tab tạo bộ đề: 'create' hoặc 'upload'
  const [mode, setMode] = useState<"create" | "upload">("create");
  // Danh sách tên các phần
  const parts = Object.keys(initialPartsData);
  // Phần đang active (mặc định Part 1)
  const [activePart, setActivePart] = useState<string>(parts[0]);

  // Thông tin chung của test
  const [testTitle, setTestTitle] = useState("");
  const [testTime, setTestTime] = useState("");
  const [testType, setTestType] = useState("");

  // Dữ liệu các phần
  const [partsData, setPartsData] = useState<PartsData>(initialPartsData);

  // Trạng thái chỉnh sửa mô tả
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");

  // Trạng thái chỉnh sửa câu hỏi
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [questionDraft, setQuestionDraft] = useState("");

  // Trạng thái chỉnh sửa lựa chọn
  const [editingOption, setEditingOption] = useState<{ questionId: number; optionId: string } | null>(null);
  const [optionDraft, setOptionDraft] = useState("");

  // Trạng thái submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Khi activePart hoặc partsData thay đổi, reset draft và các trạng thái edit
  useEffect(() => {
    setDescriptionDraft(partsData[activePart].description);
    setIsEditingDescription(false);
    setEditingQuestionId(null);
    setEditingOption(null);
  }, [activePart, partsData]);

  // Lưu mô tả của phần đang active
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

  // Xóa câu hỏi (soft) khỏi phần hiện tại
  const deleteQuestion = (questionId: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa câu hỏi này không?");
    if (!confirmed) return;

    setPartsData((prev) => {
      const updatedQuestions = prev[activePart].questions.filter((q) => q.id !== questionId);
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

  // Lưu chỉnh sửa nội dung câu hỏi
  const saveQuestion = (questionId: number) => {
    setPartsData((prev) => {
      const updatedQuestions = prev[activePart].questions.map((q) =>
        q.id === questionId ? { ...q, question: questionDraft } : q
      );
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

  // Lưu chỉnh sửa nội dung lựa chọn
  const saveOption = (questionId: number, optionId: string) => {
    setPartsData((prev) => {
      const updatedQuestions = prev[activePart].questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) =>
              opt.id === optionId ? { ...opt, text: optionDraft } : opt
            ),
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

  // Xử lý upload file PDF (chỉ placeholder)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    alert(`Đã chọn file: ${file.name}. Tính năng đọc file cần implement thêm.`);
    // TODO: Thêm logic đọc file PDF, parse nội dung, cập nhật partsData tương ứng
  };

  // Xử lý submit tạo mới test
  const handleSubmit = async () => {
    // Validate thông tin chung
    if (!testTitle || !testTime || !testType) {
      alert("Vui lòng nhập đầy đủ thông tin tên đề, thời gian, chủ đề.");
      return;
    }
    const minutes = parseInt(testTime, 10);
    if (isNaN(minutes) || minutes <= 0) {
      alert("Thời gian làm bài phải là số nguyên dương!");
      return;
    }

    // Chuyển partsData về format backend yêu cầu
    const partsArray = Object.entries(partsData).map(([partName, data]) => ({
      content: data.description || partName, // Nếu chưa nhập mô tả, lấy tên part
      questions: data.questions.map((q) => ({
        content: q.question,
        answers: q.options.map((opt) => opt.text),
        correctAnswer: q.options[0]?.text || "", // Mặc định đáp án đúng là đáp án đầu (có thể mở rộng)
        explanation: "",
      })),
    }));

    // Kiểm tra ít nhất phải có 1 câu hỏi
    if (partsArray.every((p) => p.questions.length === 0)) {
      alert("Mỗi đề phải có ít nhất 1 câu hỏi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: testTitle,
        minutes,
        topic: testType,
        parts: partsArray,
      };
      const res = await testApi.createTest(payload);
      alert("Tạo bộ đề thành công!");
      navigate(`/admin/test/${res.id}`);
    } catch (err) {
      alert("Tạo bộ đề thất bại. Vui lòng kiểm tra lại dữ liệu!");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-3">
      <h1 className="text-2xl font-bold text-[#31373F] mb-6">Thêm bộ đề thi</h1>

      {/* Tab chọn mode */}
      <div className="max-w-[900px] mx-auto flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded-full font-semibold cursor-pointer ${
            mode === "create" ? "bg-blue-400 text-white" : "bg-blue-100 text-blue-700"
          }`}
          onClick={() => setMode("create")}
          type="button"
        >
          Tạo từ đầu
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold cursor-pointer ${
            mode === "upload" ? "bg-blue-400 text-white" : "bg-blue-100 text-blue-700"
          }`}
          onClick={() => setMode("upload")}
          type="button"
        >
          Nhập file
        </button>
      </div>

      {mode === "create" && (
        <>
          {/* Thông tin chung */}
          <div className="bg-[#7CC8F680] p-4 px-[200px] space-y-4 max-w-[900px] mx-auto rounded mb-6">
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              placeholder="Nhập tên bộ đề"
              className="w-full p-2 rounded-full border border-gray-400 bg-[#EEF5FF]"
            />
            <input
              type="text"
              value={testTime}
              onChange={(e) => setTestTime(e.target.value)}
              placeholder="Nhập thời gian làm bài (phút)"
              className="w-full p-2 rounded-full border border-gray-400 bg-[#EEF5FF]"
            />
            <input
              type="text"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              placeholder="Nhập tên chủ đề"
              className="w-full p-2 rounded-full border border-gray-400 bg-[#EEF5FF]"
            />
          </div>

          {/* Tabs phần */}
          <div className="bg-[#EEF5FF] p-4 flex items-center space-x-3 rounded-md mb-6 max-w-[900px] mx-auto">
            {parts.map((part) => (
              <button
                key={part}
                className={`px-4 py-1 rounded-full text-sm font-medium cursor-pointer ${
                  part === activePart
                    ? "bg-blue-300 text-blue-800"
                    : "bg-blue-100 text-blue-400"
                }`}
                onClick={() => setActivePart(part)}
                type="button"
              >
                {part}
              </button>
            ))}
          </div>

          {/* Mô tả phần (Part 2, 3 mới có mô tả) */}
          {(activePart === "Part 2" || activePart === "Part 3") && (
            <div className="max-w-[900px] mx-auto bg-[#EEF5FF] p-4 rounded border border-gray-300 whitespace-pre-line mb-6 relative">
              {partsData[activePart].description || isEditingDescription ? (
                <>
                  {!isEditingDescription ? (
                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <button
                          onClick={() => {
                            setIsEditingDescription(true);
                            setDescriptionDraft(partsData[activePart].description);
                          }}
                          className="text-[#71869D] hover:text-blue-800"
                          title="Chỉnh sửa mô tả"
                          type="button"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Bạn có chắc muốn xóa đoạn văn này không?"
                            );
                            if (!confirmed) return;
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
                          type="button"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="mt-2 whitespace-pre-line">
                        {partsData[activePart].description}
                      </div>
                    </div>
                  ) : (
                    <>
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
                          type="button"
                        >
                          <FaSave /> Lưu
                        </button>
                        <button
                          onClick={() => setIsEditingDescription(false)}
                          className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                          type="button"
                        >
                          <FaTimes /> Hủy
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button
                  className="bg-[#9FFFA7] text-[#000000] gap-3 px-4 py-2 font-bold rounded inline-flex items-center hover:bg-green-500 mt-4"
                  onClick={() => {
                    setIsEditingDescription(true);
                    setDescriptionDraft("");
                  }}
                  type="button"
                >
                  <span>Thêm đoạn văn</span>
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-700 text-white">
                    <FaPlus />
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Danh sách câu hỏi của phần đang active */}
          <div className="max-w-[900px] mx-auto space-y-4">
            {partsData[activePart].questions.map((q, index) => (
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
                        type="button"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => setEditingQuestionId(null)}
                        className="text-gray-500 hover:text-gray-800"
                        title="Hủy chỉnh sửa"
                        type="button"
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

                {/* Lưu từng lựa chọn */}
                <ul className="list-disc list-inside space-y-1">
                  {q.options.map((opt) =>
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
                              setEditingOption({ questionId: q.id, optionId: opt.id });
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

            {/* Nút thêm câu hỏi mới */}
            <button
              className="bg-[#9FFFA7] text-[#000000] gap-3 px-4 py-2 font-bold rounded inline-flex items-center hover:bg-green-500 mt-4"
              type="button"
              onClick={() => {
                setPartsData((prev) => {
                  const newQuestionId =
                    prev[activePart].questions.length > 0
                      ? Math.max(...prev[activePart].questions.map((q) => q.id)) + 1
                      : 1;
                  const newQuestion: Question = {
                    id: newQuestionId,
                    question: "Nhập nội dung câu hỏi",
                    options: [
                      { id: "a", text: "Nhập câu trả lời" },
                      { id: "b", text: "Nhập câu trả lời" },
                      { id: "c", text: "Nhập câu trả lời" },
                      { id: "d", text: "Nhập câu trả lời" },
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
        </>
      )}

      {mode === "upload" && (
        <div className="max-w-[900px] mx-auto mb-6">
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer bg-red-200 rounded-lg p-6 w-full flex items-center justify-center gap-3 font-semibold text-red-900"
          >
            Tải lên tệp pdf <FaPlus />
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          {/* Chỗ preview pdf hoặc nội dung file có thể hiện sau khi đọc */}
          <div className="mt-4 p-4 border rounded border-gray-300 bg-white min-h-[100px]">
            {/* Placeholder preview */}
            <p className="text-gray-500">Chưa có nội dung file được tải lên.</p>
          </div>
        </div>
      )}

      {/* Nút xác nhận */}
      <div className="max-w-[900px] mx-auto mt-8">
        <button
          type="button"
          className="w-full bg-[#9FDAFF] hover:bg-blue-400 rounded-full py-3 px-6 flex justify-center items-center gap-3 font-bold text-black"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          <span>{isSubmitting ? "Đang tạo..." : "Xác nhận"}</span>
        </button>
      </div>
    </div>
  );
};

export default AddTestPage;
