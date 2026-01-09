import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './adminSidebar';
import AdminHeader from './adminHeader';
import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F1F5F9]">
            {/* Overlay cho Mobile khi mở Sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar - Responsive: Ẩn trên Mobile, hiện cố định trên Desktop */}
            <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <AdminSidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header Admin với nút Toggle Sidebar cho Mobile */}
                <header className="h-16 bg-white border-b px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-600"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h2 className="font-bold text-gray-800 hidden sm:block">Hệ thống quản lý</h2>
                    </div>
                    <AdminHeader />
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;