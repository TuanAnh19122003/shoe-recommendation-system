/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react';
import {
    ShoppingBag, User, Search, Menu, Settings,
    LogOut, Package, UserCircle, X, Home, ChevronRight
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../../context/CartContext'; // Đảm bảo đúng đường dẫn

const UserHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount, updateCartCount } = useCart(); // Lấy data từ Context
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Cập nhật lại số lượng mỗi khi chuyển trang để đảm bảo dữ liệu mới nhất
    useEffect(() => {
        updateCartCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const user = useMemo(() => {
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch (e) {
            return null;
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth/login');
        window.location.reload();
    };

    const getInitials = (user) => {
        if (user?.firstname && user?.lastname) {
            return `${user.lastname[0]}${user.firstname[0]}`.toUpperCase();
        }
        return user?.email?.charAt(0).toUpperCase() || "U";
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                        <Menu size={24} />
                    </button>

                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                            <ShoppingBag size={20} />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">
                            SHOE<span className="text-blue-600">.</span>STORE
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-500">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                        <Link to="/products" className="hover:text-blue-600 transition-colors">Sản phẩm</Link>
                        <Link to="/collections" className="hover:text-blue-600 transition-colors">Bộ sưu tập</Link>
                    </nav>

                    <div className="flex items-center gap-1 md:gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                            <Search size={20} />
                        </button>

                        <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full text-gray-600 relative">
                            <ShoppingBag size={22} />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="hidden md:block relative group py-2">
                            {user ? (
                                <>
                                    <button className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-50 rounded-full transition-all">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden border">
                                            {user.image ? (
                                                <img src={`http://localhost:5000/${user.image}`} alt="avatar" className="w-full h-full object-cover" />
                                            ) : getInitials(user)}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">
                                            {user.firstname ? `${user.lastname} ${user.firstname}` : "Tài khoản"}
                                        </span>
                                    </button>

                                    <div className="absolute right-0 mt-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transition-all duration-300 z-50 overflow-hidden">
                                        <div className="p-4 bg-gray-50/50 border-b border-gray-50">
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Đăng nhập với</p>
                                            <p className="text-sm font-bold truncate text-gray-800">{user.email}</p>
                                        </div>
                                        <div className="p-2">
                                            {user.role?.code === 'admin' && (
                                                <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-colors">
                                                    <Settings size={18} /> Quản trị hệ thống
                                                </Link>
                                            )}
                                            <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
                                                <UserCircle size={18} /> Hồ sơ cá nhân
                                            </Link>
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors">
                                                <LogOut size={18} /> Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link to="/auth/login" className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center">
                                    <User size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* SIDEBAR MOBILE */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-60 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={closeMenu} />

            <div className={`fixed top-0 left-0 bottom-0 w-70 bg-white z-70 transform transition-transform duration-500 ease-out shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center justify-between border-b">
                        <span className="font-black text-xl italic tracking-tighter text-blue-600">MENU</span>
                        <button onClick={closeMenu} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        <MobileNavLink to="/" icon={Home} label="Trang chủ" onClick={closeMenu} />
                        <MobileNavLink to="/products" icon={Package} label="Sản phẩm" onClick={closeMenu} />
                        <MobileNavLink to="/collections" icon={ShoppingBag} label="Bộ sưu tập" onClick={closeMenu} />

                        <div className="pt-6 pb-2 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cá nhân</div>
                        <MobileNavLink to="/profile" icon={UserCircle} label="Hồ sơ của tôi" onClick={closeMenu} />
                        <MobileNavLink to="/cart" icon={ShoppingBag} label={`Giỏ hàng (${cartCount})`} onClick={closeMenu} />

                        {user?.role?.code === 'admin' && (
                            <Link to="/admin" onClick={closeMenu} className="flex items-center justify-between px-4 py-4 rounded-2xl bg-blue-50 text-blue-700 font-bold mt-4">
                                <div className="flex items-center gap-4">
                                    <Settings size={20} />
                                    <span className="text-sm uppercase italic">Quản trị Admin</span>
                                </div>
                                <ChevronRight size={16} />
                            </Link>
                        )}
                    </div>

                    <div className="p-6 border-t bg-gray-50">
                        {user ? (
                            <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                                <LogOut size={18} /> Đăng xuất
                            </button>
                        ) : (
                            <Link to="/auth/login" onClick={closeMenu} className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                                <User size={18} /> Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const MobileNavLink = ({ to, icon: Icon, label, onClick }) => (
    <Link to={to} onClick={onClick} className="flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-gray-50 group transition-all">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all text-gray-500 group-hover:text-blue-600">
                <Icon size={20} />
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 uppercase tracking-tight">{label}</span>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
    </Link>
);

export default UserHeader;