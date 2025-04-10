import { useState } from "react";
const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Dữ liệu demo cho các từ vựng
  const vocabList = [
    {
      title: "Từ vựng chủ đề du lịch",
      wordsCount: 100,
      status: "Chưa học",
      progress: "0",
    },
    {
      title: "Từ vựng chủ đề du lịch",
      wordsCount: 100,
      status: "Chưa học",
      progress: "0",
    },
  ];

  return (
    <div className="vocab-container">

      {/* Vocab Tab */}
      <div className="vocab-tab bg-[rgba(169,201,227,0.23)]">
        {/* Top Vocab */}
        <div className="top-vocab p-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-blue-900">Khám phá</h2>
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

        {/* Vocab List */}
        <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mx-10">
          {vocabList
            .filter((vocab) =>
              vocab.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((vocab, index) => (
              <div key={index} className="vocab-item p-4 rounded bg-[rgba(99,176,239,0.23)]">
                <h3 className="vocab-title font-bold text-2xl">{vocab.title}</h3>
                <p className="text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
                     Số lượng từ: {vocab.wordsCount}
                </p>
                <p className="text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
                    Trạng thái: {vocab.status}
                </p>
                <div className="vocab-progress">
                <span className="text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
                    Đã học: {vocab.progress} từ
                </span>
                </div>
                <div className="vocab-buttons flex space-x-2 mt-4">
                  <button className="start-button bg-white text-blue-500 rounded flex justify-center items-end gap-10 p-2 w-full">
                    Bắt đầu
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

export default Explore;
