/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, ShoppingCart, Package, Users, LogOut,
    ChevronRight, ChevronDown, ShieldCheck, UserCircle, Layers, Box
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to, isChild = false }) => {
    const location = useLocation();
    // Kiểm tra active chính xác hoặc theo tiền tố đường dẫn
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center justify-between p-3 rounded-xl transition-all mb-1 ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
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

const SidebarGroup = ({ icon: Icon, label, children, activeUrls = [] }) => {
    const location = useLocation();
    // Group chỉ sáng "nhẹ" khi có con đang active
    const isAnyChildActive = activeUrls.some(url => location.pathname === url);
    const [isOpen, setIsOpen] = useState(isAnyChildActive);

    // Tự động mở group nếu truy cập trực tiếp từ URL
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

const AdminSidebar = () => {
    return (
        <aside className="w-64 bg-gray-950 h-screen flex flex-col sticky top-0 z-50 border-r border-gray-800">
            <div className="p-6">
                <div className="bg-blue-600/10 p-3 rounded-2xl border border-blue-600/20">
                    <h2 className="text-blue-500 font-black text-xl text-center tracking-tighter">SHOE ADMIN</h2>
                </div>
            </div>

            <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/admin" />

                {/* Quản lý Người dùng - Chỉ sáng khi url là /admin/users hoặc /admin/roles */}
                <SidebarGroup
                    icon={Users}
                    label="Quản lý Người dùng"
                    activeUrls={['/admin/users', '/admin/roles']}
                >
                    <SidebarItem icon={UserCircle} label="Tài khoản" to="/admin/users" isChild />
                    <SidebarItem icon={ShieldCheck} label="Phân quyền" to="/admin/roles" isChild />
                </SidebarGroup>

                {/* Quản lý Sản phẩm - Chỉ sáng khi url là /admin/products hoặc /admin/variants */}
                <SidebarGroup
                    icon={Package}
                    label="Quản lý Sản phẩm"
                    activeUrls={['/admin/products', '/admin/variants']}
                >
                    <SidebarItem icon={Box} label="Sản phẩm" to="/admin/products" isChild />
                    <SidebarItem icon={Layers} label="Biến thể (Variant)" to="/admin/variants" isChild />
                </SidebarGroup>

                <SidebarItem icon={ShoppingCart} label="Quản lý Đơn hàng" to="/admin/orders" />
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium group">
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;