// src/components/VocabSetCard.tsx

import { Trash2, RefreshCw } from "lucide-react";
import React from "react";

interface VocabSetCardProps {
  id: string;
  title: string;
  wordsCount: number;
  version?: string;
  searchQuery?: string;
  isDeleted?: boolean;              // Nếu true thì hiện nút khôi phục
  onDelete?: (id: string) => void;  // Gọi khi nhấn nút xoá
  onRestore?: (id: string) => void; // Gọi khi nhấn nút khôi phục
  onDetailClick?: (id: string) => void; // Chuyển trang chi tiết
}

const VocabSetCard: React.FC<VocabSetCardProps> = ({
  id,
  title,
  wordsCount,
  version,
  searchQuery,
  isDeleted = false,
  onDelete,
  onRestore,
  onDetailClick,
}) => {
  // Highlight searchQuery nếu cần
  const highlightSearchQuery = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, idx) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={idx} className="bg-yellow-200 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      onClick={() => onDetailClick?.(id)}
      className={`relative flex flex-col h-full p-5 rounded-xl bg-[rgba(99,176,239,0.23)] shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-300 cursor-pointer ${
        wordsCount === 0 ? "pointer-events-none opacity-60" : ""
      }`}
    >
      {/* Nút Xoá hoặc Khôi phục góc trên phải */}
      {isDeleted ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Bạn có chắc muốn khôi phục set này không?")) {
              onRestore?.(id);
            }
          }}
          className="absolute top-2 right-2 text-green-700 hover:text-green-900"
        >
          <RefreshCw size={20} />
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Bạn có chắc muốn xoá set này không?")) {
              onDelete?.(id);
            }
          }}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        >
          <Trash2 size={20} />
        </button>
      )}

      {/* Tên set */}
      <h3 className="font-bold text-2xl mb-3 line-clamp-2 min-h-[3rem]">
        {highlightSearchQuery(title)}
      </h3>

      {/* Thông tin số từ & phiên bản */}
      <div className="flex items-center justify-between mb-1 min-h-15">
        <div className="flex items-center gap-2 text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
          <span className="flex items-center gap-1">
            {wordsCount} {wordsCount === 1 ? "từ" : "từ"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[16px] font-medium text-[rgba(0,0,0,0.50)]">
        <span>Phiên bản: {version ?? "1"}</span>
      </div>

      {/* Nút Chi tiết */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDetailClick?.(id);
        }}
        className="mt-4 py-2 bg-[#F8F7FF] text-blue-600 text-center text-sm font-semibold rounded hover:bg-blue-300 transition"
      >
        Chi tiết
      </button>
    </div>
  );
};

export default VocabSetCard;
