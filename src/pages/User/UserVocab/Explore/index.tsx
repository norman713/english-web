// src/pages/User/UserVocab/MyList/MyList.tsx

import React, { useEffect, useState } from "react";
import VocabSetCard from "../../../../components/VocabSetCard";
import setApi from "../../../../api/setApi";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../components/Pagination";

interface VocabSet {
  id: string;
  name: string;
  wordCount: number;
  createdBy?: string;
  createAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vocabList, setVocabList] = useState<VocabSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchVocabSets = async () => {
      setIsLoading(true);
      try {
        // Lấy toàn bộ dữ liệu để phân trang phía client
        const response = await setApi.getAll(1, 9999);
        if (response && response.sets) {
          setVocabList(response.sets);
        } else {
          setVocabList([]);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setVocabList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVocabSets();
  }, []);

  // Lọc theo tìm kiếm
  const filteredList = vocabList.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chia trang bằng slice()
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const handleAddFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // Bấm lại thì bỏ yêu thích
        alert("Đã hủy thêm vào bộ yêu thích!");
      } else {
        newSet.add(id); // Thêm yêu thích
        alert("Đã thêm vào bộ yêu thích!");
      }
      return newSet;
    });
  };

  return (
    <div className="vocab-container">
      <div className="vocab-tab bg-[rgba(169,201,227,0.23)] min-h-screen">
        {/* Thanh công cụ */}
        <div className="top-vocab p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-blue-900">Danh sách bộ từ</h2>
          <div className="search-container flex items-center border border-blue-300 rounded px-2 w-[373px] bg-white">
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

        {/* Danh sách thẻ từ */}
        <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
          {isLoading ? (
            [...Array(itemsPerPage)].map((_, idx) => (
              <div
                key={idx}
                className="h-48 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))
          ) : paginatedList.length > 0 ? (
            paginatedList.map((vocab, idx) => {
              const isFavorited = favoriteIds.has(vocab.id);

              return (
                <div key={idx} className="flex flex-col">
                  <VocabSetCard
                    id={vocab.id}
                    title={vocab.name}
                    wordsCount={vocab.wordCount}
                    searchQuery={searchQuery}
                    onDetailClick={(id) => navigate(`/user/learn/${id}`)}
                  />
                  <button
                    onClick={() => handleAddFavorite(vocab.id)}
                    className={`mt-2 py-2 rounded font-medium transition ${
                      favoriteIds.has(vocab.id)
                        ? "bg-green-400 text-white hover:bg-green-500"
                        : "bg-yellow-400 text-black hover:bg-yellow-500"
                    }`}
                  >
                    {favoriteIds.has(vocab.id)
                      ? "Đã yêu thích"
                      : "Thêm vào bộ yêu thích"}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không tìm thấy danh sách từ vựng nào.
            </p>
          )}
        </div>

        {/* Phân trang */}
        <div className="pagination p-4 text-center">
          <Pagination
            totalItems={filteredList.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Explore;
