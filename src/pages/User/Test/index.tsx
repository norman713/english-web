import { useState } from "react";
const TestPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Dữ liệu demo cho các bài kiểm tra
  const testList = [
    {
      title: "2024 Toeic Test",
      questionNumber: 200,
      testTime: "120 phút",
      testType: "Toeic",
    },
    {
      title: "IELTS Practice Test",
      questionNumber: 150,
      testTime: "90 phút",
      testType: "IELTS",
    },
    {
      title: "TOEFL Mock Test",
      questionNumber: 100,
      testTime: "60 phút",
      testType: "TOEFL",
    },  {
      title: "TOEFL Mock Test",
      questionNumber: 100,
      testTime: "60 phút",
      testType: "TOEFL",
    },  {
      title: "TOEFL Mock Test",
      questionNumber: 100,
      testTime: "60 phút",
      testType: "TOEFL",
    },  {
      title: "TOEFL Mock Test",
      questionNumber: 100,
      testTime: "60 phút",
      testType: "TOEFL",
    },  {
      title: "TOEFL Mock Test",
      questionNumber: 100,
      testTime: "60 phút",
      testType: "TOEFL",
    },  {
      title: "TOEFL Mock Test",
      questionNumber: 100,
      testTime: "60 phút",
      testType: "TOEFL",
    },
 
  ];

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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 outline-none"
            />
          </div>
        </div>

        {/* Test List */}
        <div className="test-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mx-10">
          {testList
            .filter((test) =>
              test.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((test, index) => (
              <div key={index} className="test-item p-4 rounded bg-[rgba(99,176,239,0.23)]">
                <h3 className="test-title font-bold text-2xl">{test.title}</h3>
                <p className="test-detail text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
                  <span className="icon-text">📄</span> {test.questionNumber} câu hỏi
                </p>
                <p className="test-detail text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
                  <span className="icon-clock">⏰</span> {test.testTime}
                </p>
                <p className="test-detail text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
                  <span className="icon-hashtag">#</span> {test.testType}
                </p>
                <div className="test-buttons flex space-x-2 mt-4">
                  <button className="start-button bg-white text-blue-500 rounded flex justify-center items-end gap-10 p-2 w-full">
                    Chi tiết
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="pagination p-4 text-center">
          <button className="pagination-button">1</button>
          <button className="pagination-button">2</button>
          <button className="pagination-button">3</button>
          <button className="pagination-button">10</button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
