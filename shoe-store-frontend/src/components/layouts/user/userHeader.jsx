import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserHeader = () => (
    <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                    <ShoppingBag size={20} />
                </div>
                <span className="text-xl font-bold tracking-tighter">SHOE.STORE</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                <Link to="/products" className="hover:text-blue-600">Sản phẩm</Link>
                <Link to="/collections" className="hover:text-blue-600">Bộ sưu tập</Link>
            </nav>

            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <Search size={20} />
                </button>
                <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full text-gray-600 relative">
                    <ShoppingBag size={20} />
                    <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
                </Link>
                <Link to="/login" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <User size={20} />
                </Link>
                <button className="md:hidden p-2 text-gray-600">
                    <Menu size={20} />
                </button>
            </div>
        </div>
    </header>
);

export default UserHeader;