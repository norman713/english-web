// VocabSetCardDetails.jsx
import { useState, } from 'react';
import { useNavigate,useParams  } from 'react-router-dom';
import studentImage from '/src/assets/student.png';
// Mock data based on the provided interfaces
const mockVocabularySet = {
  id: '1',
  name: 'Từ vựng chủ đề giao tiếp hàng ngày',
  wordCount: 200,
  createdAt: '2023-04-12T10:00:00Z',
  updatedAt: '2023-04-12T10:00:00Z',
  createdBy: 'admin',
  isDeleted: false
};

const mockVocabularyWords = [
  {
    id: '101',
    setId: '1',
    position: 1,
    word: 'Student',
    pronunciation: '/stjuːdənt/',
    translation: 'Học sinh',
    example: 'Student study English at school',
    imageUrl:studentImage
  },
  {
    id: '102',
    setId: '1',
    position: 2,
    word: 'Student',
    pronunciation: '/stjuːdənt/',
    translation: 'Học sinh',
    example: 'Student study English at school',
    imageUrl: studentImage
  },
  {
    id: '103',
    setId: '1',
    position: 3,
    word: 'Student',
    pronunciation: '/stjuːdənt/',
    translation: 'Học sinh',
    example: 'Student study English at school',
    imageUrl: studentImage
  },
  {
    id: '104',
    setId: '1',
    position: 4,
    word: 'Student',
    pronunciation: '/stjuːdənt/',
    translation: 'Học sinh',
    example: 'Student study English at school',
    imageUrl: studentImage
  },
  {
    id: '105',
    setId: '1',
    position: 4,
    word: 'Student',
    pronunciation: '/stjuːdənt/',
    translation: 'Học sinh',
    example: 'Student study English at school',
    imageUrl: studentImage
  }
];

const FlashCardSet = () => {
  const navigate = useNavigate(); // Hook để điều hướng
  const { setId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);  
  // In a real app, you would fetch the vocabulary set and words based on the ID
  const vocabularySet = mockVocabularySet;
  const vocabularyWords = mockVocabularyWords;
  
  const itemsPerPage = 4;
  const totalPages = Math.ceil(vocabularyWords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleWords = vocabularyWords.slice(startIndex, startIndex + itemsPerPage);

  const handlePracticeNow = () => {
    navigate(`/user/learn/${setId}/flashcard`);
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  return (
    <div className="max-w-full mx-auto px-4">
  {/* Content */}
  <div className="top-vocab">
    <div className="text-center mb-10">
      <h1 className="text-5xl font-bold text-blue-900 mb-6">
        {vocabularySet.name}
      </h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={handlePracticeNow} // Gọi hàm điều hướng
          className="bg-[#B6F3FF] text-[#4E8FEB] px-8 py-4 rounded-lg font-semibold text-xl hover:bg-[#9FE4F0] transition-colors"
        >
          Luyện tập ngay
        </button>
      </div>
    </div>
    
    <div className="text-center mb-10">
      <p className="text-gray-600 font-bold text-2xl">List có {vocabularySet.wordCount} từ</p>
    </div>
    
    {/* Word Cards */}
    <div className="grid grid-cols-1 gap-6">
      {visibleWords.map((word) => (
        <div 
          key={word.id} 
          className={`p-6 rounded-3xl h-48 flex ${
            word.position % 2 === 0 ? 'bg-teal-100' : 'bg-blue-100'
          }`}
        >
          <div className="w-1/2 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-2xl mb-2">
                {word.word} <span className="text-blue-500">/ {word.pronunciation}</span>
              </h3>
              <p className="text-gray-600 text-lg">Định nghĩa: {word.translation}</p>
              <p className="text-gray-600 text-lg mt-2">Ví dụ: {word.example}</p>
            </div>
          </div>
          <div className="w-1/2 items-center justify-center ml-6">
            <img 
              src={word.imageUrl || '/student.png'} 
              alt={word.word}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      ))}
    </div>
    
    {/* Pagination */}
    <div className="flex justify-center items-center mt-10 space-x-4">
      <button 
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`text-gray-500 text-2xl ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'}`}
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}
      <button 
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`text-gray-500 text-2xl ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'}`}
      >
        &gt;
      </button>
    </div>
  </div>
</div>
  );
};

export default FlashCardSet;