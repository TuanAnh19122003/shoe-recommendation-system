import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Heart, Search } from 'lucide-react';
import UserHeader from './userHeader';

const UserLayout = () => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Trang chủ', path: '/' },
        { icon: Search, label: 'Tìm kiếm', path: '/search' },
        { icon: ShoppingBag, label: 'Giỏ hàng', path: '/cart' },
        { icon: User, label: 'Tôi', path: '/profile' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header - Ẩn bớt các thành phần thừa trên Mobile */}
            <UserHeader />

            {/* Main Content */}
            <main className="flex-1 pb-20 md:pb-0">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation - Chỉ hiện trên màn hình < 768px */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1">
                            <Icon size={22} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                            <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer - Chỉ hiện trên Desktop */}
            <footer className="hidden md:block bg-gray-50 border-t py-12">
                <div className="max-w-7xl mx-auto px-8 text-center text-gray-500 text-sm">
                    <p>© 2026 SHOE STORE. Thiết kế bởi Shoe-Store.</p>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;