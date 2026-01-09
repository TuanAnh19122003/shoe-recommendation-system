/* eslint-disable no-unused-vars */
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Sửa: Đảm bảo destructuring đúng và sử dụng Icon trong JSX
const SidebarItem = ({ icon: Icon, label, to }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
        >
            <div className="flex items-center gap-3">
                {/* VIẾT THẾ NÀY: */}
                <Icon size={20} />
                <span className="font-medium">{label}</span>
            </div>
            {isActive && <ChevronRight size={16} />}
        </Link>
    );
};

const AdminSidebar = () => {
    return (
        <aside className="w-64 bg-gray-950 h-screen flex flex-col sticky top-0">
            <div className="p-6">
                <div className="bg-blue-600/10 p-3 rounded-2xl border border-blue-600/20">
                    <h2 className="text-blue-500 font-black text-xl text-center">ADMIN PANEL</h2>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/admin" />
                <SidebarItem icon={Package} label="Sản phẩm" to="/admin/products" />
                <SidebarItem icon={ShoppingCart} label="Đơn hàng" to="/admin/orders" />
                <SidebarItem icon={Users} label="Người dùng" to="/admin/users" />
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium">
                    <LogOut size={20} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;