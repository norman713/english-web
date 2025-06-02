// src/pages/Admin/Test/Update/UpdatePage.tsx

import { useState, useEffect, useCallback } from "react";
import { X, Plus, Edit3 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import setApi, { VocabSet } from "../../../../api/setApi";
import userApi, { UserInfo } from "../../../../api/userApi";
import axios from "axios";

interface VocabularyCard {
  id: string;
  word: string;
  pronunciation: string;
  translation: string;
  example: string;
  imageUrl: string;
}

const UpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const { setId } = useParams<{ setId: string }>();

  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [setName, setSetName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [cards, setCards] = useState<VocabularyCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1) Lấy thông tin user hiện tại để có userId
  useEffect(() => {
    userApi
      .getCurrentUser()
      .then((u) => setCurrentUser(u))
      .catch((err) => {
        console.error("Không lấy được thông tin user:", err);
        toast.error("Lỗi khi xác thực người dùng.");
      });
  }, []);

  // 2) Fetch chi tiết bộ từ và từ vựng khi setId đổi
  const fetchSet = useCallback(async () => {
    if (!setId) return;
    setIsLoading(true);
    try {
      const setDetail: VocabSet = await setApi.getSetById(setId);
      const wordsData = await setApi.getWordsBySetId(setId, 1, 1000);

      setOriginalName(setDetail.name);
      setSetName(setDetail.name);
      setCards(
        wordsData.words.map((w) => ({
          id: uuidv4(),
          word: w.word,
          pronunciation: w.pronunciation || "",
          translation: w.translation,
          example: w.example || "",
          imageUrl: w.imageUrl || "",
        }))
      );
    } catch (error) {
      console.error("Không thể tải dữ liệu bộ từ:", error);
      toast.error("Không thể tải dữ liệu bộ từ");
    } finally {
      setIsLoading(false);
    }
  }, [setId]);

  useEffect(() => {
    fetchSet();
  }, [fetchSet]);

  // 3) Thêm / Xóa thẻ
  const addCard = () => {
    setCards([
      ...cards,
      {
        id: uuidv4(),
        word: "",
        pronunciation: "",
        translation: "",
        example: "",
        imageUrl: "",
      },
    ]);
  };

  const removeCard = (id: string) => {
    if (cards.length > 1) {
      setCards(cards.filter((card) => card.id !== id));
    } else {
      toast.warning("Bộ từ cần có ít nhất 1 thẻ từ vựng");
    }
  };

  // 4) Cập nhật field input
  const handleInputChange = (
    index: number,
    field: keyof VocabularyCard,
    value: string
  ) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  // 5) Xử lý upload ảnh
  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = [...cards];
      if (e.target?.result) {
        updated[index].imageUrl = e.target.result as string;
        setCards(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  // 6) Nộp form: gọi 2 API tương ứng
  const handleSubmit = async (): Promise<boolean> => {
    if (!setId || !currentUser) {
      toast.error("Thiếu thông tin người dùng hoặc ID bộ từ.");
      return false;
    }

    if (!setName.trim()) {
      toast.error("Vui lòng nhập tên bộ từ");
      return false;
    }

    if (cards.some((card) => !card.word.trim() || !card.translation.trim())) {
      toast.error("Vui lòng nhập đầy đủ từ vựng và nghĩa cho tất cả thẻ");
      return false;
    }

    try {
      // 6a) Cập nhật danh sách words
      await setApi.updateSetById(setId, currentUser.userId, { words: cards });

      // 6b) Nếu tên thay đổi thì gọi updateSetName
      if (setName !== originalName) {
        await setApi.updateSetName(setId, currentUser.userId, setName);
      }

      toast.success("Cập nhật bộ từ thành công!");
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Lỗi khi cập nhật bộ từ");
      } else {
        toast.error("Lỗi không xác định");
      }
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cập nhật bộ từ</h1>

        {/* Nếu đang loading thì hiển thị Loading */}
        {isLoading ? (
          <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
        ) : (
          <>
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
                    key={card.id}
                    className="border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center p-3 border-b bg-gray-50">
                      <span className="text-sm font-medium text-gray-500">
                        Thẻ {index + 1}
                      </span>
                      <button
                        onClick={() => removeCard(card.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="relative h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        {card.imageUrl ? (
                          <img
                            src={card.imageUrl}
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
                              onChange={(e) =>
                                e.target.files?.[0] &&
                                handleImageUpload(index, e.target.files[0])
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Từ vựng *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Nhập từ vựng"
                            value={card.word}
                            onChange={(e) => handleInputChange(index, "word", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button className="absolute right-2 top-2 text-gray-400 hover:text-blue-500">
                            <Edit3 size={16} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phiên âm
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập phiên âm"
                          value={card.pronunciation}
                          onChange={(e) => handleInputChange(index, "pronunciation", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nghĩa *
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập nghĩa"
                          value={card.translation}
                          onChange={(e) => handleInputChange(index, "translation", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ví dụ
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Nhập ví dụ"
                            value={card.example}
                            onChange={(e) => handleInputChange(index, "example", e.target.value)}
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

            {/* Nút submit có xác nhận */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => navigate("/admin/admin-vocab/list-page")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Hủy bỏ
              </button>

              <button
                onClick={async () => {
                  const confirmed = window.confirm(
                    "Bạn có chắc chắn muốn lưu và cập nhật bộ từ này?"
                  );
                  if (!confirmed) return;

                  const success = await handleSubmit();
                  if (success) {
                    navigate("/admin/admin-vocab/list-page");
                  }
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
              >
                Lưu bộ từ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdatePage;
