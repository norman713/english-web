import { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import Pagination from "../../../../components/Pagination";
import { useNavigate } from "react-router-dom";

const DeleteTestPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // mock data about test
  const [testList, setTestList] = useState([
    {
      id: 1,
      title: "2024 Toeic Test",
      questionNumber: 200,
      testTime: "120 phút",
      testType: "Toeic",
      version: 1.0,
    },
    {
      id: 2,
      title: "IELTS Practice Test",
      questionNumber: 150,
      testTime: "90 phút",
      testType: "IELTS",
      version: 1.0,
    },
    {
      id: 3,
      title: "TOEFL Mock Test",
      questionNumber: 100,
      testTime: "60 phút",
      testType: "TOEFL",
      version: 2.0,
    },
    {
      id: 4,
      title: "TOEFL Mock Test",
      questionNumber: 100,
      testTime: "60 phút",
      testType: "TOEFL",
      version: 2.0,
    },
    {
      id: 5,
      title: "TOEFL Mock Test",
      questionNumber: 100,
      testTime: "60 phút",
      testType: "TOEFL",
      version: 3.0,
    },
    {
      id: 6,
      title: "TOEFL Mock Test",
      questionNumber: 100,
      testTime: "60 phút",
      testType: "TOEFL",
      version: 1.0,
    },
  ]);

  // delete test
  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá bộ đề này?");
    if (confirmDelete) {
      const updatedList = testList.filter((test) => test.id !== id);
      setTestList(updatedList);
    }
  };

  //pagination
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTests = testList.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="test-container">
      {/* Test Tab */}
      <div className="test-tab ">
        {/* Top Test */}
        <div className="top-test p-4 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-blue-900">
            Danh sách đề thi đã xóa
          </h2>

          {/* search bar */}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 outline-none"
            />
          </div>
        </div>

        {/* Test List */}
        <div className="test-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mx-10">
          {paginatedTests.map((test, index) => (
            <div
              key={index}
              className="relative p-4 rounded-xl bg-[#D0E7F6] shadow-md flex flex-col justify-between h-[260px]"
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                onClick={() => handleDelete(test.id)}
              >
                <MdOutlineDelete size={30} className="text-[#31373F]" />
              </button>

              {/* content of test */}
              <div>
                <div className="font-bold text-[#31373F] text-[24px]">
                  {test.title}
                </div>
                <div className="text-[18px] text-black opacity-50 space-y-1 font-bold">
                  <p>{test.questionNumber} câu hỏi</p>
                  <p>{test.testTime}</p>
                  <p>#{test.testType}</p>
                  <p>Phiên bản: {test.version}</p>
                </div>
              </div>
              <button
                className="bg-[#F8F7FF] text-[#4F79F5] text-[16px] font-bold w-full py-2 rounded"
                onClick={() => navigate(`/admin/test/${test.id}`)}
              >
                Chi tiết
              </button>
            </div>
          ))}
        </div>

        {/* Pagination*/}
        <div className="pagination p-4 text-center">
          <Pagination
            totalItems={filteredTests.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteTestPage;
