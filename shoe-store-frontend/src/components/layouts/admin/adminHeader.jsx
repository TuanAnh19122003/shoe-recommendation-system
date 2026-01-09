import React, { useMemo } from 'react';
import { Bell, Search, User } from 'lucide-react';

const AdminHeader = () => {
    // 1. Lấy thông tin user từ localStorage
    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            return null;
        }
    }, []);

    // 2. Hàm tạo chữ viết tắt từ tên (Ví dụ: "Hào Nguyễn" -> "HN")
    const getInitials = (user) => {
        if (!user) return "?";
        if (user.first_name && user.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user.email?.charAt(0).toUpperCase() || "U";
    };

    return (
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shadow-sm sticky top-0 z-40">
            {/* Search Bar */}
            <div className="relative w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Tìm kiếm nhanh dữ liệu..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            <div className="flex items-center gap-5">
                {/* Notifications */}
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* User Profile Info */}
                <div className="flex items-center gap-3 pl-5 border-l border-gray-200">
                    <div className="hidden sm:block text-right">
                        {/* Hiển thị tên đầy đủ hoặc Email nếu không có tên */}
                        <p className="text-sm font-bold text-gray-800 leading-none">
                            {user?.first_name && user?.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user?.email || "Khách"}
                        </p>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">
                            {user?.role?.name || "Thành viên"}
                        </p>
                    </div>

                    {/* Avatar Logic */}
                    <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-100 overflow-hidden border border-blue-100">
                        {user?.image ? (
                            <img
                                src={`http://localhost:5000/${user.image}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                // Nếu link ảnh die, render lại chữ viết tắt
                                onError={(e) => {
                                    e.target.onerror = null; // Ngăn loop vô hạn
                                    e.target.parentElement.innerHTML = `<span class="font-bold text-sm tracking-tighter">${getInitials(user)}</span>`;
                                }}
                            />
                        ) : (
                            <span className="font-bold text-sm tracking-tighter">
                                {getInitials(user)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;