import { useState } from "react";
import { X, Plus, Edit3 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import setApi from "../../../../api/setApi"; // Thay bằng đường dẫn đúng của bạn
import axios from "axios";

interface VocabularyCard {
  id: string;
  word: string;
  pronunciation: string;
  translation: string;
  example: string;
  imageUrl: string;
}

const AddPage = () => {
  const navigate = useNavigate();
  const [setName, setSetName] = useState("");
  const [cards, setCards] = useState<VocabularyCard[]>([
    {
      id: uuidv4(),
      word: "",
      pronunciation: "",
      translation: "",
      example: "",
      imageUrl: "",
    },
  ]);

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

  const handleSubmit = async () => {
    if (!setName.trim()) {
      toast.error("Vui lòng nhập tên bộ từ");
      return;
    }

    if (cards.some((card) => !card.word.trim() || !card.translation.trim())) {
      toast.error("Vui lòng nhập đầy đủ từ vựng và nghĩa cho tất cả thẻ");
      return;
    }

    try {
      const payload: import("../../../../api/setApi").CreateSetRequest = {
        name: setName,
        words: cards.map((card) => ({
          word: card.word,
          pronunciation: card.pronunciation || "",
          translation: card.translation,
          example: card.example || "",
          imageUrl: card.imageUrl || "",
        })),
      };

      await setApi.createSet(uuidv4(), payload);

      toast.success("Tạo bộ từ thành công!");
      setTimeout(() => navigate("/admin/admin-vocab/list-page"), 100);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Có lỗi xảy ra khi tạo bộ từ");
      } else {
        toast.error("Lỗi không xác định");
      }
    }
  };

  const handleInputChange = (
    index: number,
    field: keyof VocabularyCard,
    value: string
  ) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedCards = [...cards];
      if (e.target?.result) {
        updatedCards[index].imageUrl = e.target.result as string;
        setCards(updatedCards);
      }
    };
    reader.readAsDataURL(file);
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
                key={card.id}
                className="border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center p-3 border-b bg-gray-50">
                  <span className="text-sm font-medium text-gray-500">Thẻ {index + 1}</span>
                  <button
                    onClick={() => removeCard(card.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Upload ảnh */}
                  <div className="relative h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt="Preview"
                        className="h-full w-full object-contain rounded-lg absolute inset-0 "
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
                        onChange={(e) => handleInputChange(index, "word", e.target.value)}
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
                      onChange={(e) => handleInputChange(index, "pronunciation", e.target.value)}
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
                      onChange={(e) => handleInputChange(index, "translation", e.target.value)}
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
