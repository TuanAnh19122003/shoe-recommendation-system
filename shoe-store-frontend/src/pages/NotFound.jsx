import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {/* Minh họa số 404 với hiệu ứng hoạt họa */}
                <div className="relative inline-block">
                    <h1 className="text-[150px] font-black text-gray-200 select-none leading-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center animate-bounce">
                        <Ghost size={80} className="text-blue-600 drop-shadow-2xl" />
                    </div>
                </div>

                {/* Nội dung thông báo */}
                <h2 className="text-3xl font-bold text-gray-800 mt-8">
                    Ối! Lạc đường rồi...
                </h2>
                <p className="text-gray-500 mt-4 font-medium">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang một địa chỉ khác.
                </p>

                {/* Các nút điều hướng */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 hover:shadow-sm transition-all active:scale-95"
                    >
                        <ArrowLeft size={20} />
                        Quay lại
                    </button>

                    <Link
                        to="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                    >
                        <Home size={20} />
                        Về trang chủ
                    </Link>
                </div>

                {/* Gợi ý thêm */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-400">
                        Bạn nghĩ đây là một lỗi của hệ thống? <br />
                        Hãy <span className="text-blue-500 font-bold cursor-pointer hover:underline">liên hệ với chúng tôi</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;