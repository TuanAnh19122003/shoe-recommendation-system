import React from 'react';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';
import AdminListItem from '../../../components/layouts/admin/AdminListItem';

const UserList = ({ users, isLoading, viewMode, currentPage, pageSize, onEdit, onDelete, onViewDetail }) => {
    return (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}>
            {viewMode === 'list' ? (
                <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80 text-gray-400 text-[10px] uppercase font-black tracking-[0.15em] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5 w-20 text-center">STT</th>
                                <th className="px-6 py-5">Thành viên</th>
                                <th className="px-6 py-5">Thông tin liên hệ</th>
                                <th className="px-6 py-5">Vai trò</th>
                                <th className="px-6 py-5 text-center">Trạng thái</th>
                                <th className="px-6 py-5 text-right w-40">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {!isLoading && users.map((user, index) => (
                                <AdminListItem
                                    key={user.id}
                                    index={(currentPage - 1) * pageSize + index}
                                    viewMode="list"
                                    onEdit={() => onEdit(user)}
                                    onDelete={() => onDelete(user.id)}
                                    onView={() => onViewDetail(user)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-gray-800 text-sm uppercase tracking-tight truncate max-w-37.5">
                                                {user.last_name} {user.first_name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                <Mail size={12} className="text-gray-300" /> {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                                <Phone size={12} className="text-gray-300" /> {user.phone || 'Chưa cập nhật'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                            <ShieldCheck size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">
                                                {user.role?.name || 'User'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${user.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                            {user.is_active ? 'Hoạt động' : 'Đã khóa'}
                                        </div>
                                    </td>
                                </AdminListItem>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* GIỮ NGUYÊN PHẦN GRID NHƯ TRƯỚC */
                users.map((user, index) => (
                    <AdminListItem
                        key={user.id}
                        index={(currentPage - 1) * pageSize + index}
                        viewMode="grid"
                        onEdit={() => onEdit(user)}
                        onDelete={() => onDelete(user.id)}
                        onView={() => onViewDetail(user)}
                    >
                        {/* ... Nội dung Grid giống như file cũ ... */}
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-5 pr-12"> 
                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-100 shrink-0">
                                    <div className="w-full h-full bg-white rounded-[0.85rem] overflow-hidden flex items-center justify-center text-blue-200">
                                        {user.image ? <img src={`http://localhost:5000/${user.image}`} className="w-full h-full object-cover" alt="" /> : <User size={24} />}
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-black text-gray-800 uppercase truncate leading-tight">{user.last_name} {user.first_name}</h3>
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{user.role?.name || 'User'}</span>
                                </div>
                            </div>
                            <div className="space-y-2 mt-auto">
                                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-500 truncate">
                                    <Mail size={14} className="text-blue-400 shrink-0" /> {user.email}
                                </div>
                                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-500">
                                    <Phone size={14} className="text-indigo-400 shrink-0" /> {user.phone || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </AdminListItem>
                ))
            )}
        </div>
    );
};

export default UserList;