
import { useState } from "react";
import VocabSetCard from "../../../../components/VocabSetCard";
const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 14;

  const vocabList = [
    {
      id:'1',
      title: "Từ vựng chủ đề giao tiếp hàng ngày",
      wordsCount: 200,

    },
    {
      title: "Từ vựng chủ đề công nghệ",
      wordsCount: 150,
    },
    {
      title: "Từ vựng chủ đề du lịch",
      wordsCount: 100,

    },
    {
      title: "Từ vựng chủ đề ẩm thực",
      wordsCount: 120,

    },
    {
      title: "Từ vựng chủ đề y tế",
      wordsCount: 90,

    },
    {
      title: "Từ vựng chủ đề kinh tế",
      wordsCount: 2,

    },
  ];

  

  const filteredVocabList = vocabList.filter((vocab) =>
    vocab.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredVocabList.length / pageSize);

  const paginatedList = filteredVocabList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="vocab-container">
      <div className="vocab-tab bg-[rgba(169,201,227,0.23)]">
        <div className="top-vocab p-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-blue-900">Khám phá</h2>
          <div className="search-container flex items-center border-2 border-blue-300 rounded px-2">
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


        <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
          {paginatedList.length > 0 ? (
            paginatedList.map((vocab, index) => (
              <VocabSetCard
                key={index}
                id={vocab.id}
                title={vocab.title}
                wordsCount={vocab.wordsCount}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không tìm thấy danh sách từ vựng nào.
            </p>
          )}
        </div>

        {/* Phân trang */}
        {pageCount > 1 && (
          <div className="pagination p-4 text-center space-x-2">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-button px-3 py-1 rounded transition-colors duration-200 ${
                  currentPage === page
                    ? "bg-blue-900 text-white"
                    : " text-black hover:bg-white hover:text-blue-900 border hover:border-blue-900"
                }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
