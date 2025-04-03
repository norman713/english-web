// FlashcardsPage.tsx
import { useState } from "react";
import Flashcard from "../../../components/Flashcard";

const flashcards = [
  {
    word: "Student",
    phonetic: "'stʊdənt",
    example: "Ex: Student study English at school",
  },
  {
    word: "Teacher",
    phonetic: "'tiːtʃər",
    example: "Ex: The teacher explains the lesson.",
  },
  {
    word: "School",
    phonetic: "skuːl",
    example: "Ex: Students go to school every day.",
  },
  // Thêm các flashcard khác ở đây
];

const FlashcardsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl p-6">
        <Flashcard
          word={currentFlashcard.word}
          phonetic={currentFlashcard.phonetic}
          example={currentFlashcard.example}
          currentIndex={currentIndex}
          totalCards={flashcards.length}
          onNext={nextCard}
          onPrev={prevCard}
        />
      </div>
    </div>
  );
};

export default FlashcardsPage;
