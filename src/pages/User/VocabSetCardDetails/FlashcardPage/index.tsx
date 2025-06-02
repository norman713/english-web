// src/pages/User/VocabSetCardDetails/FlashcardPage/index.tsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { AxiosError } from "axios";

import setApi, { VocabWord } from "../../../../api/setApi";
import cachedSetApi from "../../../../api/cachedSetApi";
import studentImage from "/src/assets/student.png";

const FlashCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { setId } = useParams<{ setId: string }>();

  const [vocabWords, setVocabWords] = useState<VocabWord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // 1) Load all words when setId changes
  useEffect(() => {
    if (!setId) return;
    setIsLoading(true);
    setApi
      .getWordsBySetId(setId, 1, 1000)
      .then((data) => {
        setVocabWords(data.words);
      })
      .catch((err: unknown) => {
        console.error("Lỗi fetch words:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setId]);

  // 2) Show loading or “no words”
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Đang tải từ vựng...</p>
      </div>
    );
  }
  if (!vocabWords.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Không tìm thấy từ vựng.</p>
      </div>
    );
  }

  const totalCards = vocabWords.length;
  const currentCard = vocabWords[currentIndex];

  // 3) Slide animation helpers
  const flipAndChangeCard = (newIndex: number) => {
    setIsAnimating(true);
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 200);
  };
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

  // 4) Flips the card; if it’s the very last card, cache it
  const handleFlip = async (): Promise<void> => {
    if (isAnimating) return;
    const newFlipped = !flipped;
    setFlipped(newFlipped);

    if (newFlipped && currentIndex === totalCards - 1 && setId) {
      try {
        // learnedWords = totalCards
        await cachedSetApi.saveCachedSet({ setId, learnedWords: totalCards });
        alert("Đã lưu bộ từ vào cache!");
      } catch (err: unknown) {
        // Narrow to AxiosError if possible
        if (err instanceof AxiosError) {
          const message = (err.response?.data as { message?: string })?.message ?? "";
          // ignore “already saved” errors, but log anything else
          if (!message.includes("already")) {
            console.error("Lỗi khi cache set:", err);
          }
        } else {
          console.error("Lỗi khi cache set:", err);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <div className="text-3xl font-bold text-[#2754A7]">
          {currentIndex + 1}/{totalCards}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-2xl font-bold text-[#70c4f8] hover:text-blue-500"
        >
          <ArrowLeft size={30} className="mr-1 text-blue-700" />
          Back
        </button>
      </div>

      {/* Flashcard */}
      <div
        className={`
          w-full max-w-2xl h-96 rounded-xl shadow-md overflow-hidden cursor-pointer
          transition-all duration-200 transform
          ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          bg-[#D2F0FA]
        `}
        onClick={() => {
          // Always append a .catch here so any throw inside handleFlip is caught
          handleFlip().catch((e) => console.error(e));
        }}
      >
        {!flipped ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <h2 className="text-5xl font-bold text-gray-800 mb-6 text-center">
              {currentCard.word}
            </h2>
            {currentCard.pronunciation && (
              <p className="text-2xl text-blue-600 mb-4">
                {currentCard.pronunciation}
              </p>
            )}
            {currentCard.example && (
              <p className="text-xl text-gray-700 text-center">
                {currentCard.example}
              </p>
            )}
            <p className="mt-8 text-sm text-gray-500">
              Nhấn vào thẻ hoặc phím space/enter để xem nghĩa và ảnh
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl font-semibold text-blue-800 mb-6 text-center">
              {currentCard.translation}
            </h2>
            <div className="flex-1 flex items-center justify-center">
              <img
                src={currentCard.imageUrl || studentImage}
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

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-3 rounded-full ${
            currentIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:bg-blue-100"
          }`}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={() => {
            handleFlip().catch((e) => console.error(e));
          }}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          <RotateCw size={24} />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === totalCards - 1}
          className={`p-3 rounded-full ${
            currentIndex === totalCards - 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:bg-blue-100"
          }`}
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default FlashCardPage;
