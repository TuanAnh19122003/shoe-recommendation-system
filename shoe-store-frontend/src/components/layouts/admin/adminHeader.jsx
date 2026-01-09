import { Bell, Search, Menu, User } from 'lucide-react';

const AdminHeader = () => {
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
                        <p className="text-sm font-bold text-gray-800">Quản trị viên</p>
                        <p className="text-[11px] text-green-500 font-bold uppercase tracking-tighter">Online</p>
                    </div>
                    <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-100">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;