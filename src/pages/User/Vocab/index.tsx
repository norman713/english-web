import { useState } from "react";
import Tab from "../../../components/Tab";
import StatusTab from "../../../components/StatusTab";

const VocabularyPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Dữ liệu demo cho các từ vựng
  const vocabList = [
    {
      title: "Từ vựng chủ đề giao tiếp hàng ngày",
      wordsCount: 200,
      status: "Đã hoàn thành",
      progress: "5",
    },
    {
      title: "Từ vựng chủ đề công nghệ",
      wordsCount: 150,
      status: "Đang học",
      progress: "10",
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
      {/* Tabs */}
      <div className="bg-[rgba(169,201,227,0.23)] px-[14px] py-[31px] flex flex-col gap-[29px]">
        <text className="banner-text text-[60px] font-semibold">Flashcard</text>

        <nav className="  flex justify-between items-center">
          <div>
            <Tab labels={["List từ của tôi", "Đang học", "Khám phá"]} />
          </div>
        </nav>
      </div>

      {/* Trạng thái */}
      <div className="flex justify-center items-center space-x-[70px] py-[30px]">
        <StatusTab number={10} text="đã học" backgroundColor="bg-[#F3F7FF]" />
        <StatusTab number={5} text="đã nhớ" backgroundColor="bg-[#E6F7E6]" />
        <StatusTab
          number={5}
          text="chưa học"
          backgroundColor="bg-[#FFE6E6]"
          numberColor="text-[#FA1616]"
        />
      </div>

      {/* Tìm kiếm */}
      <div className="search-container p-4">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Danh sách từ */}
      <div className="vocab-list p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vocabList
          .filter((vocab) =>
            vocab.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((vocab, index) => (
            <div key={index} className="vocab-item p-4 border rounded">
              <h3 className="vocab-title font-semibold">{vocab.title}</h3>
              <p>Số lượng từ: {vocab.wordsCount}</p>
              <p>Trạng thái: {vocab.status}</p>
              <div className="vocab-progress">
                <span>Đã học: {vocab.progress} từ</span>
              </div>
              <div className="vocab-buttons flex space-x-3">
                <button className="start-button bg-blue-500 text-white p-2 rounded">
                  Bắt đầu
                </button>
                <button className="review-button bg-yellow-500 text-white p-2 rounded">
                  Xem lại
                </button>
                <button className="continue-button bg-green-500 text-white p-2 rounded">
                  Học tiếp
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
  );
};

export default VocabularyPage;
