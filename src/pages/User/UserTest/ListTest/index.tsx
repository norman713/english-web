// src/pages/Admin/Test/UserTestPage.tsx
import React, { useState, useEffect } from "react";
import Pagination from "../../../../components/Pagination";
import { useNavigate } from "react-router-dom";
import testApi, { TestItem as RawTestItem } from "../../../../api/testApi";

// Định nghĩa lại kiểu local để hiển thị (tương tự như mảng cứng trước đây)
interface DisplayTestItem {
  id: string;           // Lấy từ RawTestItem.id
  title: string;        // RawTestItem.name
  questionNumber: number; // RawTestItem.questionCount
  testTime: string;     // RawTestItem.minutes + " phút"
  testType: string;     // RawTestItem.topic
}

const UserTestPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  // State chứa danh sách đề thi tải về từ API
  const [testList, setTestList] = useState<DisplayTestItem[]>([]);
  // State để theo dõi đang loading hay đã xong
  const [loading, setLoading] = useState(true);

  // 1. Khi component mount, gọi API lấy về tất cả đề thi (page=1, size lớn)
  useEffect(() => {
    const fetchAllTests = async () => {
      try {
        // Giả sử server có khoảng <10000 đề, gọi page=1 & size=10000
        const response = await testApi.getAll(1, 10000);
        // response.tests: RawTestItem[]
        const mapped: DisplayTestItem[] = response.tests.map(
          (item: RawTestItem) => ({
            id: item.id,
            title: item.name,
            questionNumber: item.questionCount,
            testTime: `${item.minutes} phút`,
            testType: item.topic,
          })
        );
        setTestList(mapped);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đề thi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTests();
  }, []);

  // 2. Lọc theo searchQuery (giữ nguyên logic cũ)
  const filteredTests = testList.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Tính phân trang
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentTests = filteredTests.slice(firstIndex, lastIndex);

  // 4. Xử lý đổi trang
  const onPageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredTests.length / itemsPerPage))
      return;
    setCurrentPage(page);
  };

  // 5. Khi bấm “Chi tiết”, chuyển tới trang chi tiết với id
  const handleDetailClick = (id: string) => {
    navigate(`/user/test/overall/${id}`);
  };

  // 6. Nếu loading, hiển thị placeholder
  if (loading) {
    return (
      <div className="test-container">
        <div className="p-8 text-center text-gray-500">Đang tải đề thi…</div>
      </div>
    );
  }

  return (
    <div className="test-container">
      {/* Test Tab */}
      <div className="test-tab ">
        {/* Top Test */}
        <div className="top-test p-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-blue-900">Thư viện đề thi</h2>
          <div className="search-container flex items-center border border-blue-300 rounded px-2">
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
                setCurrentPage(1); // khi search đổi, reset trang về 1
              }}
              className="w-full p-2 outline-none"
            />
          </div>
        </div>

        {/* Test List */}
        <div className="test-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mx-10">
          {currentTests.map((test) => (
            <div
              key={test.id}
              className="test-item p-4 rounded bg-[rgba(99,176,239,0.23)]"
            >
              <h3 className="test-title font-bold text-2xl">{test.title}</h3>
              <p className="test-detail text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
                <span className="icon-text">📄</span> {test.questionNumber} câu
                hỏi
              </p>
              <p className="test-detail text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
                <span className="icon-clock">⏰</span> {test.testTime}
              </p>
              <p className="test-detail text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
                <span className="icon-hashtag">#</span> {test.testType}
              </p>
              <div className="test-buttons flex space-x-2 mt-4">
                <button
                  className="start-button bg-white text-blue-500 rounded flex justify-center items-end gap-10 p-2 w-full"
                  onClick={() => handleDetailClick(test.id)}
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))}

          {/* Nếu không tìm thấy kết quả nào */}
          {filteredTests.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              Không tìm thấy đề thi phù hợp.
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredTests.length > itemsPerPage && (
          <Pagination
            totalItems={filteredTests.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
            siblingCount={1} // có thể điều chỉnh nếu muốn
          />
        )}
      </div>
    </div>
  );
};

export default UserTestPage;
