// src/pages/User/UserVocab/MyList/MyList.tsx

import React, { useEffect, useState } from "react";
import VocabSetCard from "../../../../components/VocabSetCard";
import savedSetApi, {
  SavedSetsState,
  SavedSetItem,
} from "../../../../api/savedSetApi";
import StatusTab from "../../../../components/StatusTab";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../components/Pagination";
import UserVocabTab from "../../../../components/UserVocabSet";

interface VocabSetForCard {
  id: string;
  name: string;
  wordCount: number;
  learnedWords: number;
  isDeleted: boolean;
}

const MyList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vocabList, setVocabList] = useState<VocabSetForCard[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [errorList, setErrorList] = useState<string | null>(null);

  const [stats, setStats] = useState<SavedSetsState>({
    notLearned: 0,
    learning: 0,
    learned: 0,
  });

  const navigate = useNavigate();
  const itemsPerPage = 4;

  // 1. Lấy số liệu cho StatusTab
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const data = await savedSetApi.getSavedSetsState();
        setStats(data);
      } catch (err: unknown) {
        console.error("Lỗi khi lấy saved-sets state:", err);
        const message =
          err instanceof Error ? err.message : "Lỗi không xác định";
        setErrorStats(message);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // 2. Lấy danh sách saved sets
  useEffect(() => {
    const fetchSavedSets = async () => {
      setIsLoadingList(true);
      try {
        const response = await savedSetApi.getSavedSets(1, 9999);
        const savedItems: SavedSetItem[] = response.sets;
        const mappedList: VocabSetForCard[] = savedItems.map((item) => ({
          id: item.setId,
          name: item.setName,
          wordCount: item.wordCount,
          learnedWords: item.learnedWords,
          isDeleted: item.isDeleted,
        }));
        setVocabList(mappedList);
      } catch (err: unknown) {
        console.error("Lỗi khi lấy danh sách saved sets:", err);
        const message =
          err instanceof Error ? err.message : "Lỗi không xác định";
        setErrorList(message);
        setVocabList([]);
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchSavedSets();
  }, []);

  // 3. Lọc + phân trang
  const filteredList = vocabList.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="vocab-container">
      <div className="vocab-tab bg-[rgba(169,201,227,0.23)] min-h-screen">
        {/* StatusTab */}
        <div className="flex justify-center items-center gap-[70px] py-[30px] bg-white">
          {isLoadingStats ? (
            <>
              <StatusTab
                number={0}
                text="đang tải..."
                backgroundColor="bg-gray-100"
              />
              <StatusTab
                number={0}
                text="đang tải..."
                backgroundColor="bg-gray-100"
              />
              <StatusTab
                number={0}
                text="đang tải..."
                backgroundColor="bg-gray-100"
              />
            </>
          ) : errorStats ? (
            <>
              <StatusTab number={0} text="Lỗi" backgroundColor="bg-red-100" />
              <StatusTab number={0} text="Lỗi" backgroundColor="bg-red-100" />
              <StatusTab number={0} text="Lỗi" backgroundColor="bg-red-100" />
              <p className="text-red-500 col-span-full">{errorStats}</p>
            </>
          ) : (
            <>
              <StatusTab
                number={stats.learned}
                text="đã học"
                backgroundColor="bg-[#F3F7FF]"
              />
              <StatusTab
                number={stats.learning}
                text="đang học"
                backgroundColor="bg-[#E6F7E6]"
              />
              <StatusTab
                number={stats.notLearned}
                text="chưa học"
                backgroundColor="bg-[#FFE6E6]"
                numberColor="text-[#FA1616]"
              />
            </>
          )}
        </div>

        {/* Thanh công cụ Search */}
        <div className="top-vocab p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-blue-900">
            Danh sách từ của tôi
          </h2>
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

        {/* Danh sách VocabSetCard hoặc lỗi nếu có */}
        <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
          {/* test user vocab */}
          <UserVocabTab
            title="Từ vựng chủ đề giao tiếp hằng ngày"
            wordsCount={200}
            learnedWords={0}
            isDeleted={false}
            isCompleted={false}
            isFavorited={true}
            onDetailClick={() => console.log("Chi tiết clicked")}
            onStartLearning={() => console.log("Học tiếp clicked")}
            onAddFavorite={() => console.log("Thêm vào yêu thích!")}
          />

          {isLoadingList ? (
            Array.from({ length: itemsPerPage }).map((_, idx) => (
              <div
                key={idx}
                className="h-48 bg-gray-200 rounded-lg animate-pulse"
              />
            ))
          ) : errorList ? (
            <p className="text-center text-red-500 col-span-full">
              {errorList}
            </p>
          ) : paginatedList.length > 0 ? (
            paginatedList.map((vocab) => (
              <VocabSetCard
                key={vocab.id}
                id={vocab.id}
                title={vocab.name}
                wordsCount={vocab.wordCount}
                learnedWords={vocab.learnedWords}
                isDeleted={vocab.isDeleted}
                onDetailClick={(id) => navigate(`/user/learn/${id}`)}
              />
            ))
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

export default MyList;
