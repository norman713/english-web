// Flashcard.tsx
interface FlashcardProps {
  word: string;
  phonetic: string;
  example: string;
  currentIndex: number;
  totalCards: number;
  onNext: () => void;
  onPrev: () => void;
}

const Flashcard = ({
  word,
  phonetic,
  example,
  currentIndex,
  totalCards,
  onNext,
  onPrev,
}: FlashcardProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-blue-100 rounded-lg shadow-lg max-w-lg mx-auto my-4">
      <div className="text-3xl font-bold mb-4">{word}</div>
      <div className="text-xl text-gray-700">{phonetic}</div>
      <div className="mt-2 text-center text-gray-600 italic">{example}</div>

      <div className="flex justify-between items-center mt-6 w-full">
        <button
          onClick={onPrev}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Từ trước
        </button>

        <div className="text-gray-700">
          {currentIndex + 1}/{totalCards}
        </div>

        <button
          onClick={onNext}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Từ tiếp theo
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
