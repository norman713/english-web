import React from "react";
import { Trash2, RefreshCw } from "lucide-react";

interface AdminVocabTabProps {
  title: string;
  wordsCount: number;
  version?: string;
  isDeleted?: boolean;
  onDelete?: () => void;
  onRestore?: () => void;
  onDetailClick?: () => void;
}

const AdminVocabTab: React.FC<AdminVocabTabProps> = ({
  title,
  wordsCount,
  version = "1.0",
  isDeleted = false,
  onDelete,
  onRestore,
  onDetailClick,
}) => {
  return (
    <div
      className="bg-blue-100 rounded-xl p-4 w-[300px] relative flex flex-col shadow-md"
      style={{ minHeight: "180px" }}
    >
      <div className="flex justify-end pr-3">
        {" "}
        {/* Icon góc trên phải */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isDeleted) {
              onRestore && onRestore();
            } else {
              if (window.confirm("Bạn có chắc muốn xoá set này không?")) {
                onDelete && onDelete();
              }
            }
          }}
          className=" text-gray-600 hover:text-gray-900"
          title={isDeleted ? "Khôi phục bộ từ" : "Xoá bộ từ"}
          aria-label={isDeleted ? "Restore vocab set" : "Delete vocab set"}
        >
          {isDeleted ? <RefreshCw size={22} /> : <Trash2 size={22} />}
        </button>
      </div>

      {/* Nội dung chính */}
      <div
        onClick={() => {
          if (!isDeleted && onDetailClick) onDetailClick();
        }}
        className="cursor-pointer"
      >
        <h3 className="font-bold text-[25px] mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-[20px] text-gray-500 mb-4 font-bold">
          <span>{wordsCount} từ</span>
        </div>
        <div className="flex items-center gap-2 text-[20px] text-gray-500 mb-4 font-bold">
          Phiên bản: {version}
        </div>
      </div>

      {/* Nút chi tiết */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDetailClick && onDetailClick();
        }}
        className="mt-auto bg-white text-blue-600 font-semibold py-2 rounded w-full hover:bg-blue-50 transition"
      >
        Chi tiết
      </button>
    </div>
  );
};

export default AdminVocabTab;
