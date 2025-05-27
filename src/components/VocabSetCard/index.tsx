// src/components/VocabSetCard.tsx
import { Trash2 } from "lucide-react";

interface VocabSetCardProps {
  id: string;
  title: string;
  wordsCount: number;
  searchQuery?: string;
  className?: string;
  version?: string; // Thêm prop version nếu cần
  onDelete?: (id: string) => void;
  onDetailClick?: (id: string) => void; // 👈 thêm prop cho nút Chi tiết

}

const VocabSetCard = ({
  id,
  title,
  wordsCount,
  version,
  searchQuery,
  className = "",
  onDelete,
  onDetailClick,

  
}: VocabSetCardProps) => {

  const highlightSearchQuery = (text: string) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-yellow-100 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };



  return (
    <div
      className={`relative flex flex-col h-full p-5 rounded-xl bg-[rgba(99,176,239,0.23)] shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-300 cursor-pointer ${className} ${
        wordsCount === 0 ? "pointer-events-none opacity-60" : ""
      }`}
    >
      {/* Nút xoá góc trên phải */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // không trigger navigate
            if (confirm("Bạn có chắc chắn muốn xoá set này không?")) {
              onDelete(id);
            }
          }}
          className="absolute top-2 right-2 text-black hover:text-white"
        >
          <Trash2 size={20} />
        </button>
      )}

      <h3 className="font-bold text-2xl mb-3 line-clamp-2 min-h-[3rem]">
        {highlightSearchQuery(title)}
      </h3>

      <div className="flex items-center justify-between mb-4 min-h-10">
        <div className="flex items-center gap-2 text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
          <span className="flex items-center gap-1">
            {wordsCount} từ
          </span> 
        </div>  
      </div>
       <div className="flex items-center gap-2 text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
            <span>Phiên bản: {version ?? "1"}</span>
        </div>
       <button
        onClick={() => onDetailClick?.(id)} // 👈 dùng prop truyền vào
        className="mt-4 py-2 bg-[#F8F7FF] text-blue-600 text-center text-xl font-bold rounded hover:bg-blue-300 transition"
      >
        Chi tiết
      </button>
    </div>
  );
};

export default VocabSetCard;
