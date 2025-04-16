import { useEffect, useState } from "react";

import VocabSetCard from "../../../../components/VocabSetCard";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface VocabularySet {
  id?: string | undefined;
  name: string;
  wordCount?: number | undefined;
  // Remove status and progress as they should come from backend or be calculated separately
}

const MyList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vocabList, setVocabList] = useState<VocabularySet[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 8;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const { data, totalPages } = await getVocabularySets(currentPage - 1, pageSize);
  //       setVocabList(data || []);
  //       setTotalPages(totalPages || 1);
  //     } catch (err) {
  //       console.error("Error fetching vocabulary sets:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [currentPage]);

  const filteredVocabList = vocabList.filter((vocab) =>
    vocab.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                My Vocabulary Sets
              </h1>
              <p className="text-gray-600">
                Manage your vocabulary collections
              </p>
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlass size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search sets..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          {filteredVocabList.length > 0 ? (
            <p className="text-sm text-gray-600">
              Showing {filteredVocabList.length} set
              {filteredVocabList.length !== 1 ? "s" : ""}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              {isLoading ? "Loading..." : "No sets found"}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* Vocabulary Sets Grid */}
        <div className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-100 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : filteredVocabList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVocabList.map((vocab) => (
                <VocabSetCard
                  key={vocab.id || vocab.name} // Fallback to name if id is undefined
                  title={vocab.name}
                  wordsCount={vocab.wordCount ?? 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MagnifyingGlass size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">
                No vocabulary sets found
              </h3>
              <p className="mt-1 text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "Create some sets to get started"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-center">
            <nav className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
