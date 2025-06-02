import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import testApi, { TestItem } from "../../../../api/testApi";
import Pagination from "../../../../components/Pagination";

// (Có thể tách thành TestCard như VocabSetCard nếu muốn đẹp & maintain tốt)
const AdminTestListPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [testList, setTestList] = useState<TestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 8;

  // 1. Fetch toàn bộ test chưa xóa (lấy nhiều, phân trang phía client)
  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      try {
        const response = await testApi.getAll(1, 9999);
        setTestList(response.tests || []);
      } catch (err) {
        setTestList([]);
        console.error("Lỗi khi gọi API getAll:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTests();
  }, []);

  // 2. Lọc theo searchQuery
  const filteredList = testList.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Phân trang client-side
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 4. Thêm mới
  const handleAddNew = () => {
    navigate("/admin/test/add-test");
  };

  // 5. Xoá mềm
  const handleDeleteTest = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá bộ đề này?")) return;
    try {
      await testApi.deleteTest(id);
      setTestList((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      alert("Xoá thất bại. Vui lòng thử lại.");
      console.error(error);
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
              <Plus size={20} />
              <span>Thêm mới</span>
            </button>
            <button
              onClick={() => navigate("/admin/test/deleted-page")}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <Trash2 size={20} />
              <span>Đã xoá</span>
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

        {/* Danh sách test */}
        <div className="test-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
          {isLoading ? (
            [...Array(itemsPerPage)].map((_, index) => (
              <div
                key={index}
                className="h-48 bg-gray-200 rounded-lg animate-pulse"
              />
            ))
          ) : paginatedList.length > 0 ? (
            paginatedList.map((test) => (
              <div
                key={test.id}
                className="relative p-4 rounded-xl bg-[#D0E7F6] shadow-md flex flex-col justify-between h-[260px]"
              >
                {/* Xoá */}
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  onClick={() => handleDeleteTest(test.id)}
                  title="Xóa bộ đề"
                >
                  <Trash2 size={24} />
                </button>
                {/* Nội dung test */}
                <div>
                  <div className="font-bold text-[#31373F] text-[24px]">{test.name}</div>
                  <div className="text-[18px] text-black opacity-50 space-y-1 font-bold">
                    <p>{test.questionCount} câu hỏi</p>
                    <p>{test.minutes} phút</p>
                    <p>#{test.topic}</p>
                    <p>Phiên bản: {test.version}</p>
                  </div>
                </div>
                {/* Nút Chi tiết */}
                <button
                  className="bg-[#F8F7FF] text-[#4F79F5] text-[14px] font-bold w-full py-2 rounded hover:bg-blue-50 transition"
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

export default AdminTestListPage;
