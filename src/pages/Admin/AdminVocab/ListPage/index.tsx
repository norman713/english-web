// src/pages/Admin/AdminVocab/ListPage/index.tsx

import React, { useEffect, useState } from "react";
import VocabSetCard from "../../../../components/VocabSetCard";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import setApi from "../../../../api/setApi";
import Pagination from "../../../../components/Pagination";

interface VocabSet {
  id: string;
  name: string;
  wordCount: number;
  version?: string;
  createdBy?: string;
  createAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

const ListPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vocabList, setVocabList] = useState<VocabSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 8;

  // Lần đầu lấy toàn bộ dữ liệu (để phân trang client-side)
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
        console.error("Lỗi khi gọi API:", err);
        setVocabList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVocabSets();
  }, []);

  // Lọc theo searchQuery
  const filteredList = vocabList.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tính tổng số trang
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Danh sách hiển thị trang hiện tại
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddNew = () => {
    navigate("/admin/admin-vocab/add-page");
  };

  const handleDeleteSet = async (id: string) => {
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // hard-code tạm
    try {
      await setApi.deleteSet(id, userId);
      setVocabList((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      alert("Xoá thất bại. Vui lòng thử lại.");
      console.error(error);
    }
  };

  return (
    <div className="vocab-container">
      <div className="vocab-tab bg-[rgba(169,201,227,0.23)] min-h-screen">
        {/* Header & Thêm mới */}
        <div className="top-vocab p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-blue-900">
              Danh sách chủ đề hiện có
            </h2>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              <span>Thêm mới</span>
            </button>
          </div>

          {/* Search */}
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

        {/* List cards */}
        <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
          {isLoading ? (
            [...Array(itemsPerPage)].map((_, index) => (
              <div
                key={index}
                className="h-48 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))
          ) : paginatedList.length > 0 ? (
            paginatedList.map((vocab) => (
              <VocabSetCard
                key={vocab.id}
                id={vocab.id}
                title={vocab.name}
                wordsCount={vocab.wordCount}
                version={vocab.version}
                searchQuery={searchQuery}
                onDelete={handleDeleteSet}
                onDetailClick={(id) =>
                  navigate(`/admin/admin-vocab/update-page/${id}`)
                }
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không tìm thấy danh sách từ vựng nào.
            </p>
          )}
        </div>

        {/* Pagination */}
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

export default ListPage;
