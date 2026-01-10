import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const VNPAYReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateCartCount } = useCart();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Đang xác thực giao dịch...');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const token = localStorage.getItem('token');
                // Gửi toàn bộ query string từ VNPAY về Backend để check chữ ký
                const response = await axios.get(
                    `http://localhost:5000/api/orders/vnpay-return?${searchParams.toString()}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.success) {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
                    updateCartCount(); // Cập nhật lại số lượng giỏ hàng vì đã thanh toán xong
                } else {
                    setStatus('error');
                    setMessage(response.data.message || 'Thanh toán không thành công.');
                }
            } catch (error) {
                console.error("Lỗi xác thực VNPAY:", error);
                setStatus('error');
                setMessage('Có lỗi xảy ra trong quá trình xác thực giao dịch.');
            }
        };

        verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-50 text-center">
                {status === 'verifying' && (
                    <div className="space-y-6">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Đang kiểm tra</h2>
                        <p className="text-gray-500 font-medium">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-green-600">Thành công!</h2>
                        <p className="text-gray-500 font-medium">{message}</p>
                        <div className="pt-4 flex flex-col gap-3">
                            <Link to="/my-orders" className="bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
                                <Package size={20} /> Xem đơn hàng
                            </Link>
                            <Link to="/" className="text-gray-400 font-bold text-sm hover:text-black transition-all">
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-red-600">Thất bại</h2>
                        <p className="text-gray-500 font-medium">{message}</p>
                        <div className="pt-4">
                            <button 
                                onClick={() => navigate('/cart')}
                                className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 transition-all"
                            >
                                Thử lại giỏ hàng <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VNPAYReturn;