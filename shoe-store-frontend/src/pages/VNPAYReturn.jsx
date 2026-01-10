import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2, Package, ArrowRight, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast, { Toaster } from 'react-hot-toast';

const VNPAYReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateCartCount } = useCart();

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Đang xác thực giao dịch...');

    // Sử dụng useRef để đảm bảo API chỉ gọi đúng 1 lần (tránh React StrictMode gọi 2 lần)
    const hasCalledAPI = useRef(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const verifyPayment = async () => {
            if (hasCalledAPI.current) return;
            hasCalledAPI.current = true;

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setStatus('error');
                    setMessage('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
                    return;
                }

                // Gửi toàn bộ params về backend để verify chữ ký (vnp_SecureHash)
                const response = await axios.get(
                    `${API_URL}/orders/vnpay-return?${searchParams.toString()}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.success) {
                    setStatus('success');
                    setMessage(response.data.message || 'Thanh toán thành công! Cảm ơn bạn.');
                    updateCartCount(); // Làm mới số lượng giỏ hàng
                    toast.success("Thanh toán hoàn tất! ✨");
                } else {
                    setStatus('error');
                    setMessage(response.data.message || 'Giao dịch không thành công hoặc bị hủy.');
                }
            } catch (error) {
                console.error("VNPAY Error:", error);
                setStatus('error');
                setMessage(error.response?.data?.message || 'Không thể xác thực giao dịch này.');
            }
        };

        verifyPayment();
    }, [searchParams, updateCartCount, API_URL]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50/50 px-6">
            <Toaster position="top-center" />

            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 text-center relative overflow-hidden">

                {/* Trang trí nền */}
                <div className={`absolute top-0 left-0 w-full h-2 ${status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />

                {status === 'verifying' && (
                    <div className="space-y-6 py-4">
                        <div className="relative flex justify-center">
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">Đang xác thực</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-700">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle2 className="w-14 h-14 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-green-600">Tuyệt vời!</h2>
                            <p className="mt-3 text-slate-500 font-medium leading-relaxed px-2">{message}</p>
                        </div>

                        <div className="pt-6 flex flex-col gap-3">
                            <Link
                                to="/my-orders"
                                className="bg-slate-900 text-white py-4.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-95"
                            >
                                <Package size={20} /> Kiểm tra đơn hàng
                            </Link>
                            <Link
                                to="/"
                                className="flex items-center justify-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-900 transition-all py-2"
                            >
                                <Home size={16} /> Về trang chủ
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-700">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <XCircle className="w-14 h-14 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-red-600">Thanh toán lỗi</h2>
                            <p className="mt-3 text-slate-500 font-medium leading-relaxed px-2">{message}</p>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => navigate('/cart')}
                                className="w-full bg-red-600 text-white py-4.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-95"
                            >
                                Quay lại giỏ hàng <ArrowRight size={20} />
                            </button>
                            <p className="mt-4 text-xs text-slate-400 font-medium">
                                Nếu tiền đã bị trừ nhưng đơn hàng chưa cập nhật, vui lòng liên hệ hỗ trợ.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VNPAYReturn;