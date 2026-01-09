import React, { useMemo } from 'react';
import { ShoppingBag, User, Search, Menu, Settings, LogOut, Package, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserHeader = () => {
    const navigate = useNavigate();

    // 1. Lấy thông tin user
    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            return null;
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
        window.location.reload(); // Reload để cập nhật trạng thái Header
    };

    const getInitials = (user) => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user?.email?.charAt(0).toUpperCase() || "U";
    };

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                        <ShoppingBag size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-gray-900">SHOE.STORE</span>
                </Link>

                {/* Navigation (Giữ gọn gàng) */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                    <Link to="/products" className="hover:text-blue-600 transition-colors">Sản phẩm</Link>
                    <Link to="/collections" className="hover:text-blue-600 transition-colors">Bộ sưu tập</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <Search size={20} />
                    </button>

                    <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full text-gray-600 relative">
                        <ShoppingBag size={20} />
                        <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
                    </Link>

                    {/* --- KHU VỰC USER & DROPDOWN --- */}
                    {user ? (
                        <div className="relative group py-2"> {/* group dùng để trigger hover */}
                            <button className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-50 rounded-full transition-all">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-blue-100">
                                    {user.image ? (
                                        <img src={`http://localhost:5000/${user.image}`} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        getInitials(user)
                                    )}
                                </div>
                                <span className="hidden sm:block text-sm font-semibold text-gray-700">
                                    {user.firstname && user.lastname
                                        ? `${user.lastname} ${user.firstname}`
                                        : "Tài khoản"}
                                </span>
                            </button>

                            {/* DROPDOWN MENU - Hiển thị khi hover vào group */}
                            <div className="absolute right-0 mt-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transition-all duration-300 z-50 overflow-hidden">
                                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                    <p className="text-xs text-gray-500 mb-1">Đăng nhập với</p>
                                    <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                                </div>

                                <div className="p-2">
                                    {/* Nút Admin chỉ hiện cho Quản trị viên */}
                                    {user.role?.code === 'admin' && (
                                        <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-colors">
                                            <Settings size={18} />
                                            Trang Quản trị
                                        </Link>
                                    )}

                                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                        <UserCircle size={18} />
                                        Hồ sơ cá nhân
                                    </Link>

                                    <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                        <Package size={18} />
                                        Đơn hàng của tôi
                                    </Link>
                                </div>

                                <div className="p-2 border-t border-gray-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                                    >
                                        <LogOut size={18} />
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/auth/login" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                            <User size={20} />
                        </Link>
                    )}

                    <button className="md:hidden p-2 text-gray-600">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;