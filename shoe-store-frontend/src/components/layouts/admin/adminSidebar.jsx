/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, LogOut, 
  ChevronRight, ChevronDown, ShieldCheck, UserCircle, Layers, Box
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to, isChild = false }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center justify-between p-3 rounded-xl transition-all mb-1 ${
                isActive
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

const SidebarGroup = ({ icon: Icon, label, children, activePathPrefix }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(location.pathname.startsWith(activePathPrefix));

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    location.pathname.startsWith(activePathPrefix) ? 'text-blue-400 bg-blue-600/5' : 'text-gray-400 hover:bg-gray-800/50'
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

                {/* Quản lý Người dùng */}
                <SidebarGroup icon={Users} label="Quản lý Người dùng" activePathPrefix="/">
                    <SidebarItem icon={UserCircle} label="Tài khoản" to="users" isChild />
                    <SidebarItem icon={ShieldCheck} label="Phân quyền" to="roles" isChild />
                </SidebarGroup>

                {/* Quản lý Sản phẩm */}
                <SidebarGroup icon={Package} label="Quản lý Sản phẩm" activePathPrefix="/admin/products">
                    <SidebarItem icon={Box} label="Sản phẩm" to="/admin/products/list" isChild />
                    <SidebarItem icon={Layers} label="Biến thể (Variant)" to="/admin/products/variants" isChild />
                </SidebarGroup>

                {/* Quản lý Đơn hàng */}
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