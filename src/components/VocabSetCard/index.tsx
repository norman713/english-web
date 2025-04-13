import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

interface VocabSetCardProps {
  id?: string;  // Added optional ID for navigation
  title: string;
  wordsCount: number;
  searchQuery?: string;
  className?: string;  // Added for custom styling
}

const VocabSetCard = ({
  id,
  title,
  wordsCount,
  searchQuery,
  className = ""
}: VocabSetCardProps) => {
  const navigate = useNavigate();

  // Highlight search query matches in title
  const highlightSearchQuery = (text: string) => {
    if (!searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.split(regex).map((part, index) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 px-1 rounded">{part}</span>
      ) : (
        part
      )
    );
  };

  const handleStartLearning = () => {
    if (wordsCount > 0 && id) {
      navigate(`/user/learn/${id}`); // Update this path according to your routing
    }
  };

  return (
    <div className={`flex flex-col h-full p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-300 ${className}`}>
      {/* Title with search highlighting */}
      <h3 className="font-bold text-xl mb-3 line-clamp-2 min-h-[3rem]">
        {highlightSearchQuery(title)}
      </h3>
      
      {/* Words count and status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-blue-500">📖</span>
          <span className="font-medium">
            {wordsCount} {wordsCount === 1 ? 'từ' : 'từ vựng'}
          </span>
        </div>
        
        {wordsCount > 0 && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
            Có thể học
          </span>
        )}
      </div>

      {/* Action button */}
      <button 
        onClick={handleStartLearning}
        disabled={wordsCount === 0}
        className={`mt-auto w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          wordsCount > 0 
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {wordsCount > 0 ? (
          <>
            <Play size={16} />
            <span>Bắt đầu học</span>
          </>
        ) : (
          'Chưa có từ vựng'
        )}
      </button>
    </div>
  );
};

export default VocabSetCard;