// FlashCardPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import studentImage from '/src/assets/student.png';

const mockVocabularyWords = [
  {
    id: '101',
    setId: '1',
    position: 1,
    word: 'Student',
    pronunciation: '/stjuːdənt/',
    translation: 'Học sinh',
    example: 'Student study English at school',
    imageUrl: studentImage
  },
  {
    id: '102',
    setId: '1',
    position: 2,
    word: 'Teacher',
    pronunciation: '/ˈtiːtʃər/',
    translation: 'Giáo viên',
    example: 'Teacher explains the lesson',
    imageUrl: studentImage
  },
  {
    id: '103',
    setId: '1',
    position: 3,
    word: 'Book',
    pronunciation: '/bʊk/',
    translation: 'Sách',
    example: 'I read a book every night',
    imageUrl: studentImage
  },
  {
    id: '104',
    setId: '1',
    position: 4,
    word: 'School',
    pronunciation: '/skuːl/',
    translation: 'Trường học',
    example: 'School is fun to learn at',
    imageUrl: studentImage
  },
  {
    id: '105',
    setId: '1',
    position: 5,
    word: 'Library',
    pronunciation: '/ˈlaɪbrɛri/',
    translation: 'Thư viện',
    example: 'Visit the library for a quiet study time',
    imageUrl: studentImage
  }
];

const FlashCardPage = () => {

  const navigate = useNavigate();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trong thực tế, bạn sẽ fetch dữ liệu dựa trên setId ở đây
  // ví dụ: useEffect(() => { fetchWords(setId); }, [setId]);

  const totalCards = mockVocabularyWords.length;
  const currentCard = mockVocabularyWords[currentIndex];

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      flipAndChangeCard(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flipAndChangeCard(currentIndex - 1);
    }
  };

  const flipAndChangeCard = (newIndex: number) => {
    setIsAnimating(true);
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 200); // Thời gian transition khớp với CSS (200ms)
  };

  const handleFlip = () => {
    if (!isAnimating) {
      setFlipped(!flipped);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' || e.key === 'Enter') handleFlip();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, flipped]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Header với nút quay lại và hiển thị progress */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <div className="text-3xl font-bold text-[#2754A7]">
          {currentIndex + 1}/{totalCards}
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-2xl font-bold text-[#70c4f8] hover:text-blue-500"
        >
          <ArrowLeft size={30} className="mr-1 text-blue-700 " />
          Back
        </button>
        
      </div>

      {/* Flashcard */}
      <div 
        className={`w-full max-w-2xl h-96 bg-[#D2F0FA] rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-200 transform ${
          flipped ? 'bg-[#D2F0FA]' : 'bg-[#D2F0FA]'
        } ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        onClick={handleFlip}
      >
        {!flipped ? (
          // Mặt trước: hiển thị từ, phiên âm, ví dụ và hướng dẫn lật
          <div className="h-full flex flex-col items-center justify-center p-8">
            <h2 className="text-5xl font-bold text-center mb-6 text-gray-800">
              {currentCard.word}
            </h2>
            <p className="text-2xl text-blue-600 mb-4">
              {currentCard.pronunciation}
            </p>
            <p className="text-xl text-gray-700 text-center">
              {currentCard.example}
            </p>
            <p className="mt-8 text-sm text-gray-500">
              Nhấn vào thẻ hoặc phím space/enter để xem nghĩa và ảnh
            </p>
          </div>
        ) : (
          // Mặt sau: hiển thị nghĩa và ảnh
          <div className="h-full flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl font-semibold text-center mb-6 text-blue-800">
              {currentCard.translation}
            </h2>
            <div className="flex-1 flex items-center justify-center">
              <img 
                src={currentCard.imageUrl} 
                alt={currentCard.word}
                className="max-h-48 max-w-full object-contain rounded-lg"
              />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Nhấn vào thẻ hoặc phím space/enter để quay lại
            </p>
          </div>
        )}
      </div>

      {/* Nút điều hướng */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-3 rounded-full ${currentIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
        >
          <ArrowLeft size={24} />
        </button>
        
        <button 
          onClick={handleFlip}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          <RotateCw size={24} />
        </button>
        
        <button 
          onClick={handleNext}
          disabled={currentIndex === totalCards - 1}
          className={`p-3 rounded-full ${currentIndex === totalCards - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default FlashCardPage;
