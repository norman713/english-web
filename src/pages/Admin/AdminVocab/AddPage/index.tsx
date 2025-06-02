// src/pages/Admin/AdminVocab/AddPage/index.tsx

import React, { useState } from "react";
import { X, Plus, Edit3 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import setApi from "../../../../api/setApi"; 
import axios from "axios";

interface VocabularyCard {
  // `clientId` chỉ để React xử lý key map; không dùng làm wordId
  clientId: string;        
  word: string;
  pronunciation: string;
  translation: string;
  example: string;
  // giữ file thực để upload sau
  file?: File;
}

const AddPage = () => {
  const navigate = useNavigate();
  const [setName, setSetName] = useState("");
  // Mỗi card bây giờ chứa `clientId` để React render, và `file` để upload
  const [cards, setCards] = useState<VocabularyCard[]>([
    {
      clientId: uuidv4(),
      word: "",
      pronunciation: "",
      translation: "",
      example: "",
      file: undefined,
    },
  ]);

  // Thêm thẻ từ mới
  const addCard = () => {
    setCards((prev) => [
      ...prev,
      {
        clientId: uuidv4(),
        word: "",
        pronunciation: "",
        translation: "",
        example: "",
        file: undefined,
      },
    ]);
  };

  // Xóa thẻ từ
  const removeCard = (clientId: string) => {
    if (cards.length > 1) {
      setCards((prev) => prev.filter((c) => c.clientId !== clientId));
    } else {
      toast.warning("Bộ từ cần có ít nhất 1 thẻ từ vựng");
    }
  };

  // Cập nhật giá trị text input (word, translation, v.v.)
  const handleInputChange = (
    clientId: string,
    field: keyof VocabularyCard,
    value: string
  ) => {
    setCards((prev) =>
      prev.map((c) =>
        c.clientId === clientId ? { ...c, [field]: value } : c
      )
    );
  };

  // Khi người dùng chọn file ảnh, lưu vào `file` của card đó
  const handleImageSelect = (clientId: string, file: File) => {
    setCards((prev) =>
      prev.map((c) =>
        c.clientId === clientId ? { ...c, file } : c
      )
    );
  };

  // Xử lý “Submit” để:
  // 1) Tạo bộ từ (tên + từ) → backend tạo ra `setId` và `wordId` cho mỗi từ
  // 2) Lập lại một lượt fetch các từ trong set vừa tạo, để lấy danh sách `wordId`
  // 3) Với mỗi wordId, nếu client đã chọn file, gọi uploadWordImage(setId, wordId, file)
  const handleSubmit = async () => {
    // Validate tên set
    if (!setName.trim()) {
      toast.error("Vui lòng nhập tên bộ từ");
      return;
    }

    // Validate mỗi card có `word` và `translation`
    if (cards.some((c) => !c.word.trim() || !c.translation.trim())) {
      toast.error("Vui lòng nhập đầy đủ từ và nghĩa cho tất cả thẻ");
      return;
    }

    try {
      // 1) Gọi createSet
      // Ở đây, chúng ta không gửi imageUrl (server sẽ sinh wordId riêng)
      const payload = {
        name: setName,
        // Trường `words` chỉ gồm các field bắt buộc (frontend không gởi imageUrl)
        words: cards.map((c) => ({
          word: c.word,
          pronunciation: c.pronunciation || "",
          translation: c.translation,
          example: c.example || "",
        })),
      };

      const createResp = await setApi.createSet(uuidv4(), payload);
      const newSetId = createResp.id;

      // 2) Lấy danh sách words vừa tạo trong set (để có wordId từ backend)
      //    Giả sử backend hỗ trợ getWordsBySetId(setId, page, size)
      //    và trả về shape { words: Array<{id, position, word, ...}>, totalItems, totalPages }
      const wordsData = await setApi.getWordsBySetId(newSetId, 1, cards.length);

      // Tạo map: từ text → wordId. Nếu có trùng nghĩa hoặc trùng từ, chúng ta so sánh bằng position
      // wordsData.words trả về mảng có thứ tự position; client cũng đã map card theo index
      // => ta giả định thứ tự frontend = thứ tự backend
      const backendWords = wordsData.words; // kiểu: Array<{id, position, word, ...}>

      // 3) Với mỗi card, nếu người dùng đã chọn file, gọi uploadWordImage
      await Promise.all(
  cards.map(async (c, idx) => {
    if (c.file) {
      const maybeId = backendWords[idx].id;
      if (!maybeId) {
        console.warn(`Không tìm thấy wordId cho từ index=${idx}, bỏ qua upload`);
        return;
      }
      try {
        await setApi.uploadWordImage(newSetId, maybeId, c.file);
      } catch (uploadErr) {
        console.error(`Lỗi upload ảnh cho wordId=${maybeId}:`, uploadErr);
        toast.warning(
          `Không upload được ảnh cho từ "${c.word}". Vui lòng thử lại.`
        );
      }
    }
  })
);


      toast.success("Tạo bộ từ thành công!");
      setTimeout(() => navigate("/admin/admin-vocab/list-page"), 200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Có lỗi xảy ra khi tạo bộ từ");
      } else {
        toast.error("Lỗi không xác định");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tạo bộ từ mới</h1>

        {/* Tên bộ từ */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Tên bộ từ *
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập tên bộ từ"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </div>

        {/* Danh sách thẻ từ vựng */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Danh sách từ vựng</h2>
            <button
              onClick={addCard}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={18} />
              Thêm thẻ
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <div
                key={card.clientId}
                className="border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center p-3 border-b bg-gray-50">
                  <span className="text-sm font-medium text-gray-500">Thẻ {index + 1}</span>
                  <button
                    onClick={() => removeCard(card.clientId)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Ảnh: người dùng chọn file */}
                  <div className="relative h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {card.file ? (
                      <img
                        src={URL.createObjectURL(card.file)}
                        alt="Preview"
                        className="h-full w-full object-contain rounded-lg absolute inset-0"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                          <Plus size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">Thêm hình ảnh</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageSelect(card.clientId, e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Từ vựng */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Từ vựng *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nhập từ vựng"
                        value={card.word}
                        onChange={(e) =>
                          handleInputChange(card.clientId, "word", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button className="absolute right-2 top-2 text-gray-400 hover:text-blue-500">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Phiên âm */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phiên âm
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập phiên âm"
                      value={card.pronunciation}
                      onChange={(e) =>
                        handleInputChange(card.clientId, "pronunciation", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Nghĩa */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nghĩa *
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập nghĩa"
                      value={card.translation}
                      onChange={(e) =>
                        handleInputChange(card.clientId, "translation", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Ví dụ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ví dụ
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nhập ví dụ"
                        value={card.example}
                        onChange={(e) =>
                          handleInputChange(card.clientId, "example", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button className="absolute right-2 top-2 text-gray-400 hover:text-blue-500">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nút submit */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate("/admin/admin-vocab/list-page")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
          >
            Lưu bộ từ
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPage;
