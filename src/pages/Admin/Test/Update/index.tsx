// src/pages/Admin/Test/Update/index.tsx

import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import partApi, { PartItem } from "../../../../api/partApi";
import questionApi, { QuestionDetail } from "../../../../api/questionApi";
import testApi, { TestDetail } from "../../../../api/testApi";

type Option = { id: string; text: string };
type Question = {
  id: number;
  question: string;
  options: Option[];
  correctAnswer: string; // "A" | "B" | "C" | "D"
  explanation: string;
};

type PartData = {
  description: string;
  questions: Question[];
};
type PartsData = { [key: string]: PartData };

// Khởi tạo ba phần mặc định
const initialPartsData: PartsData = {
  "Part 1": { description: "", questions: [] },
  "Part 2": { description: "", questions: [] },
  "Part 3": { description: "", questions: [] },
};

const UpdateTestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const partKeys = Object.keys(initialPartsData);

  // ======== State chung của test ========
  const [testName, setTestName] = useState("");
  const [testMinutes, setTestMinutes] = useState(""); // lưu dưới dạng string để bind <input>
  const [testTopic, setTestTopic] = useState("");

  // ======== Metadata (readonly) ========
  const [metadata, setMetadata] = useState<{
    creator: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
    version: string;
  }>({
    creator: "",
    createdAt: "",
    updatedAt: "",
    updatedBy: "",
    version: "",
  });

  // Lưu lại dữ liệu gốc để so sánh khi gửi
  const [origDetail, setOrigDetail] = useState<{
    name: string;
    minutes: number;
    topic: string;
  }>({ name: "", minutes: 0, topic: "" });
  const [origPartsData, setOrigPartsData] = useState<PartsData>(
    initialPartsData
  );

  // ======== State phần và câu hỏi ========
  const [partsData, setPartsData] = useState<PartsData>(initialPartsData);

  // Tab đang chọn (Part 1, Part 2, Part 3)
  const [modePart, setModePart] = useState<string>(partKeys[0]);

  // Chỉnh sửa mô tả (Part 2, Part 3)
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");

  // Chỉnh sửa câu hỏi
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  const [questionDraft, setQuestionDraft] = useState("");

  // Chỉnh sửa lựa chọn
  const [editingOption, setEditingOption] = useState<{
    questionId: number;
    optionId: string;
  } | null>(null);
  const [optionDraft, setOptionDraft] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Khi đổi tab phần, reset draft
  useEffect(() => {
    setDescriptionDraft(partsData[modePart]?.description);
    setIsEditingDescription(false);
    setEditingQuestionId(null);
    setEditingOption(null);
  }, [modePart, partsData]);

  // Khi mount, fetch chi tiết test và phần
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // 1. Lấy TestDetail
        const detail: TestDetail = await testApi.getById(id);
        setOrigDetail({
          name: detail.name,
          minutes: detail.minutes,
          topic: detail.topic,
        });
        setTestName(detail.name);
        setTestMinutes(detail.minutes.toString()); // chuyển number -> string
        setTestTopic(detail.topic);

        setMetadata({
          creator: detail.createdByName,
          createdAt: new Date(detail.createdAt).toLocaleDateString(),
          updatedAt: new Date(detail.updatedAt).toLocaleDateString(),
          updatedBy: detail.updatedByName,
          version: detail.version.toString(),
        });

        // 2. Lấy Parts
        const partItems: PartItem[] = await partApi.getPartsByTestId(id);

        // 3. Lấy chi tiết từng câu hỏi (QuestionDetail)
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

        // 4. Map PartItem -> PartsData
        const mapped: PartsData = { ...initialPartsData };
        partItems.forEach((p) => {
          const key = `Part ${p.position}`; // dùng position
          const questions: Question[] = p.questions.map((q, idx) => {
            const qd = detailMap[q.id];
            const opts: Option[] = qd.answers.map((ans, i) => ({
              id: ["A", "B", "C", "D"][i],
              text: ans,
            }));
            return {
              id: idx + 1,
              question: qd.content,
              options: opts,
              correctAnswer: qd.correctAnswer || "",
              explanation: qd.explanation || "",
            };
          });
          mapped[key] = {
            description: p.content,
            questions,
          };
        });

        setPartsData(mapped);
        setOrigPartsData(mapped);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-5 text-center text-gray-500">Đang tải dữ liệu…</div>;
  }

  // ======== Các hàm chỉnh sửa UI ========

  const saveDescription = () => {
    setPartsData((prev) => ({
      ...prev,
      [modePart]: {
        ...prev[modePart],
        description: descriptionDraft,
      },
    }));
    setIsEditingDescription(false);
  };

  const deleteQuestion = (qid: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này không?")) return;
    setPartsData((prev) => {
      const updatedQs = prev[modePart].questions.filter((q) => q.id !== qid);
      return {
        ...prev,
        [modePart]: {
          ...prev[modePart],
          questions: updatedQs,
        },
      };
    });
    setEditingQuestionId(null);
  };

  const saveQuestion = (qid: number) => {
    setPartsData((prev) => {
      const updatedQs = prev[modePart].questions.map((q) =>
        q.id === qid ? { ...q, question: questionDraft } : q
      );
      return {
        ...prev,
        [modePart]: { ...prev[modePart], questions: updatedQs },
      };
    });
    setEditingQuestionId(null);
  };

  const saveOption = (qid: number, oid: string) => {
    setPartsData((prev) => {
      const updatedQs = prev[modePart].questions.map((q) => {
        if (q.id !== qid) return q;
        const updatedOpts = q.options.map((opt) =>
          opt.id === oid ? { ...opt, text: optionDraft } : opt
        );
        return { ...q, options: updatedOpts };
      });
      return {
        ...prev,
        [modePart]: { ...prev[modePart], questions: updatedQs },
      };
    });
    setEditingOption(null);
  };

  const changeCorrectAnswer = (qid: number, newAnswer: string) => {
    setPartsData((prev) => {
      const updatedQs = prev[modePart].questions.map((q) =>
        q.id === qid ? { ...q, correctAnswer: newAnswer } : q
      );
      return {
        ...prev,
        [modePart]: { ...prev[modePart], questions: updatedQs },
      };
    });
  };

  // Đây là chỗ đã fix: đảm bảo trả về đúng PartData
  const changeExplanation = (qid: number, newExp: string) => {
    setPartsData((prev) => {
      const updatedQs = prev[modePart].questions.map((q) =>
        q.id === qid ? { ...q, explanation: newExp } : q
      );
      return {
        ...prev,
        [modePart]: { ...prev[modePart], questions: updatedQs },
      };
    });
  };

  // Build payload cho phần "parts"
  const buildPartsPayload = (): Array<{
    content: string;
    questions: Array<{
      content: string;
      answers: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  }> => {
    return partKeys
      .map((pkey) => {
        const part = partsData[pkey];
        return {
          content: part.description || "",
          questions: part.questions.map((q) => ({
            content: q.question,
            answers: q.options.map((opt) => opt.text),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        };
      })
      .filter(
        (p) =>
          p.content.trim() !== "" ||
          (Array.isArray(p.questions) && p.questions.length > 0)
      );
  };

  const buildPartsPayloadFrom = (
    data: PartsData
  ): Array<{
    content: string;
    questions: Array<{
      content: string;
      answers: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  }> => {
    return partKeys
      .map((pkey) => {
        const part = data[pkey];
        return {
          content: part.description || "",
          questions: part.questions.map((q) => ({
            content: q.question,
            answers: q.options.map((opt) => opt.text),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        };
      })
      .filter(
        (p) =>
          p.content.trim() !== "" ||
          (Array.isArray(p.questions) && p.questions.length > 0)
      );
  };

  // ======== Xử lý submit cập nhật ========
  const handleSubmitUpdate = async () => {
    if (!id) return;

    // 1. Validate chung
    if (!testName.trim() || !testMinutes.trim() || !testTopic.trim()) {
      alert("Vui lòng nhập đủ tên đề, thời gian (phút) và chủ đề.");
      return;
    }
    const minutesNum = parseInt(testMinutes, 10);
    if (isNaN(minutesNum) || minutesNum <= 0) {
      alert("Thời gian làm bài phải là số nguyên dương.");
      return;
    }

    // 2. Build payload parts và so sánh
    const newPartsPayload = buildPartsPayload();
    const oldPartsPayload = buildPartsPayloadFrom(origPartsData);
    const hasPartsChanged =
      JSON.stringify(newPartsPayload) !== JSON.stringify(oldPartsPayload);

    // 3. Nếu parts thay đổi, validate chi tiết câu hỏi
    if (hasPartsChanged) {
      for (const part of newPartsPayload) {
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
    }

    setIsSubmitting(true);
    const promises: Promise<unknown>[] = [];

    // Update tên/chủ đề nếu có thay đổi
    if (testName !== origDetail.name || testTopic !== origDetail.topic) {
      promises.push(
        testApi
          .updateTestGeneral(id, { name: testName, topic: testTopic })
          .then(() => {
            alert("Cập nhật tên/chủ đề thành công!");
            setOrigDetail((prev) => ({
              ...prev,
              name: testName,
              topic: testTopic,
            }));
          })
          .catch((err) => {
            console.error("Update general thất bại:", err);
            alert("Không thể cập nhật tên/chủ đề.");
            throw err;
          })
      );
    }

    // Update minutes nếu thay đổi (kèm parts: [] để backend không complain)
    if (minutesNum !== origDetail.minutes) {
      promises.push(
        testApi
          .updateTest(id, { minutes: minutesNum, parts: [] })
          .then(() => {
            alert("Cập nhật thời gian thành công!");
            setOrigDetail((prev) => ({ ...prev, minutes: minutesNum }));
          })
          .catch((err) => {
            console.error("Update minutes thất bại:", err);
            alert("Không thể cập nhật thời gian.");
            throw err;
          })
      );
    }

    // Update parts nếu thay đổi
    if (hasPartsChanged) {
      promises.push(
        testApi
          .updateTest(id, { parts: newPartsPayload })
          .then(() => {
            alert("Cập nhật nội dung câu hỏi/phần thành công!");
            setOrigPartsData(partsData);
          })
          .catch((err) => {
            console.error("Update parts thất bại:", err);
            alert("Không thể cập nhật phần câu hỏi.");
            throw err;
          })
      );
    }

    try {
      await Promise.all(promises);
      navigate("/admin/test");
    } catch {
      // lỗi đã alert sẵn
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-3">
      <h1 className="text-2xl font-bold text-[#31373F] mb-6">Cập nhật bộ đề thi</h1>

      {/* Thông tin chung */}
      <div className="bg-[#7CC8F680] p-4 px-[200px] space-y-4 max-w-[900px] mx-auto rounded mb-6">
        <div>
          <p className="text-sm text-blue-800 font-semibold text-[16px]">Tên bộ đề</p>
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="w-full p-2 rounded-full border border-gray-400 bg-[#EEF5FF]"
          />
        </div>
        <div>
          <p className="text-sm text-blue-800 font-semibold text-[16px]">Thời gian (phút)</p>
          <input
            type="text"
            value={testMinutes}
            onChange={(e) => setTestMinutes(e.target.value)}
            className="w-full p-2 rounded-full border border-gray-400 bg-[#EEF5FF]"
          />
        </div>
        <div>
          <p className="text-sm text-blue-800 font-semibold text-[16px]">Chủ đề</p>
          <input
            type="text"
            value={testTopic}
            onChange={(e) => setTestTopic(e.target.value)}
            className="w-full p-2 rounded-full border border-gray-400 bg-[#EEF5FF]"
          />
        </div>

        {/* Metadata */}
        <Field label="Người tạo" value={metadata.creator} />
        <Field label="Ngày tạo" value={metadata.createdAt} />
        <Field label="Chỉnh lần cuối" value={metadata.updatedAt} />
        <Field label="Người chỉnh" value={metadata.updatedBy} />
        <Field label="Phiên bản" value={metadata.version} />
      </div>

      {/* Tabs phần */}
      <div className="bg-[#EEF5FF] p-4 flex items-center space-x-3 rounded-md mb-6 max-w-[900px] mx-auto">
        {partKeys.map((part) => (
          <button
            key={part}
            className={`px-4 py-1 rounded-full text-sm font-medium cursor-pointer ${
              part === modePart ? "bg-blue-300 text-blue-800" : "bg-blue-100 text-blue-400"
            }`}
            onClick={() => setModePart(part)}
            type="button"
          >
            {part}
          </button>
        ))}
      </div>

      {/* Mô tả (Part 2 & 3) */}
      {(modePart === "Part 2" || modePart === "Part 3") && (
        <div className="max-w-[900px] mx-auto bg-[#EEF5FF] p-4 rounded border border-gray-300 whitespace-pre-line mb-6 relative">
          {partsData[modePart].description || isEditingDescription ? (
            <>
              {!isEditingDescription ? (
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => {
                        setIsEditingDescription(true);
                        setDescriptionDraft(partsData[modePart].description);
                      }}
                      className="text-[#71869D] hover:text-blue-800"
                      title="Chỉnh sửa mô tả"
                      type="button"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        if (!window.confirm("Bạn có chắc muốn xóa đoạn văn này không?"))
                          return;
                        setPartsData((prev) => ({
                          ...prev,
                          [modePart]: { ...prev[modePart], description: "" },
                        }));
                        setIsEditingDescription(false);
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Xóa mô tả"
                      type="button"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="mt-2 whitespace-pre-line">
                    {partsData[modePart].description}
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
              <span>Thêm mô tả</span>
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-700 text-white">
                <FaPlus />
              </span>
            </button>
          )}
        </div>
      )}

      {/* Danh sách câu hỏi */}
      <div className="max-w-[900px] mx-auto space-y-4">
        {partsData[modePart].questions.map((q, idx) => (
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
                    Câu {idx + 1}: {q.question}
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
            <ul className="list-disc list-inside space-y-1 mb-2">
              {q.options.map((opt) =>
                editingOption &&
                editingOption.questionId === q.id &&
                editingOption.optionId === opt.id ? (
                  <li key={opt.id} className="flex items-center gap-2">
                    <span className="font-bold">{opt.id}.</span>
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
                      <b>{opt.id}.</b> {opt.text}
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

            {/* Đáp án đúng */}
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
                    {opt.id}. {opt.text}
                  </option>
                ))}
              </select>
            </div>

            {/* Giải thích */}
            <div>
              <label className="font-medium">Giải thích:</label>
              <textarea
                value={q.explanation}
                onChange={(e) => changeExplanation(q.id, e.target.value)}
                rows={3}
                className="w-full p-2 rounded border border-gray-400 mt-1"
                placeholder="Nhập giải thích..."
              />
            </div>
          </div>
        ))}

        {/* Thêm câu mới */}
        <button
          className="bg-[#9FFFA7] text-[#000000] gap-3 px-4 py-2 font-bold rounded inline-flex items-center hover:bg-green-500 mt-4"
          type="button"
          onClick={() => {
            setPartsData((prev) => {
              const existingQs = prev[modePart].questions;
              const newId =
                existingQs.length > 0
                  ? Math.max(...existingQs.map((q) => q.id)) + 1
                  : 1;
              const defaultOptions: Option[] = ["A", "B", "C", "D"].map((id) => ({
                id,
                text: "Nhập câu trả lời",
              }));
              const newQuestion: Question = {
                id: newId,
                question: "Nhập nội dung câu hỏi",
                options: defaultOptions,
                correctAnswer: "",
                explanation: "",
              };
              return {
                ...prev,
                [modePart]: {
                  ...prev[modePart],
                  questions: [...existingQs, newQuestion],
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

      {/* Nút xác nhận */}
      <div className="max-w-[900px] mx-auto mt-8">
        <button
          type="button"
          className="w-full bg-[#9FDAFF] hover:bg-blue-400 rounded-full py-3 px-6 flex justify-center items-center gap-3 font-bold text-black"
          disabled={isSubmitting}
          onClick={handleSubmitUpdate}
        >
          <span>{isSubmitting ? "Đang cập nhật..." : "Xác nhận cập nhật"}</span>
        </button>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm text-blue-800 font-semibold text-[16px]">{label}</p>
    <div className="bg-[#EEF5FF] rounded-full px-4 py-1 text-gray-600">{value}</div>
  </div>
);

export default UpdateTestPage;
