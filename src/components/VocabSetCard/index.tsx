import { useNavigate } from "react-router-dom";

interface VocabSetCardProps {
  id?: string;
  title: string;
  wordsCount: number;
  searchQuery?: string;
  className?: string;
}

const VocabSetCard = ({
  id,
  title,
  wordsCount,
  searchQuery,
  className = "",
}: VocabSetCardProps) => {
  const navigate = useNavigate();

  const highlightSearchQuery = (text: string) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleStartLearning = () => {
    if ( id) {
      navigate(`/user/learn/${id}`);
    }
  };

  return (
    <div
      onClick={handleStartLearning}
      className={`flex flex-col h-full p-5 rounded-xl bg-[rgba(99,176,239,0.23)] shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-300 cursor-pointer ${className} ${
        wordsCount === 0 ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <h3 className="font-bold text-2xl mb-3 line-clamp-2 min-h-[3rem]">
        {highlightSearchQuery(title)}
      </h3>

      <div className="flex items-center justify-between mb-4 min-h-15 ">
        <div className="flex items-center gap-2 text-[20px] font-bold text-[rgba(0,0,0,0.50)]">
          <span className="text-blue-500">📖</span>
          <span className="font-medium">
            {wordsCount} {wordsCount === 1 ? "từ" : "từ"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VocabSetCard;
