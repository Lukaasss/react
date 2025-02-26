import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - 3);
        let endPage = Math.min(totalPages, startPage + 6);

        if (endPage - startPage < 6) {
            startPage = Math.max(1, endPage - 6);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <span
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`mx-1 px-3 py-1 cursor-pointer ${i === currentPage ? "font-bold" : ""}`}
                >
                    {i}
                </span>
            );
        }
        return pages;
    };

    return (
        <div className="text-center py-4 flex justify-center mt-auto">
            <span
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={`mx-1 px-3 py-1 cursor-pointer ${currentPage === 1 ? "invisible" : "visible"}`}
            >
                ←
            </span>
            {getPageNumbers()}
            <span
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={`mx-1 px-3 py-1 cursor-pointer ${currentPage === totalPages ? "invisible" : "visible"}`}
            >
                →
            </span>
        </div>
    );
};

export default Pagination;
