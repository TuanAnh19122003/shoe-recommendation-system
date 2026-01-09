/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, ShoppingCart, Package, Users, LogOut,
    ChevronRight, ChevronDown, ShieldCheck, UserCircle, Layers, Box,
    Store // Chỉ import các icon thực sự từ thư viện
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// 1. Thành phần SidebarItem (Tự định nghĩa)
const SidebarItem = ({ icon: Icon, label, to, isChild = false, variant = "default" }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    const activeStyles = variant === "store"
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
        : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20';

    return (
        <Link
            to={to}
            className={`flex items-center justify-between p-3 rounded-xl transition-all mb-1 ${isActive
                ? activeStyles
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                } ${isChild ? 'ml-9 py-2 text-sm' : ''}`}
        >
            <div className="flex items-center gap-3">
                <Icon size={isChild ? 18 : 20} />
                <span className="font-medium">{label}</span>
            </div>
            {!isChild && isActive && <ChevronRight size={16} />}
        </Link>
    );
};

// 2. Thành phần SidebarGroup (Tự định nghĩa - Đây là lý do gây lỗi nếu bạn import từ thư viện)
const SidebarGroup = ({ icon: Icon, label, children, activeUrls = [] }) => {
    const location = useLocation();
    const isAnyChildActive = activeUrls.some(url => location.pathname === url);
    const [isOpen, setIsOpen] = useState(isAnyChildActive);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (isAnyChildActive) setIsOpen(true);
    }, [isAnyChildActive]);

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isAnyChildActive ? 'text-blue-400 bg-blue-600/5' : 'text-gray-400 hover:bg-gray-800/50'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="mt-1 transition-all animate-in slide-in-from-top-2 duration-300">
                    {children}
                </div>
            )}
        </div>
    );
};

// 3. Thành phần chính AdminSidebar
const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/auth/login');
        }
    };

    return (
        <aside className="w-64 bg-gray-950 h-screen flex flex-col sticky top-0 z-50 border-r border-gray-800">
            <div className="p-6">
                <Link to="/admin" className="block group">
                    <div className="bg-blue-600/10 p-3 rounded-2xl border border-blue-600/20 group-hover:bg-blue-600/20 group-hover:border-blue-600/30 transition-all duration-300">
                        <h2 className="text-blue-500 font-black text-xl text-center tracking-tighter group-hover:scale-105 transition-transform">
                            SHOE ADMIN
                        </h2>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
                {/* Mục quay lại trang chủ */}
                <div className="mb-6">
                    <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">Hệ thống</p>
                    <SidebarItem
                        icon={Store}
                        label="Xem cửa hàng"
                        to="/"
                        variant="store"
                    />
                </div>

                <div className="mb-4">
                    <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">Quản lý chính</p>
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/admin" />

                    <SidebarGroup
                        icon={Users}
                        label="Người dùng"
                        activeUrls={['/admin/users', '/admin/roles']}
                    >
                        <SidebarItem icon={UserCircle} label="Tài khoản" to="users" isChild />
                        <SidebarItem icon={ShieldCheck} label="Phân quyền" to="roles" isChild />
                    </SidebarGroup>

                    <SidebarGroup
                        icon={Package}
                        label="Sản phẩm"
                        activeUrls={['/admin/products', '/admin/variants']}
                    >
                        <SidebarItem icon={Box} label="Danh sách" to="products" isChild />
                        <SidebarItem icon={Layers} label="Biến thể" to="variants" isChild />
                    </SidebarGroup>

                    <SidebarItem icon={ShoppingCart} label="Đơn hàng" to="orders" />
                </div>
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;