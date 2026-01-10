import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Home, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateCartCount } = useCart();

    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    const isSuccess = status === 'success';

    // Cập nhật lại số lượng giỏ hàng sau khi thanh toán thành công
    useEffect(() => {
        if (isSuccess) {
            updateCartCount();
        }
    }, [isSuccess, updateCartCount]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
            <div className="max-w-xl w-full bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center relative overflow-hidden">

                {/* Trang trí nền nhẹ nhàng */}
                <div className={`absolute top-0 left-0 w-full h-2 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`} />

                {isSuccess ? (
                    <div className="animate-in fade-in zoom-in duration-700">
                        <div className="flex justify-center mb-8">
                            <div className="bg-green-50 p-8 rounded-2rem border border-green-100">
                                <CheckCircle2 size={80} className="text-green-500 stroke-[1.5]" />
                            </div>
                        </div>

                        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-gray-900">
                            Thanh toán thành công!
                        </h1>

                        <div className="inline-block px-4 py-1.5 bg-blue-50 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
                            Mã đơn hàng: #{orderId}
                        </div>

                        <p className="text-gray-500 mb-10 text-lg leading-relaxed font-medium">
                            Cảm ơn bạn đã tin tưởng! Đơn hàng của bạn đã được xác nhận.
                            Chúng tôi sẽ sớm chuẩn bị "siêu phẩm" và giao đến bạn.
                        </p>
                    </div>
                ) : (
                    <div className="animate-in fade-in zoom-in duration-700">
                        <div className="flex justify-center mb-8">
                            <div className="bg-red-50 p-8 rounded-2rem border border-red-100">
                                <XCircle size={80} className="text-red-500 stroke-[1.5]" />
                            </div>
                        </div>

                        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-gray-900">
                            Giao dịch thất bại
                        </h1>

                        <p className="text-gray-500 mb-10 text-lg leading-relaxed font-medium">
                            Rất tiếc, quá trình thanh toán gặp sự cố hoặc đã bị hủy.
                            Vui lòng kiểm tra lại tài khoản hoặc thử lại nhé.
                        </p>
                    </div>
                )}

                {/* Nhóm nút bấm */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
                    >
                        <Home size={18} /> Về trang chủ
                    </button>

                    <button
                        onClick={() => navigate('/my-orders')}
                        className="w-full bg-white text-black border-2 border-gray-100 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <Package size={18} /> Xem đơn hàng của tôi <ArrowRight size={16} />
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        Hệ thống thanh toán bảo mật bởi VNPAY
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;