import React from 'react';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';
import AdminListItem from '../../../components/layouts/admin/AdminListItem';

// 1. COMPONENT SKELETON (HIỆU ỨNG TẢI DỮ LIỆU)
const UserSkeleton = ({ viewMode }) => (
    <>
        {[...Array(6)].map((_, i) => (
            viewMode === 'list' ? (
                <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6">
                        <div className="h-12 bg-gray-100 rounded-2xl w-full"></div>
                    </td>
                </tr>
            ) : (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 animate-pulse h-60 flex flex-col">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-100 rounded-lg w-3/4"></div>
                            <div className="h-3 bg-gray-50 rounded-lg w-1/3"></div>
                        </div>
                    </div>
                    <div className="space-y-3 mt-auto">
                        <div className="h-10 bg-gray-50 rounded-xl w-full border border-gray-100"></div>
                        <div className="h-10 bg-gray-50 rounded-xl w-full border border-gray-100"></div>
                    </div>
                </div>
            )
        ))}
    </>
);

const UserList = ({
    users = [],
    isLoading,
    viewMode,
    currentPage = 1,
    pageSize = 6,
    onEdit,
    onDelete,
    onViewDetail
}) => {

    // 2. XỬ LÝ TRẠNG THÁI ĐANG TẢI (LOADING)
    if (isLoading) {
        return (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}>
                {viewMode === 'list' ? (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <tbody>
                                <UserSkeleton viewMode="list" />
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <UserSkeleton viewMode="grid" />
                )}
            </div>
        );
    }

    // 3. XỬ LÝ TRẠNG THÁI TRỐNG (EMPTY)
    if (!users || users.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-gray-200" />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Không tìm thấy thành viên nào</p>
            </div>
        );
    }

    // 4. RENDER DỮ LIỆU THẬT
    return (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "animate-in fade-in duration-500"}>
            {viewMode === 'list' ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-50">
                            <tr>
                                <th className="px-8 py-6 w-20 text-center">No.</th>
                                <th className="px-6 py-6">Thành viên</th>
                                <th className="px-6 py-6">Thông tin liên hệ</th>
                                <th className="px-6 py-6">Vai trò</th>
                                <th className="px-6 py-6 text-center">Trạng thái</th>
                                <th className="px-8 py-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user, index) => {
                                // Tính toán Index an toàn để tránh NaN
                                const displayIndex = (Number(currentPage) - 1) * Number(pageSize) + index + 1;
                                return (
                                    <AdminListItem
                                        key={user.id}
                                        viewMode="list"
                                        onEdit={() => onEdit(user)}
                                        onDelete={() => onDelete(user.id)}
                                        onView={() => onViewDetail(user)}
                                    >
                                        <td className="px-8 py-5 text-center font-black text-gray-300 text-[11px]">
                                            {displayIndex.toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-black text-gray-800 text-sm uppercase tracking-tight">
                                                {user.last_name} {user.first_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                                    <Mail size={12} className="text-blue-400" /> {user.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                    <Phone size={12} className="text-indigo-400" /> {user.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                                <ShieldCheck size={12} />
                                                <span className="text-[10px] font-black uppercase tracking-wider">
                                                    {user.role?.name || 'User'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${user.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                                {user.is_active ? 'Hoạt động' : 'Đã khóa'}
                                            </div>
                                        </td>
                                    </AdminListItem>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* GRID MODE */
                users.map((user, index) => {
                    const displayIndex = (Number(currentPage) - 1) * Number(pageSize) + index + 1;
                    return (
                        <AdminListItem
                            key={user.id}
                            viewMode="grid"
                            onEdit={() => onEdit(user)}
                            onDelete={() => onDelete(user.id)}
                            onView={() => onViewDetail(user)}
                        >
                            <div className="absolute -bottom-2 -left-2 text-6xl font-black text-gray-50 pointer-events-none select-none italic group-hover:text-blue-50 transition-colors">
                                {displayIndex}
                            </div>

                            <div className="flex flex-col h-full relative z-10">
                                <div className="flex items-center gap-4 mb-5 pr-12">
                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-100 shrink-0">
                                        <div className="w-full h-full bg-white rounded-[0.85rem] overflow-hidden flex items-center justify-center text-blue-200">
                                            {user.image ? (
                                                <img src={`http://localhost:5000/${user.image}`} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <User size={24} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-black text-gray-800 uppercase truncate leading-tight">
                                            {user.last_name} {user.first_name}
                                        </h3>
                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                                            {user.role?.name || 'User'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-auto">
                                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-500 truncate">
                                        <Mail size={14} className="text-blue-400 shrink-0" /> {user.email}
                                    </div>
                                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                                        <Phone size={14} className="text-indigo-400 shrink-0" /> {user.phone || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </AdminListItem>
                    )
                })
            )}
        </div>
    );
};

export default UserList;