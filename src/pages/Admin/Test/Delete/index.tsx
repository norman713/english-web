// src/pages/Admin/AdminTest/DeleteTestPage.tsx

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Pagination from "../../../../components/Pagination";
import { useNavigate } from "react-router-dom";
import testApi, { TestItem } from "../../../../api/testApi";

const DeleteTestPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [testList, setTestList] = useState<TestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  // 1. Fetch tất cả bộ đề đã xoá
  useEffect(() => {
    const fetchDeletedTests = async () => {
      setIsLoading(true);
      try {
        // Giả sử backend cho phép size lớn để lấy hết
        const response = await testApi.getDeleted(1, 9999);
        setTestList(response.tests);
      } catch (err) {
        console.error("Lỗi khi lấy bộ đề đã xoá:", err);
        setTestList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeletedTests();
  }, []);

  // 2. Khôi phục (restore) một bộ đề
  const handleRestore = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc muốn khôi phục bộ đề này?");
    if (!confirmed) return;

    try {
      await testApi.restoreTest(id);
      // Bỏ bộ đề vừa khôi phục khỏi danh sách local
      setTestList((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Khôi phục thất bại:", err);
      alert("Khôi phục thất bại. Vui lòng thử lại.");
    }
  };

  // 3. Lọc và phân trang client-side
  const filteredTests = testList.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalItems = filteredTests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="test-container">
      <div className="test-tab">
        {/* Top Test */}
        <div className="top-test p-4 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-blue-900">
            Danh sách đề thi đã xóa
          </h2>

          {/* Search bar */}
          <div className="search-container flex items-center border border-blue-300 rounded px-2 w-[373px]">
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
              className="w-full p-2 outline-none"
            />
          </div>
        </div>

        {/* Test List */}
        <div className="test-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mx-10">
          {isLoading
            ? // Khi loading, hiển thị placeholder
              Array.from({ length: itemsPerPage }).map((_, idx) => (
                <div
                  key={idx}
                  className="relative p-4 rounded-xl bg-red-100 shadow-md flex flex-col justify-between h-[260px] animate-pulse"
                />
              ))
            : paginatedTests.map((test) => (
                <div
                  key={test.id}
                  className="relative p-4 rounded-xl bg-red-100 shadow-md flex flex-col justify-between h-[260px]"
                >
                  {/* Nút restore */}
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-green-500"
                    onClick={() => handleRestore(test.id)}
                    title="Khôi phục bộ đề"
                  >
                    <RefreshCw size={22} />
                  </button>

                  {/* Nội dung test */}
                  <div>
                    <div className="font-bold text-[#31373F] text-[24px]">
                      {test.name}
                    </div>
                    <div className="text-[18px] text-black opacity-50 space-y-1 font-bold">
                      <p>{test.questionCount} câu hỏi</p>
                      <p>{test.minutes} phút</p>
                      <p>#{test.topic}</p>
                      <p>Phiên bản: {test.version}</p>
                    </div>
                  </div>

                  {/* Nút xem chi tiết */}
                  <button
                    className="bg-[#F8F7FF] text-[#4F79F5] text-[16px] font-bold w-full py-2 rounded hover:bg-blue-50 transition"
                    onClick={() => navigate(`/admin/test/${test.id}`)}
                  >
                    Chi tiết
                  </button>
                </div>
              ))}
          {!isLoading && paginatedTests.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              Không tìm thấy đề thi nào.
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
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteTestPage;
