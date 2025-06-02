// src/pages/Admin/AdminVocab/DeletedPage/index.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import setApi, { VocabSet } from "../../../../api/setApi";
import Pagination from "../../../../components/Pagination";
import { ArrowLeftCircle } from "lucide-react";
import AdminSetCard from "../../../../components/AdminSetCard";

const DeletedPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedList, setDeletedList] = useState<VocabSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 8;

  // Lần đầu fetch các set đã xóa
  useEffect(() => {
    const fetchDeletedSets = async () => {
      setIsLoading(true);
      try {
        const response = await setApi.getDeletedAll(1, 9999);
        if (response && response.sets) {
          setDeletedList(response.sets);
        } else {
          setDeletedList([]);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API getDeletedAll:", err);
        setDeletedList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeletedSets();
  }, []);

  // Lọc theo searchQuery
  const filteredList = deletedList.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tính tổng trang
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Lấy danh sách để hiển thị trang hiện tại
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Khôi phục set (backend sẽ lấy userId từ token)
  const handleRestoreSet = async (id: string) => {
    try {
      await setApi.restoreSet(id);
      // Loại set vừa restore khỏi danh sách local
      setDeletedList((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      alert("Khôi phục thất bại. Vui lòng thử lại.");
      console.error(error);
    }
  };

  return (
    <div className="vocab-container">
      <div className="vocab-tab bg-[rgba(169,201,227,0.23)] min-h-screen">
        {/* Header */}
        <div className="top-vocab p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/admin-vocab/list-page")}
              className="text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftCircle size={24} />
            </button>
            <h2 className="text-3xl font-bold text-blue-900">Bộ từ đã xóa</h2>
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
              <AdminSetCard
                key={vocab.id}
                id={vocab.id}
                title={vocab.name}
                wordsCount={vocab.wordCount}
                version={vocab.version}
                isDeleted={true}
                onRestore={handleRestoreSet}
                onDetailClick={(id) =>
                  navigate(`/admin/admin-vocab/update-page/${id}`)
                }
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không tìm thấy bộ từ nào đã xóa.
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

export default DeletedPage;
