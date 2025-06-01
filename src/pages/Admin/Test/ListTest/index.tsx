// src/pages/Admin/AdminTestPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import Pagination from "../../../../components/Pagination";
import testApi, { TestItem, GetTestsResponse } from "../../../../api/testApi";

const AdminTestPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [testList, setTestList] = useState<TestItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Số items hiển thị mỗi trang (ở đây giữ nguyên 8)
  const itemsPerPage = 8;

  // Khi currentPage thay đổi, fetch lại data từ server
  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      try {
        // Gọi endpoint GET /api/tests/all?page=...&size=...
        const response: GetTestsResponse = await testApi.getAll(currentPage, itemsPerPage);
        setTestList(response.tests);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("Lỗi khi gọi API testApi.getAll:", err);
        setTestList([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTests();
  }, [currentPage]);

  // Lọc client‐side dựa trên searchQuery
  const filteredList = testList.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Điều hướng đến trang thêm mới test
  const handleAddNew = (): void => {
    navigate("/admin/test/add-test");
  };

  // Xóa test
  const handleDeleteTest = async (id: string): Promise<void> => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá bộ đề này?");
    if (!confirmDelete) return;

    try {
      await testApi.deleteTest(id);
      // Lọc khỏi state để cập nhật UI ngay
      setTestList((prev) => prev.filter((t) => t.id !== id));
      // Cập nhật tổngItems
      setTotalItems((prev) => prev - 1);

      // Nếu sau khi xóa trang hiện tại trống và currentPage > 1, giảm page
      const pagesAfterDeletion = Math.ceil((totalItems - 1) / itemsPerPage);
      if (currentPage > pagesAfterDeletion && pagesAfterDeletion >= 1) {
        setCurrentPage(pagesAfterDeletion);
      }
    } catch (error) {
      console.error("Lỗi khi xóa test:", error);
      alert("Xóa thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="test-container">
      <div className="test-tab bg-[rgba(169,201,227,0.23)] min-h-screen">
        {/* Header & Thêm mới */}
        <div className="top-test p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-blue-900">
              Danh sách bộ đề hiện có
            </h2>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
            >
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
                setCurrentPage(1); // reset về trang 1 khi thay đổi search
              }}
              className="w-full p-2 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* List cards */}
        <div className="test-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
          {isLoading ? (
            // Hiển thị placeholder khi loading
            [...Array(itemsPerPage)].map((_, idx) => (
              <div
                key={idx}
                className="h-48 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))
          ) : filteredList.length > 0 ? (
            filteredList.map((test) => (
              <div
                key={test.id}
                className="relative p-4 rounded-xl bg-[#D0E7F6] shadow-md flex flex-col justify-between h-[260px]"
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  onClick={() => handleDeleteTest(test.id)}
                >
                  <MdOutlineDelete size={24} className="text-[#31373F]" />
                </button>

                {/* Nội dung test */}
                <div>
                  <div className="font-bold text-[#31373F] text-[20px]">
                    {test.name}
                  </div>
                  <div className="text-[16px] text-black opacity-60 space-y-1 font-medium">
                    <p>{test.questionCount} câu hỏi</p>
                    <p>{test.minutes} phút</p>
                    <p>#{test.topic}</p>
                    <p>Phiên bản: {test.version}</p>
                  </div>
                </div>
                <button
                  className="bg-[#F8F7FF] text-[#4F79F5] text-[14px] font-bold w-full py-2 rounded"
                  onClick={() => navigate(`/admin/test/${test.id}`)}
                >
                  Chi tiết
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không tìm thấy bộ đề nào.
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

export default AdminTestPage;
