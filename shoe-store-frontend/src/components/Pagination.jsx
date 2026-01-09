import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center gap-2 mt-10 pb-10">
            <button 
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm active:scale-95"
            >
                <ChevronLeft size={20} />
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-11 h-11 rounded-xl font-black text-xs transition-all active:scale-95 ${
                        currentPage === page 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                    }`}
                >
                    {page}
                </button>
            ))}

            <button 
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm active:scale-95"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;