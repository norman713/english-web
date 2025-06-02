// src/pages/User/UserVocab/CachedList/LearningPage.tsx

import React, { useEffect, useState } from "react";
import cachedSetApi, { CachedSetItem } from "../../../../api/cachedSetApi";
import { useNavigate } from "react-router-dom";
import { FileText, Clock } from "lucide-react";

interface VocabSetForCard {
  id: string;           // setId
  name: string;         // setName
  wordCount: number;    // tổng số từ
  learnedWords: number; // số từ đã học
  isDeleted: boolean;   // đã bị xoá không
}

const LearningPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cachedList, setCachedList] = useState<VocabSetForCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const itemsPerPage = 4;

  // 1. Fetch cached sets và chỉ giữ những set mà learnedWords < wordCount
  useEffect(() => {
    const fetchCachedSets = async () => {
      setIsLoading(true);
      try {
        const data: CachedSetItem[] = await cachedSetApi.getAllCachedSets();
        const mapped: VocabSetForCard[] = data
          .map((item) => ({
            id: item.setId,
            name: item.setName,
            wordCount: item.wordCount,
            learnedWords: item.learnedWords,
            isDeleted: item.isDeleted,
          }))
          // Lọc chỉ những set chưa học hết (learnedWords < wordCount)
          .filter((item) => item.learnedWords < item.wordCount);
        setCachedList(mapped);
      } catch (err: unknown) {
        console.error("Lỗi khi lấy cached sets:", err);
        const msg = err instanceof Error ? err.message : "Lỗi không xác định";
        setErrorMessage(msg);
        setCachedList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCachedSets();
  }, []);

  // 2. Lọc theo searchQuery (trên name), rồi phân trang client-side
  const filteredList = cachedList.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="vocab-container">
      <div className="vocab-tab bg-[rgba(169,201,227,0.23)] min-h-screen">
        {/* ======== Thanh công cụ ======== */}
        <div className="top-vocab p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-blue-900">
            Các bộ từ cần ôn tập
          </h2>
          <div className="search-container flex items-center border-2 border-blue-300 rounded px-2 bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 4a7 7 0 100 14 7 7 0 000-14zm10 10l-4-4"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* ======== Danh sách VocabSetCard ======== */}
        <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, idx) => (
              <div
                key={idx}
                className="h-48 bg-gray-200 rounded-lg animate-pulse"
              />
            ))
          ) : errorMessage ? (
            <p className="text-center text-red-500 col-span-full">
              {errorMessage}
            </p>
          ) : paginatedList.length > 0 ? (
            paginatedList.map((vocab) => {
              const toReview = vocab.wordCount - vocab.learnedWords;
              return (
                <div
                  key={vocab.id}
                  onClick={() => navigate(`/user/learn/${vocab.id}`)}
                  className="relative flex flex-col h-full p-6 rounded-lg bg-blue-100 shadow-sm hover:shadow-md transition-all border border-gray-200 cursor-pointer"
                  style={{ minHeight: "300px" }}
                >
                  {/* 1. Tên bộ từ */}
                  <h3 className="font-bold text-[24px] mb-4 leading-snug line-clamp-2">
                    {vocab.name}
                  </h3>

                  {/* 2. Tổng số từ (icon FileText) */}
                  <div className="flex items-center gap-2 text-[18px] text-gray-700 mb-4 font-medium">
                    <FileText size={18} />
                    <span>{vocab.wordCount} từ</span>
                  </div>

                  {/* 3. Cần ôn tập (icon Clock) */}
                  <div className="flex items-center gap-2 text-[18px] text-gray-700 mb-4 font-medium">
                    <Clock size={18} />
                    <span>Cần ôn tập: {toReview} từ</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không có bộ từ nào cần ôn tập.
            </p>
          )}
        </div>

        {/* ======== Phân trang ======== */}
        {!isLoading && totalPages > 1 && (
          <div className="pagination p-4 text-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded transition-colors duration-200 ${
                  currentPage === page
                    ? "bg-blue-900 text-white"
                    : "text-black hover:bg-white hover:text-blue-900 border hover:border-blue-900"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;
