// src/pages/User/UserVocab/MyList/MyList.tsx

import React, { useEffect, useState } from "react";
import UserVocabTab from "../../../../components/UserSetCard";
import setApi from "../../../../api/setApi";
import savedSetApi, { SavedSetItem } from "../../../../api/savedSetApi";
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
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vocabList, setVocabList] = useState<VocabSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Danh sách saved-sets của user, để xác định đã yêu thích hay chưa
  const [savedSets, setSavedSets] = useState<SavedSetItem[]>([]);

  const itemsPerPage = 8; 

  // 1. Fetch toàn bộ bộ từ để hiển thị
  useEffect(() => {
    const fetchVocabSets = async () => {
      setIsLoading(true);
      try {
        const response = await setApi.getAll(1, 9999);
        if (response && response.sets) {
          setVocabList(response.sets);
        } else {
          setVocabList([]);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API getAll:", err);
        setVocabList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVocabSets();
  }, []);

  // 2. Fetch danh sách saved-sets (để đánh dấu đã favorite)
  useEffect(() => {
    const fetchSavedSets = async () => {
      try {
        // Giả sử backend trả phân trang, ở đây lấy page 1 size đủ lớn
        const data = await savedSetApi.getSavedSets(1, 9999);
        setSavedSets(data.sets);
      } catch (err) {
        console.error("Lỗi khi lấy saved sets:", err);
        setSavedSets([]);
      }
    };
    fetchSavedSets();
  }, []);

  // 3. Lọc theo searchQuery
  const filteredList = vocabList.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 4. Phân trang
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 5. Xử lý thêm / xoá yêu thích
  const handleToggleFavorite = async (setId: string) => {
    // Kiểm tra xem đã có trong savedSets chưa
    const existing = savedSets.find((s) => s.setId === setId);
    if (existing) {
      // Nếu đã có thì xóa (soft delete)
      try {
        await savedSetApi.deleteSavedSet(existing.id);
        setSavedSets((prev) => prev.filter((s) => s.id !== existing.id));
      } catch (err) {
        console.error("Lỗi khi xóa saved set:", err);
        alert("Không thể bỏ yêu thích. Vui lòng thử lại.");
      }
    } else {
      // Nếu chưa có thì gọi save
      try {
        const newSaved = await savedSetApi.saveSet(setId);
        setSavedSets((prev) => [...prev, newSaved]);
      } catch (err) {
        console.error("Lỗi khi lưu saved set:", err);
        alert("Không thể thêm vào yêu thích. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="vocab-container">
      <div className="vocab-tab bg-[rgba(169,201,227,0.23)] min-h-screen">
        {/* Thanh công cụ */}
        <div className="top-vocab p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-blue-900">Khám phá bộ từ</h2>
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

        {/* Danh sách thẻ bộ từ */}
        <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] mx-10">
          {isLoading
            ? [...Array(itemsPerPage)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-48 bg-gray-200 rounded-lg animate-pulse"
                />
              ))
            : paginatedList.length > 0
            ? paginatedList.map((vocab) => {
                const savedItem = savedSets.find((s) => s.setId === vocab.id);
                const isFavorited = Boolean(savedItem && !savedItem.isDeleted);
                const learnedWords = savedItem?.learnedWords ?? 0;
                const isDeleted = savedItem?.isDeleted ?? false;
                const isCompleted =
                  !isDeleted && learnedWords >= vocab.wordCount;

                return (
                  <UserVocabTab
                    key={vocab.id}
                    title={vocab.name}
                    wordsCount={vocab.wordCount}
                    learnedWords={learnedWords}
                    isDeleted={isDeleted}
                    isCompleted={isCompleted}
                    isFavorited={isFavorited}
                    onDetailClick={() => navigate(`/user/learn/${vocab.id}`)}
                    onStartLearning={() => navigate(`/user/learn/${vocab.id}`)}
                    onAddFavorite={() => handleToggleFavorite(vocab.id)}
                  />
                );
              })
            : (
              <p className="text-center text-gray-500 col-span-full">
                Không tìm thấy bộ từ nào.
              </p>
            )}
        </div>

        {/* Phân trang */}
        {!isLoading && totalPages > 1 && (
          <div className="pagination p-4 text-center">
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
