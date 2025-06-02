// src/pages/User/UserVocab/FlashCardSet.tsx

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import setApi, { VocabSet, VocabWord } from "../../../../api/setApi";
import savedSetApi from "../../../../api/savedSetApi";

const FlashCardSet: React.FC = () => {
  const navigate = useNavigate();
  const { setId } = useParams<{ setId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [vocabularySet, setVocabularySet] = useState<VocabSet | null>(null);
  const [vocabularyWords, setVocabularyWords] = useState<VocabWord[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 4;

  const fetchSetData = useCallback(
    async (page: number) => {
      if (!setId) return;
      setIsLoading(true);
      try {
        const setDetails = await setApi.getSetById(setId);
        const wordsData = await setApi.getWordsBySetId(
          setId,
          page,
          itemsPerPage
        );
        setVocabularySet(setDetails);
        setVocabularyWords(wordsData.words);
        setTotalPages(wordsData.totalPages);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setId]
  );

  useEffect(() => {
    fetchSetData(currentPage);
  }, [fetchSetData, currentPage]);

  const handlePracticeNow = async () => {
    if (!setId) return;

    try {
      // 1) Mark this set as “saved/learning” on the server.
      await savedSetApi.saveSet(setId);
    } catch (err) {
      // Now `err` is unknown, so we narrow using axios
      if (
        axios.isAxiosError(err) &&
        err.response?.data?.message &&
        (err.response.data as { message: string }).message.includes(
          "This set has been saved"
        )
      ) {
        // already saved → ignore
      } else {
        console.error("Không thể lưu bộ từ:", err);
        alert("Không thể đặt trạng thái “learning”. Vui lòng thử lại.");
        return;
      }
    }

    // 2) After saving/marking as learning, navigate into flashcards
    navigate(`/user/learn/${setId}/flashcard`);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="max-w-full mx-auto px-4">
      <div className="top-vocab">
        {/* Title & Button */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-blue-900 mb-6">
            {isLoading
              ? "Đang tải..."
              : vocabularySet?.name || "Tên bộ từ không khả dụng"}
          </h1>
          <button
            onClick={handlePracticeNow}
            className="bg-[#B6F3FF] text-[#4E8FEB] px-8 py-4 rounded-lg font-semibold text-xl hover:bg-[#9FE4F0] transition-colors"
          >
            Luyện tập ngay
          </button>
        </div>

        {/* Word Count */}
        <div className="text-center mb-10">
          <p className="text-gray-600 font-bold text-2xl">
            List có {vocabularySet?.wordCount || 0} từ
          </p>
        </div>

        {/* Word List */}
        <div className="grid grid-cols-1 gap-6">
          {vocabularyWords.map((word, index) => (
            <div
              key={word.id}
              className={`p-6 rounded-3xl h-48 flex ${
                index % 2 === 0 ? "bg-teal-100" : "bg-blue-100"
              }`}
            >
              <div className="w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-2xl mb-2">
                    {word.word}
                    {word.pronunciation && (
                      <span className="text-blue-500">
                        {" "}
                        / {word.pronunciation}
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Định nghĩa: {word.translation}
                  </p>
                  {word.example && (
                    <p className="text-gray-600 text-lg mt-2">
                      Ví dụ: {word.example}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-1/2 flex items-center justify-center ml-6">
                <img
                  src={word.imageUrl}
                  alt={word.word}
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-10 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`text-gray-500 text-2xl ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-blue-600"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`text-gray-500 text-2xl ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-blue-600"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashCardSet;
