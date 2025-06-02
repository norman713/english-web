// src/components/VocabSetCard.tsx

import {
  Trash2,
  RefreshCw,
} from "lucide-react";
import React from "react";

interface VocabSetCardProps {
  id: string;
  title: string;
  wordsCount: number;
  version?: string;
  isDeleted?: boolean;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDetailClick?: (id: string) => void;
}

const AdminSetCard: React.FC<VocabSetCardProps> = ({
  id,
  title,
  wordsCount,
  version = "1.0",
  isDeleted = false,
  onDelete,
  onRestore,
  onDetailClick,
}) => {
  // Chọn lớp nền tùy vào isDeleted
  const cardBgClass = isDeleted ? "bg-red-100" : "bg-[#D0E7F6]";

  return (
    <div
      onClick={() => {
        if (!isDeleted && onDetailClick) {
          onDetailClick(id);
        }
      }}
      className={`
        relative flex flex-col h-full p-6 rounded-lg ${cardBgClass} shadow-sm 
        hover:shadow-md transition-all border border-gray-200 cursor-pointer
      `}
      style={{ minHeight: "250px", width: "300px" }}
    >
      {/* Nút Xóa hoặc Khôi phục góc trên phải */}
      <div className="flex justify-end">
        {isDeleted ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestore?.(id);
            }}
            className="text-green-700 hover:text-green-900"
            title="Khôi phục"
            aria-label="Restore vocab set"
          >
            <RefreshCw size={22} />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Bạn có chắc muốn xóa set này không?")) {
                onDelete?.(id);
              }
            }}
            className="text-black hover:text-red-800"
            title="Xóa bộ từ"
            aria-label="Delete vocab set"
          >
            <Trash2 size={22} />
          </button>
        )}
      </div>

      {/* Tiêu đề */}
      <div className="mt-2 mb-4">
        <h3
          className={`
            font-bold text-[25px] mb-2 text-gray-900
          `}
        >
          {title}
        </h3>
      </div>

      {/* Số từ */}
      <div
        className={`
          flex items-center gap-2 text-[20px] text-gray-500 mb-4 font-bold
        `}
      >
        <span>{wordsCount} từ</span>
      </div>

      {/* Phiên bản */}
      <div
        className={`
          flex items-center gap-2 text-[20px] text-gray-500 mb-4 font-bold
        `}
      >
        <span>Phiên bản: {version}.0</span>
      </div>

      {/* Nút Chi tiết */}
      {!isDeleted && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDetailClick?.(id);
          }}
          className="
            mt-auto bg-white text-blue-600 font-semibold py-2 rounded w-full hover:bg-blue-50 transition
          "
        >
          Chi tiết
        </button>
      )}
    </div>
  );
};

export default AdminSetCard;
