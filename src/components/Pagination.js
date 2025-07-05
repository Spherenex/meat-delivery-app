// src/components/Pagination.js
import React from 'react';
import '../styles/components/Pagination.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * Reusable pagination component
 * @param {number} currentPage - Current page number (1-based)
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Function to call when page changes
 * @param {number} siblingCount - Number of siblings on each side (default: 1)
 * @returns {JSX.Element} - Pagination component
 */
const Pagination = ({ currentPage, totalPages, onPageChange, siblingCount = 1 }) => {
  // Don't render pagination if only 1 page
  if (totalPages <= 1) return null;
  
  // Generate page numbers array
  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    
    // If total pages is less than total page numbers to show
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    // Don't show dots when there's just one page number to be inserted
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      // Show more numbers on the left
      const leftItemCount = 1 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      
      return [...leftRange, 'DOTS', totalPages];
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      // Show more numbers on the right
      const rightItemCount = 1 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      
      return [1, 'DOTS', ...rightRange];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      // Show dots on both sides
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      
      return [1, 'DOTS', ...middleRange, 'DOTS', totalPages];
    }
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="pagination">
      {/* Previous button */}
      <button
        className="pagination-button prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((pageNumber, index) => {
        if (pageNumber === 'DOTS') {
          return (
            <span key={`dots-${index}`} className="pagination-dots">
              ...
            </span>
          );
        }
        
        return (
          <button
            key={pageNumber}
            className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}
      
      {/* Next button */}
      <button
        className="pagination-button next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;