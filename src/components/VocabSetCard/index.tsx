// src/components/VocabSetCard.tsx

import {
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
} from "lucide-react";
import React from "react";

interface VocabSetCardProps {
  id: string;
  title: string;
  wordsCount: number;
  learnedWords?: number;
  isDeleted?: boolean;
  version?: string; // Chỉ dùng ở Admin
  searchQuery?: string;
  isAdmin?: boolean; // Quyền Admin (mặc định false)
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDetailClick?: (id: string) => void;
}

const VocabSetCard: React.FC<VocabSetCardProps> = ({
  id,
  title,
  wordsCount,
  version,
  learnedWords = 0,
  isDeleted = false,
  isAdmin = false,
  onDelete,
  onRestore,
  onDetailClick,
}) => {
  const isCompleted =
    !isDeleted && wordsCount > 0 && learnedWords >= wordsCount;

  // Background tùy theo isDeleted
  const cardBgClass = isDeleted ? "bg-red-100" : "bg-blue-100";

  // Dòng trạng thái “Đã bị xoá” hoặc “Đã hoàn thành”
  const renderStatusLine = () => {
    if (isDeleted) {
      return (
        <div className="flex items-center gap-2 mb-4 text-red-700">
          <XCircle size={18} />
          <span className="text-base font-medium">Đã bị xoá</span>
        </div>
      );
    }
    if (isCompleted) {
      return (
        <div className="flex items-center gap-2 mb-4 text-green-700">
          <CheckCircle2 size={18} />
          <span className="text-base font-medium">Đã hoàn thành</span>
        </div>
      );
    }
    return null;
  };

  // Nếu không phải Admin (user view), render 3 dòng + nút “Bắt đầu”
  if (!isAdmin) {
    return (
      <div
        onClick={() => onDetailClick?.(id)}
        className={`relative flex flex-col h-full p-6 rounded-lg ${cardBgClass} shadow-sm hover:shadow-md transition-all border border-gray-200 ${
          wordsCount === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
        }`}
        style={{ minHeight: "300px" }} // Tăng chiều cao cho user
      >
        {/* 1. Tên bộ từ */}
        <h3 className="font-bold text-[24px] mb-4 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* 2. Tổng số từ (icon file) */}
        <div className="flex items-center gap-2 text-[18px] text-gray-700 mb-4 font-medium">
          <FileText size={18} />
          <span>{wordsCount} từ</span>
        </div>

        {/* 3. Đã học (icon đồng hồ) */}
        <div className="flex items-center gap-2 text-[18px] text-gray-700 mb-4 font-medium">
          <Clock size={18} />
          <span>{wordsCount} đã học</span>
        </div>

        {/* 4. Nút Bắt đầu */}
        {!isDeleted && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetailClick?.(id);
            }}
            className="mt-auto py-3 w-full rounded bg-blue-700 text-white hover:bg-blue-800 transition font-medium"
          >
            Chi tiết
          </button>
        )}
      </div>
    );
  }

  // Nếu là Admin, render đầy đủ như trước
  if (isAdmin) {
    return (
      <div
        onClick={() => onDetailClick?.(id)}
        className={`relative flex flex-col h-full p-6 rounded-lg ${cardBgClass} shadow-sm hover:shadow-md transition-all border border-gray-200 ${
          wordsCount === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
        }`}
        style={{ minHeight: "350px" }}
      >
        {/* Nút Xoá hoặc Khôi phục góc trên phải */}
        {isDeleted ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestore?.(id);
            }}
            className="absolute top-4 right-4 text-green-700 hover:text-green-900"
            title="Khôi phục"
          >
            <RefreshCw size={22} />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Bạn có chắc muốn xoá set này không?")) {
                onDelete?.(id);
              }
            }}
            className="absolute top-4 right-4 text-red-600 hover:text-red-800"
            title="Xoá mềm"
          >
            <Trash2 size={22} />
          </button>
        )}

        {/* Tiêu đề */}
        <h3 className="font-bold text-[30px] mb-4 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Hiển thị số từ và phiên bản khi đã bị xóa */}
        {isDeleted ? (
          <>
            <div className="text-[20px] text-gray-500 mb-2 font-bold">
              {wordsCount} từ
            </div>
            {version && (
              <div className="text-[20px] text-gray-500 mb-4 font-bold">
                Phiên bản: {version}.0
              </div>
            )}
          </>
        ) : (
          <>
            {/* Hiển thị số từ đã học nếu chưa bị xóa */}
            <div className="flex items-center gap-2 text-[20px] text-gray-500 mb-4 font-bold">
              <span>
                {learnedWords} đã học / {wordsCount} từ
              </span>
            </div>
            {/* Hiển thị phiên bản nếu có */}
            {version && (
              <div className="flex items-center gap-2 text-[20px] text-gray-500 mb-4 font-bold">
                <span>Phiên bản: {version}.0</span>
              </div>
            )}
          </>
        )}

        {/* Dòng trạng thái */}
        {renderStatusLine()}

        {/* Nút Bắt đầu / Xem lại */}
        {!isDeleted && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetailClick?.(id);
            }}
            className={`mt-auto py-3 w-full rounded text-base font-medium transition ${
              isCompleted
                ? "bg-transparent text-green-700 hover:bg-green-100 border border-green-700"
                : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
          >
            {isCompleted ? "Xem lại" : "Chi tiết"}
          </button>
        )}
      </div>
    );
  }
};

export default VocabSetCard;
