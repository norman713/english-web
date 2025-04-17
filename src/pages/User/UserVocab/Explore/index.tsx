// src/pages/Admin/AdminVocab/ListPage/index.tsx

import React, { useEffect, useState } from "react";
import VocabSetCard from "../../../../components/VocabSetCard";
import setApi from "../../../../api/setApi";  // Đường dẫn tới file setApi.ts

// 1. Định nghĩa interface cho từng mục trả về
interface VocabSet {
  id: string;
  name: string;
  wordCount: number;
  createdBy?: string;  // Thêm các trường khác nếu cần
  createAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

const Explore: React.FC = () => {

  // 3. Các state cần thiết
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [vocabList, setVocabList] = useState<VocabSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm chuyển sang trang thêm mới

  useEffect(() => {
    const fetchVocabSets = async () => {
      setIsLoading(true);
      try {
        const response = await setApi.getAll(currentPage, 10);
        console.log("API data:", response); // Kiểm tra dữ liệu trả về
        
        // Đảm bảo response.data có cấu trúc đúng
        if (response && response.sets) {
          setVocabList(response.sets);
          setTotalPages(response.totalPages);
        } else {
          console.error("Dữ liệu trả về không đúng cấu trúc:", response);
          setVocabList([]); // Đặt về mảng rỗng nếu dữ liệu không hợp lệ
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setVocabList([]); // Đặt về mảng rỗng khi có lỗi
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchVocabSets();
  }, [currentPage]);

  // 5. Lọc danh sách theo ô tìm kiếm
  const filteredVocabList = vocabList.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
return (
  <div className="vocab-container">
    <div className="vocab-tab bg-[rgba(169,201,227,0.23)] min-h-screen">
      <div className="top-vocab p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-blue-900">
            Danh sách chủ đề hiện có
          </h2>        
        </div>

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

      {/* Kết quả tìm kiếm */}

      {/* Danh sách từ vựng */}
      { <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
        {isLoading ? (
          [...Array(4)].map((_, index) => (
            <div key={index} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          ))
        ) : filteredVocabList.length > 0 ? (
          filteredVocabList.map((vocab,index) => (
            <VocabSetCard
            key={index}
            id={vocab.id}
            title={vocab.name}
            wordsCount={vocab.wordCount}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Không tìm thấy danh sách từ vựng nào.
          </p>
        )}
      </div> }

      {/* Phân trang */}
      {totalPages > 1 && !isLoading && (
        <div className="pagination p-4 text-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-button px-3 py-1 rounded transition-colors duration-200 ${
                currentPage === page
                  ? "bg-blue-900 text-white"
                  : "text-black hover:bg-white hover:text-blue-900 border hover:border-blue-900"
              }`}
              onClick={() => setCurrentPage(page)}
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
