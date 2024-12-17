import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div style={{ margin: "20px 0" }}>
      <button
        className="pagination"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span style={{ margin: "0 10px" }}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="pagination"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
