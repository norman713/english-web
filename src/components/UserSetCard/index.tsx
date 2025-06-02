// src/components/UserSetCard.tsx

import React from "react";
import { FileText, XCircle, CheckCircle2, Clock, Heart } from "lucide-react";

interface UserSetCardProps {
  id?: string;
  title: string;
  wordsCount: number;
  learnedWords?: number;
  isDeleted?: boolean;
  isCompleted?: boolean;
  isFavorited?: boolean;
  onDetailClick?: () => void;
  onStartLearning?: () => void;
  onAddFavorite?: () => void;
}

const UserSetCard: React.FC<UserSetCardProps> = ({
  title,
  wordsCount,
  learnedWords = 0,
  isDeleted = false,
  isCompleted = false,
  isFavorited = false,
  onDetailClick,
  onStartLearning,
  onAddFavorite,
}) => {
  // Màu nền
  let bgColor = "bg-[#D0E7F6]";
  if (isDeleted) {
    bgColor = "bg-red-300";
  } else if (!isFavorited) {
    // nếu chưa "favorited" và chưa xóa thì màu nền xanh nhạt
    bgColor = "bg-blue-100";
  }

  // Phần status ở giữa
  let statusElement = null;
  if (isDeleted) {
    statusElement = (
      <div className="flex items-center gap-1 text-red-700 font-semibold mb-2">
        <XCircle size={16} />
        Đã bị xoá
      </div>
    );
  } else if (isCompleted) {
    statusElement = (
      <div className="flex items-center gap-1 text-green-500 font-semibold mb-2">
        <CheckCircle2 size={16} />
        Đã hoàn thành
      </div>
    );
  } else if (learnedWords > 0) {
    statusElement = (
      <div className="flex items-center gap-1 text-gray-700 font-semibold mb-2">
        <Clock size={16} />
        Đã học: {learnedWords}
      </div>
    );
  }

  // Xác định văn bản & handler của nút cuối
  let buttonText = "Chi tiết";
  let buttonHandler = onDetailClick;

  if (isDeleted) {
    buttonText = "Bắt đầu";
    buttonHandler = onDetailClick;
  } else if (isFavorited) {
    buttonText = "Bỏ yêu thích";
    buttonHandler = onAddFavorite;
  } else if (learnedWords > 0) {
    buttonText = "Học tiếp";
    buttonHandler = onStartLearning;
  } else {
    // vẫn giữ "Chi tiết"
    buttonText = "Chi tiết";
    buttonHandler = onDetailClick;
  }

  return (
    <div
      className={`${bgColor} rounded-lg p-4 w-[300px] flex flex-col items-center shadow-md relative`}
    >
      {/* Icon trái tim góc trên */}
      <div className="w-full flex justify-end mb-2">
        {onAddFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddFavorite();
            }}
            className={`cursor-pointer transition-colors ${
              isFavorited ? "text-red-600" : "text-gray-500 hover:text-red-600"
            }`}
            title={isFavorited ? "Đã yêu thích" : "Thêm vào yêu thích"}
            aria-label="Toggle favorite"
          >
            <Heart size={28} />
          </button>
        )}
      </div>

      {/* Tiêu đề */}
      <div className="font-bold text-gray-900 text-[25px] mb-4 leading-snug text-start w-full">
        {title}
      </div>

      {/* Nội dung: số từ và status */}
      <div className="py-3 w-full">
        <div className="flex items-center gap-1 font-bold text-[20px] text-gray-500 mb-2">
          <FileText size={20} />
          <span>{wordsCount} từ</span>
        </div>
        {statusElement}
      </div>

      {/* Nút cuối */}
      <button
        onClick={buttonHandler}
        className={`mt-auto px-4 py-1 w-full rounded bg-white text-blue-500 font-semibold hover:bg-blue-200 transition`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default UserSetCard;
