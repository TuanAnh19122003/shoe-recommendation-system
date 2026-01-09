import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const AdminListItem = ({ index, viewMode, onEdit, onDelete, children }) => {
    // === DẠNG LIST (TABLE ROW) ===
    if (viewMode === 'list') {
        return (
            <tr className="hover:bg-blue-50/30 transition-all group border-b border-gray-50 last:border-0">
                {/* Hiển thị số thứ tự (index + 1) */}
                <td className="px-6 py-4 font-bold text-gray-400 text-xs w-16">
                    {index + 1}
                </td>

                {children}

                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <Edit2 size={16} />
                        </button>
                        <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    // === DẠNG GRID (CARD) ===
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative group">
            {/* Hiển thị số thứ tự nhỏ ở góc Card (tùy chọn) */}
            <div className="absolute bottom-4 right-6 text-[10px] font-bold text-gray-200">
                #{index + 1}
            </div>

            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={onEdit} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <Edit2 size={14} />
                </button>
                <button onClick={onDelete} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                    <Trash2 size={14} />
                </button>
            </div>
            {children}
        </div>
    );
};

export default AdminListItem;