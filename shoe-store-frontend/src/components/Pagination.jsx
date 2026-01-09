import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // XÓA HOẶC COMMENT DÒNG NÀY:
    // if (totalPages <= 1) return null; 

    return (
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-50">
            {/* Nút Previous */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2.5 rounded-xl transition-all hover:bg-gray-100 disabled:opacity-20 disabled:hover:bg-transparent text-gray-600"
            >
                <ChevronLeft size={20} strokeWidth={3} />
            </button>

            {/* Danh sách số trang */}
            <div className="flex items-center gap-2">
                {[...Array(totalPages || 1)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => onPageChange(i + 1)}
                        className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Nút Next */}
            <button
                disabled={currentPage === totalPages || totalPages <= 1}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2.5 rounded-xl transition-all hover:bg-gray-100 disabled:opacity-20 disabled:hover:bg-transparent text-gray-600"
            >
                <ChevronRight size={20} strokeWidth={3} />
            </button>
        </div>
    );
};

export default Pagination;