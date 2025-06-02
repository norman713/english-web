// src/pages/User/UserVocab/MyList/MyList.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import savedSetApi, { SavedSetsState, SavedSetItem } from "../../../../api/savedSetApi";
import Pagination from "../../../../components/Pagination";
import UserSetCard from "../../../../components/UserSetCard";

interface VocabSetForCard {
  id: string;          // chính là setId
  name: string;
  wordCount: number;
  learnedWords: number;
  isDeleted: boolean;
}

const Learning: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vocabList, setVocabList] = useState<VocabSetForCard[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [errorList, setErrorList] = useState<string | null>(null);

  const [stats, setStats] = useState<SavedSetsState>({
    notLearned: 0,
    learning: 0,
    learned: 0,
  });

  // Lưu cả mảng SavedSetItem để có thể truy xuất record ID khi update/delete
  const [savedSets, setSavedSets] = useState<SavedSetItem[]>([]);

  const itemsPerPage = 4;

  // 1) Khi mount, fetch stats và page=1
  useEffect(() => {
    const initFetch = async () => {
      // 1a) Fetch thống kê
      setIsLoadingStats(true);
      try {
        const statsData = await savedSetApi.getSavedSetsState();
        setStats(statsData);
      } catch (err) {
        console.error("Lỗi khi lấy saved-sets state:", err);
        const message = err instanceof Error ? err.message : "Lỗi không xác định";
        setErrorStats(message);
      } finally {
        setIsLoadingStats(false);
      }

      // 1b) Fetch saved-sets page 1
      setIsLoadingList(true);
      try {
        const response = await savedSetApi.getSavedSets(1, itemsPerPage);
        setSavedSets(response.sets);
        const mappedList: VocabSetForCard[] = response.sets.map((item) => ({
          id: item.setId,
          name: item.setName,
          wordCount: item.wordCount,
          learnedWords: item.learnedWords,
          isDeleted: item.isDeleted,
        }));
        setVocabList(mappedList);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách saved-sets:", err);
        const message = err instanceof Error ? err.message : "Lỗi không xác định";
        setErrorList(message);
        setVocabList([]);
      } finally {
        setIsLoadingList(false);
      }
    };
    initFetch();
  }, []);

  // 2) Khi đổi trang thì fetch lại page đó
  useEffect(() => {
    const fetchPage = async () => {
      setIsLoadingList(true);
      try {
        const response = await savedSetApi.getSavedSets(currentPage, itemsPerPage);
        setSavedSets(response.sets);
        const mappedList: VocabSetForCard[] = response.sets.map((item) => ({
          id: item.setId,
          name: item.setName,
          wordCount: item.wordCount,
          learnedWords: item.learnedWords,
          isDeleted: item.isDeleted,
        }));
        setVocabList(mappedList);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("Lỗi khi lấy saved-sets page:", err);
        const message = err instanceof Error ? err.message : "Lỗi không xác định";
        setErrorList(message);
        setVocabList([]);
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchPage();
  }, [currentPage]);

  // 3) Lọc client-side theo searchQuery
  const filteredList = vocabList.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handler: điều hướng tới flashcard (normals)
  const handleDetailClick = (setId: string) => {
    const target = vocabList.find((v) => v.id === setId);
    if (target?.isDeleted) {
      navigate(`/user/learn/${setId}/soft-deleted`);
      return;
    }
    navigate(`/user/learn/${setId}`);
  };

  // Handler: đánh dấu “learning” nếu chưa xóa, nếu đã xóa thì redirect sang “deleted”
  const handleStartLearning = async (setId: string) => {
    // Nếu set đã xóa, chuyển sang trang deleted
    const target = vocabList.find((v) => v.id === setId);
    if (target?.isDeleted) {
      navigate(`/user/learn/${setId}/deleted`);
      return;
    }

    // Ngược lại: gọi API PATCH để set learnedWords = 0 (đánh dấu “đang học”)
    try {
      const existing = savedSets.find((s) => s.setId === setId);
      if (!existing) throw new Error("Không tìm thấy item để cập nhật trạng thái học");
      await savedSetApi.updateSavedSet(existing.id, 0);

      // Refetch stats + danh sách
      const [newStats, newPage] = await Promise.all([
        savedSetApi.getSavedSetsState(),
        savedSetApi.getSavedSets(currentPage, itemsPerPage),
      ]);
      setStats(newStats);
      setSavedSets(newPage.sets);

      const mappedList: VocabSetForCard[] = newPage.sets.map((item) => ({
        id: item.setId,
        name: item.setName,
        wordCount: item.wordCount,
        learnedWords: item.learnedWords,
        isDeleted: item.isDeleted,
      }));
      setVocabList(mappedList);
      setTotalItems(newPage.totalItems);
      setTotalPages(newPage.totalPages);
    } catch (err) {
      console.error("Không thể cập nhật trạng thái học:", err);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  return (
    <div className="vocab-container">
      <div className="vocab-tab bg-[rgba(169,201,227,0.23)] min-h-screen">
        

        {/* Thanh công cụ Search */}
        <div className="top-vocab p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-blue-900">Danh sách từ của tôi</h2>
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

        {/* Danh sách UserSetCard */}
        <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
          {isLoadingList ? (
            Array.from({ length: itemsPerPage }).map((_, idx) => (
              <div key={idx} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            ))
          ) : errorList ? (
            <p className="text-center text-red-500 col-span-full">{errorList}</p>
          ) : filteredList.length > 0 ? (
            filteredList.map((vocab) => (
              <UserSetCard
                key={vocab.id}
                title={vocab.name}
                wordsCount={vocab.wordCount}
                learnedWords={vocab.learnedWords}
                isDeleted={vocab.isDeleted}
                onDetailClick={() => handleDetailClick(vocab.id)}
                onStartLearning={() => handleStartLearning(vocab.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không tìm thấy danh sách từ vựng nào.
            </p>
          )}
        </div>

        {/* Phân trang */}
        {!isLoadingList && totalPages > 1 && (
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

export default Learning;
