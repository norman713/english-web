import React from "react";
import { FileText, XCircle, CheckCircle2, Clock, Heart } from "lucide-react";

interface UserVocabTabProps {
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

const UserVocabTab: React.FC<UserVocabTabProps> = ({
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
  let bgColor = "bg-[#D0E7F6]";
  let statusElement = null;
  let buttonText = "Chi tiết";
  let buttonHandler = onDetailClick;

  if (isDeleted) {
    bgColor = "bg-red-300";
    statusElement = (
      <div className="flex items-center gap-1 text-red-700 font-semibold mb-2">
        <XCircle size={16} />
        Đã bị xoá
      </div>
    );
    buttonText = "Bắt đầu";
    buttonHandler = onDetailClick;
  } else if (isCompleted) {
    bgColor = "bg-[#D0E7F6]";
    statusElement = (
      <div className="flex items-center gap-1 text-green-500 font-semibold mb-2">
        <CheckCircle2 size={16} />
        Đã hoàn thành
      </div>
    );
    buttonText = "Xem lại";
    buttonHandler = onDetailClick;
  } else if (learnedWords > 0) {
    bgColor = "bg-[#D0E7F6]";
    statusElement = (
      <div className="flex items-center gap-1 text-gray-700 font-semibold mb-2">
        <Clock size={16} />
        Đã học: {learnedWords}
      </div>
    );
    buttonText = "Học tiếp";
    buttonHandler = onStartLearning;
  } else if (!isFavorited) {
    bgColor = "bg-blue-100";
    buttonText = "Chi tiết";
    buttonHandler = onDetailClick;
  }

  return (
    <div
      className={`${bgColor} rounded-lg p-4 w-[250px] flex flex-col items-center shadow-md relative`}
    >
      {/* Icon trái tim hàng đầu */}
      <div className="w-full flex justify-end mb-2">
        {onAddFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddFavorite();
            }}
            className={`mb-2 cursor-pointer transition-colors ${
              isFavorited ? "text-red-600" : "text-gray-400 hover:text-red-600"
            }`}
            title={isFavorited ? "Đã yêu thích" : "Thêm vào yêu thích"}
            aria-label="Toggle favorite"
          >
            <Heart size={28} />
          </button>
        )}
      </div>

      {/* Tiêu đề hàng 2 */}
      <div className="font-bold text-[20px] mb-4 leading-snug text-start w-full">
        {title}
      </div>

      {/* Nội dung còn lại */}
      <div className="py-3 w-full">
        <div className="flex items-center gap-1 text-gray-700 mb-2">
          <FileText size={16} />
          <span>{wordsCount} từ</span>
        </div>
        {statusElement}
      </div>

      <button
        onClick={buttonHandler}
        className="mt-auto px-4 py-1 w-full rounded bg-white text-blue-500 font-semibold hover:bg-blue-200 transition"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default UserVocabTab;
