import React from 'react';
import AdminListItem from '../../../components/layouts/admin/AdminListItem';

const RoleSkeleton = ({ viewMode }) => (
    <>
        {[...Array(6)].map((_, i) => (
            viewMode === 'list' ? (
                <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6">
                        <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                    </td>
                </tr>
            ) : (
                <div key={i} className="h-48 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>
            )
        ))}
    </>
);

const RoleList = ({
    roles,
    onEdit,
    onDelete,
    onView,
    isLoading,
    viewMode = 'list',
    currentPage = 1, // Thêm để tính STT chuẩn
    itemsPerPage = 6
}) => {
    return (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}>
            {viewMode === 'list' ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-50">
                            <tr>
                                <th className="px-8 py-6 w-20 text-center">No.</th>
                                <th className="px-6 py-6">Mã Role</th>
                                <th className="px-6 py-6">Tên hiển thị</th>
                                <th className="px-6 py-6">Cập nhật cuối</th>
                                <th className="px-8 py-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? <RoleSkeleton viewMode="list" /> :
                                roles.map((role, index) => {
                                    // Tính STT: (Trang hiện tại - 1) * Số item mỗi trang + index + 1
                                    const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;

                                    return (
                                        <AdminListItem
                                            key={role.id}
                                            viewMode="list"
                                            onEdit={() => onEdit(role)}
                                            onDelete={() => onDelete(role.id)}
                                            onView={() => onView(role)}
                                        >
                                            {/* Cột STT truyền từ ngoài vào */}
                                            <td className="px-8 py-5 text-center font-black text-gray-300 text-[11px]">
                                                {displayIndex.toString().padStart(2, '0')}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                                                    {role.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 font-black text-gray-800 text-sm">{role.name}</td>
                                            <td className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                                                {new Date(role.updatedAt).toLocaleDateString('vi-VN')}
                                            </td>
                                        </AdminListItem>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            ) : (
                /* GRID MODE */
                isLoading ? <RoleSkeleton viewMode="grid" /> :
                    roles.map((role, index) => {
                        const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;

                        return (
                            <AdminListItem
                                key={role.id}
                                viewMode="grid"
                                onEdit={() => onEdit(role)}
                                onDelete={() => onDelete(role.id)}
                                onView={() => onView(role)}
                            >
                                {/* Số thứ tự chìm trong Grid Mode */}
                                <div className="absolute -bottom-2 -left-2 text-6xl font-black text-gray-50 pointer-events-none select-none italic">
                                    {displayIndex}
                                </div>

                                <div className="flex flex-col space-y-2 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                                            {role.code}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">{role.name}</h3>
                                    <div className="pt-4 mt-4 border-t border-gray-50 flex items-center text-gray-400 text-[11px] font-bold">
                                        <span>CẬP NHẬT: {new Date(role.updatedAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            </AdminListItem>
                        );
                    })
            )}
        </div>
    );
};

export default RoleList;