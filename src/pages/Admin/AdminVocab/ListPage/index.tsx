import { useEffect, useState } from "react";
import VocabSetCard from "../../../../components/VocabSetCard";
import { getVocabularySets, VocabularySet } from "../../../../services/vocabularyService";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vocabList, setVocabList] = useState<VocabularySet[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, totalPages } = await getVocabularySets(1 , 10); // Note: page-1 for 0-based index
        setVocabList(data || []);
        setTotalPages(totalPages || 1);
      } catch (error) {
        console.error("Error fetching vocabulary sets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const filteredVocabList = vocabList.filter((vocab) =>
    vocab.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    navigate("/admin/admin-vocab/add-page"); // Update this path according to your routing
  };

  return (
    <div className="vocab-container">
      <div className="vocab-tab bg-[rgba(169,201,227,0.23)] min-h-screen">
        <div className="top-vocab p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-blue-900">
              Danh sách chủ đề hiện có
            </h2>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              <span>Thêm mới</span>
            </button>
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
        <div className="text-blue-900 px-4 font-semibold">
          {isLoading ? (
            "Đang tải dữ liệu..."
          ) : filteredVocabList.length > 0 ? (
            <>
              {filteredVocabList.length} kết quả{" "}
              {searchQuery && `cho từ khóa "${searchQuery}"`}
            </>
          ) : (
            <>Không tìm thấy kết quả nào {searchQuery && `cho "${searchQuery}"`}</>
          )}
        </div>

        {/* Danh sách từ vựng */}
        <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
          {isLoading ? (
            [...Array(4)].map((_, index) => (
              <div key={index} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            ))
          ) : filteredVocabList.length > 0 ? (
            filteredVocabList.map((vocab) => (
              <VocabSetCard
                key={vocab.id}
                title={vocab.name}
                wordsCount={vocab.wordCount || 0}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không tìm thấy danh sách từ vựng nào.
            </p>
          )}
        </div>

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

export default ListPage;