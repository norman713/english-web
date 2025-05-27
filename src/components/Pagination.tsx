import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  totalItems: number; // Tổng số item
  itemsPerPage: number; // Bao nhiêu item mỗi trang
  currentPage: number; // Trang hiện tại
  onPageChange: (page: number) => void;
  siblingCount?: number; // Số nút hiển thị bên cạnh
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  siblingCount = 1,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const DOTS = "...";

  const getPaginationRange = () => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 3 + siblingCount * 2);
      return [...leftRange, DOTS, totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - (2 + siblingCount * 2), totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  };

  const paginationRange = getPaginationRange();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6 text-sm">
      {/* Prev button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-[#0F294D] disabled:opacity-30"
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Page numbers */}
      {paginationRange?.map((page, index) => {
        if (page === DOTS) {
          return (
            <span key={index} className="text-[#3A6D8C] px-2">
              ...
            </span>
          );
        }

        return (
          <button
            key={index}
            className={`w-8 h-8 rounded text-sm font-medium ${
              page === currentPage
                ? "bg-[#2F6583] text-white"
                : "text-[#0F294D] hover:bg-gray-200"
            }`}
            onClick={() => onPageChange(Number(page))}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-[#0F294D] disabled:opacity-30"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
