import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';

const AdminListItem = ({ viewMode, onEdit, onDelete, onView, children }) => {
    // === DẠNG LIST (TABLE ROW) ===
    if (viewMode === 'list') {
        return (
            <tr className="hover:bg-blue-50/30 transition-all group border-b border-gray-50 last:border-0">
                {children}

                <td className="px-8 py-4 text-right">
                    {/* Đã loại bỏ opacity-0 để luôn hiển thị */}
                    <div className="flex justify-end gap-1.5 transition-opacity duration-200">
                        <button
                            onClick={onView}
                            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                            title="Xem chi tiết"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={onEdit}
                            className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all active:scale-90"
                            title="Chỉnh sửa"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-all active:scale-90"
                            title="Xóa"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    // === DẠNG GRID (CARD) ===
    return (
        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
            {/* Nếu bạn muốn hiện luôn cả ở dạng Grid, hãy xóa opacity-0 ở đây tương tự */}
            <div className="absolute top-4 right-4 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={(e) => { e.stopPropagation(); onView(); }}
                    className="p-2.5 bg-white/90 backdrop-blur-md text-gray-500 rounded-xl shadow-sm border border-gray-100 hover:text-blue-600 transition-all"
                >
                    <Eye size={14} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all"
                >
                    <Edit2 size={14} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-2.5 bg-red-500 text-white rounded-xl shadow-md hover:bg-red-600 transition-all"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="relative z-0 h-full">
                {children}
            </div>
        </div>
    );
};

export default AdminListItem;