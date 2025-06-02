// src/pages/Admin/AdminTest/AddTestPage.tsx

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import testApi from "../../../../api/testApi";
import axiosClient from "../../../../api/axiosClient";

// Định nghĩa câu hỏi và lựa chọn
type Option = { id: string; text: string };
type Question = {
  id: number;
  question: string;
  options: Option[];
  correctAnswer: string; // sẽ là "A" | "B" | "C" | "D"
  explanation: string;
};

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

  // Mode: "create" hoặc "upload"
  const [mode, setMode] = useState<"create" | "upload">("create");
  const parts = Object.keys(initialPartsData);
  const [activePart, setActivePart] = useState<string>(parts[0]);

  // Thông tin chung của test
  const [testTitle, setTestTitle] = useState("");
  const [testTime, setTestTime] = useState("");
  const [testType, setTestType] = useState("");

  // Dữ liệu các phần (cho mode "create")
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

  // Dành cho mode "upload"
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Khi activePart hoặc partsData thay đổi, reset draft và trạng thái edit (mode "create")
  useEffect(() => {
    setDescriptionDraft(partsData[activePart].description);
    setIsEditingDescription(false);
    setEditingQuestionId(null);
    setEditingOption(null);
  }, [activePart, partsData]);

  // ======== LOGIC CHO MODE "CREATE" ========

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

  // Thay đổi correctAnswer (lưu ký tự A/B/C/D)
  const changeCorrectAnswer = (questionId: number, newAnswer: string) => {
    setPartsData((prev) => ({
      ...prev,
      [activePart]: {
        ...prev[activePart],
        questions: prev[activePart].questions.map((q) =>
          q.id === questionId ? { ...q, correctAnswer: newAnswer } : q
        ),
      },
    }));
  };

  // Thay đổi explanation
  const changeExplanation = (questionId: number, newExp: string) => {
    setPartsData((prev) => ({
      ...prev,
      [activePart]: {
        ...prev[activePart],
        questions: prev[activePart].questions.map((q) =>
          q.id === questionId ? { ...q, explanation: newExp } : q
        ),
      },
    }));
  };

  // Handle submit tạo mới test
  const handleSubmitCreate = async () => {
    // 1. Validate thông tin chung
    if (!testTitle || !testTime || !testType) {
      alert("Vui lòng nhập đầy đủ tên đề, thời gian, chủ đề.");
      return;
    }
    const minutes = parseInt(testTime, 10);
    if (isNaN(minutes) || minutes <= 0) {
      alert("Thời gian làm bài phải là số nguyên dương!");
      return;
    }

    // 2. Build payload "parts" đúng định dạng
    const partsArray = Object.entries(partsData).map(([partName, data]) => ({
      content: data.description || partName,
      questions: data.questions.map((q) => ({
        content: q.question,
        answers: q.options.map((opt) => opt.text),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
    }));

    // 3. Kiểm tra ít nhất có 1 câu hỏi
    if (partsArray.every((p) => p.questions.length === 0)) {
      alert("Mỗi bộ đề phải có ít nhất 1 câu hỏi.");
      return;
    }

    // 4. Kiểm tra từng câu hỏi
    for (const part of partsArray) {
      for (const q of part.questions) {
        if (q.answers.length !== 4 || q.answers.some((a) => !a.trim())) {
          alert("Mỗi câu hỏi phải có đúng 4 đáp án không bỏ trống.");
          return;
        }
        if (!["A", "B", "C", "D"].includes(q.correctAnswer)) {
          alert("Vui lòng chọn đáp án đúng (A, B, C hoặc D) cho mỗi câu hỏi.");
          return;
        }

        if (!q.explanation.trim()) {
          alert("Vui lòng nhập giải thích cho mỗi câu hỏi.");
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: testTitle,
        minutes,
        topic: testType,
        parts: partsArray,
      };
      await testApi.createTest(payload);
      alert("Tạo bộ đề thành công!");
      navigate("/admin/test"); // Quay về trang list page
    } catch (err: unknown) {
      console.error("Tạo bộ đề thất bại:", err);
      let serverMsg = "Lỗi không xác định từ server.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: unknown } } }).response?.data?.message === "string"
      ) {
        serverMsg = (err as { response: { data: { message: string } } }).response.data.message;
      }
      alert(`Tạo bộ đề thất bại: ${serverMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======== LOGIC CHO MODE "UPLOAD" ========

  // Khi user chọn file Excel
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFileError(null);
  };

  // Khi bấm “Tải file mẫu”
  const handleDownloadTemplate = async () => {
    setFileError(null);
    try {
      // Gọi API /api/tests/template để lấy blob
      const response = await axiosClient.get("/api/tests/template", {
        responseType: "blob",
      });
      // Tạo URL tạm và trigger download
      const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Tên file tùy server; đặt mặc định là template.xlsx
      a.download = "template.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      console.error("Tải template thất bại:", err);
      alert("Không thể tải file mẫu. Vui lòng thử lại.");
    }
  };

  // Khi bấm “Xác nhận tạo từ file”
  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn file trước khi xác nhận.");
      return;
    }

    setIsSubmitting(true);
    try {
      await testApi.uploadTestFile(selectedFile);
      alert("Tạo bộ đề thành công từ file!");
      navigate("/admin/test");
    } catch (err: unknown) {
      console.error("Upload thất bại:", err);
      let serverMsg = "Lỗi không xác định từ server.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: unknown } } }).response?.data?.message === "string"
      ) {
        serverMsg = (err as { response: { data: { message: string } } }).response.data.message;
      }
      alert(`Upload thất bại: ${serverMsg}`);
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
                  part === activePart ? "bg-blue-300 text-blue-800" : "bg-blue-100 text-blue-400"
                }`}
                onClick={() => setActivePart(part)}
                type="button"
              >
                {part}
              </button>
            ))}
          </div>

          {/* Mô tả phần (Part 2, 3) */}
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
                            const confirmed = window.confirm("Bạn có chắc muốn xóa đoạn văn này không?");
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
              <div key={q.id} className="bg-[#EEF5FF] rounded p-4 border border-gray-300 relative">
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

                {/* Danh sách lựa chọn */}
                <ul className="list-disc list-inside space-y-1 mb-2">
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
                        className="flex justify-between items-center text-gray-600 hover:text-blue-700"
                      >
                        <span>
                          <b>{opt.id.toUpperCase()}.</b> {opt.text}
                        </span>
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
                      </li>
                    )
                  )}
                </ul>

                {/* Chọn đáp án đúng */}
                <div className="mb-2">
                  <label className="font-medium">Đáp án đúng:</label>
                  <select
                    value={q.correctAnswer}
                    onChange={(e) => changeCorrectAnswer(q.id, e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="">-- Chọn đáp án --</option>
                    {q.options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.id.toUpperCase()}. {opt.text}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nhập giải thích */}
                <div>
                  <label className="font-medium">Giải thích:</label>
                  <textarea
                    value={q.explanation}
                    onChange={(e) => changeExplanation(q.id, e.target.value)}
                    rows={3}
                    className="w-full p-2 rounded border border-gray-400 mt-1"
                    placeholder="Nhập giải thích tại đây..."
                  />
                </div>
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
                  // Tạo default 4 options
                  const defaultOptions: Option[] = [
                    { id: "A".toLowerCase(), text: "Nhập câu trả lời" },
                    { id: "B".toLowerCase(), text: "Nhập câu trả lời" },
                    { id: "C".toLowerCase(), text: "Nhập câu trả lời" },
                    { id: "D".toLowerCase(), text: "Nhập câu trả lời" },
                  ].map((opt, idx) => ({ id: ["A", "B", "C", "D"][idx], text: opt.text }));
                  const newQuestion: Question = {
                    id: newQuestionId,
                    question: "Nhập nội dung câu hỏi",
                    options: defaultOptions,
                    correctAnswer: "",
                    explanation: "",
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

          {/* Nút xác nhận cho mode "create" */}
          <div className="max-w-[900px] mx-auto mt-8">
            <button
              type="button"
              className="w-full bg-[#9FDAFF] hover:bg-blue-400 rounded-full py-3 px-6 flex justify-center items-center gap-3 font-bold text-black"
              disabled={isSubmitting}
              onClick={handleSubmitCreate}
            >
              <span>{isSubmitting ? "Đang tạo..." : "Xác nhận"}</span>
            </button>
          </div>
        </>
      )}

      {mode === "upload" && (
        <div className="max-w-[900px] mx-auto space-y-6">
          {/* Hướng dẫn và nút tải file mẫu */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
              type="button"
            >
              <FaDownload /> Tải file mẫu
            </button>
          </div>

          {/* Input file */}
          <div className="border border-gray-300 rounded p-4 flex flex-col items-center">
            <label htmlFor="excel-upload" className="cursor-pointer">
              <div className="bg-red-200 rounded-lg p-6 flex items-center justify-center gap-3 text-red-900 font-semibold">
                <FaPlus /> Chọn tệp Excel
              </div>
            </label>
            <input
              type="file"
              id="excel-upload"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileSelection}
            />
            {selectedFile && (
              <p className="mt-2 text-gray-600">Đã chọn: {selectedFile.name}</p>
            )}
            {fileError && <p className="text-red-600 mt-2">{fileError}</p>}
          </div>

          {/* Nút xác nhận upload file */}
          <div>
            <button
              onClick={handleConfirmUpload}
              disabled={isSubmitting}
              className="w-full bg-[#9FDAFF] hover:bg-blue-400 rounded-full py-3 px-6 flex justify-center items-center gap-3 font-bold text-black"
            >
              <span>{isSubmitting ? "Đang tạo..." : "Xác nhận tạo từ file"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTestPage;
