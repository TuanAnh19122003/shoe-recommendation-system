import React from 'react';
import AdminListItem from '../../../components/layouts/admin/AdminListItem';

// Component tạo hiệu ứng ảo ảnh khi đang tải
const RoleSkeleton = ({ viewMode }) => (
    <>
        {[...Array(6)].map((_, i) => (
            viewMode === 'list' ? (
                <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                        <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                    </td>
                </tr>
            ) : (
                <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse"></div>
            )
        ))}
    </>
);

// 1. THÊM onView VÀO PROPS
const RoleList = ({ roles, onEdit, onDelete, onView, isLoading, viewMode = 'list' }) => {
    return (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}>
            {viewMode === 'list' ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4 w-16">STT</th>
                                <th className="px-6 py-4">Mã Role</th>
                                <th className="px-6 py-4">Tên hiển thị</th>
                                <th className="px-6 py-4">Cập nhật cuối</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? <RoleSkeleton viewMode="list" /> :
                                roles.map((role, index) => (
                                    <AdminListItem
                                        key={role.id}
                                        index={index}
                                        viewMode="list"
                                        onEdit={() => onEdit(role)}
                                        onDelete={() => onDelete(role.id)}
                                        onView={() => onView(role)}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                                                {role.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700">{role.name}</td>
                                        <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                                            {new Date(role.updatedAt).toLocaleDateString('vi-VN')}
                                        </td>
                                    </AdminListItem>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            ) : (
                /* GRID MODE */
                isLoading ? <RoleSkeleton viewMode="grid" /> :
                    roles.map((role, index) => (
                        <AdminListItem
                            key={role.id}
                            index={index}
                            viewMode="grid"
                            onEdit={() => onEdit(role)}
                            onDelete={() => onDelete(role.id)}
                            // 2. TRUYỀN XUỐNG ADMINLISTITEM
                            onView={() => onView(role)}
                        >
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                                        {role.code}
                                    </span>
                                </div>
                                <h3 className="text-lg font-black text-gray-800">{role.name}</h3>
                                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center text-gray-400 text-[11px]">
                                    <span>Cập nhật: {new Date(role.updatedAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        </AdminListItem>
                    ))
            )}
        </div>
    );
};

export default RoleList;