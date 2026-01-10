/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, CreditCard, ChevronLeft, PackageCheck, ShieldCheck, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { updateCartCount } = useCart();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    
    // Sử dụng ENV
    const API_URL = import.meta.env.VITE_API_URL;
    const BASE_URL = API_URL.replace('/api', '');
    const token = localStorage.getItem('token');

    const [shippingData, setShippingData] = useState({
        customer_name: '',
        phone_number: '',
        address: '',
        note: ''
    });

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                const fName = userData.firstname || '';
                const lName = userData.lastname || '';
                const phone = userData.phone || '';
                
                setShippingData(prev => ({
                    ...prev,
                    customer_name: `${lName} ${fName}`.trim(),
                    phone_number: phone
                }));
            } catch (error) { console.error("Lỗi parse user:", error); }
        }
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${API_URL}/cart/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(res.data.data);
            if (res.data.data.items.length === 0) navigate('/cart');
        } catch (error) {
            navigate('/cart');
            console.log(error);
            
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loadingToast = toast.loading("Đang xử lý đơn hàng...");

        try {
            if (paymentMethod === 'vnpay') {
                const res = await axios.post(`${API_URL}/orders/checkout-vnpay`,
                    shippingData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.data.success && res.data.paymentUrl) {
                    toast.success("Đang chuyển hướng sang VNPAY...", { id: loadingToast });
                    window.location.href = res.data.paymentUrl;
                } else {
                    throw new Error("Không nhận được link thanh toán");
                }
            } else {
                await axios.post(`${API_URL}/orders/checkout-cod`,
                    shippingData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success("Đặt hàng thành công! 📦", { id: loadingToast });
                updateCartCount();
                setTimeout(() => navigate('/my-orders'), 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi xử lý đơn hàng", { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0) || 0;
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1000);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Đang chuẩn bị đơn hàng...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-16 bg-white min-h-screen">
            <Toaster position="top-center" />
            
            <div className="flex items-center gap-4 mb-12">
                <Link to="/cart" className="p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-sm">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Thanh toán</h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Hoàn tất bước cuối cùng để nhận giày</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-12">
                    {/* THÔNG TIN GIAO HÀNG */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <MapPin size={22} className="text-indigo-600" />
                            <h2 className="text-xl font-black uppercase italic tracking-tight">Thông tin nhận hàng</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Họ và tên người nhận</label>
                                <input required name="customer_name" value={shippingData.customer_name} placeholder="VD: Nguyễn Văn A" className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium" onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Số điện thoại</label>
                                <input required name="phone_number" value={shippingData.phone_number} placeholder="090..." className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium" onChange={handleInputChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Địa chỉ giao hàng</label>
                                <textarea required name="address" value={shippingData.address} placeholder="Số nhà, tên đường, phường/xã..." rows="3" className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium" onChange={handleInputChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Ghi chú (Tùy chọn)</label>
                                <input name="note" value={shippingData.note} placeholder="Ví dụ: Giao giờ hành chính..." className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium" onChange={handleInputChange} />
                            </div>
                        </div>
                    </section>

                    {/* PHƯƠNG THỨC THANH TOÁN */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <CreditCard size={22} className="text-indigo-600" />
                            <h2 className="text-xl font-black uppercase italic tracking-tight">Phương thức thanh toán</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* COD */}
                            <div onClick={() => setPaymentMethod('cod')} className={`group p-6 border-2 cursor-pointer rounded-2rem transition-all flex flex-col gap-4 ${paymentMethod === 'cod' ? 'border-black bg-slate-900 text-white shadow-2xl' : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}>
                                <div className="flex justify-between items-start">
                                    <PackageCheck size={32} className={paymentMethod === 'cod' ? 'text-indigo-400' : 'text-slate-400'} />
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-indigo-400' : 'border-slate-300'}`}>
                                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-scale"></div>}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-black uppercase tracking-widest text-sm">Thanh toán khi nhận hàng</p>
                                    <p className={`text-[10px] mt-1 font-bold ${paymentMethod === 'cod' ? 'text-slate-400' : 'text-slate-400'}`}>Kiểm tra hàng trước khi trả tiền</p>
                                </div>
                            </div>

                            {/* VNPAY */}
                            <div onClick={() => setPaymentMethod('vnpay')} className={`group p-6 border-2 cursor-pointer rounded-2rem transition-all flex flex-col gap-4 ${paymentMethod === 'vnpay' ? 'border-blue-600 bg-blue-50/50 shadow-2xl shadow-blue-100' : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}>
                                <div className="flex justify-between items-start">
                                    <img src="https://vinadesign.vn/uploads/thumbnails/800/2023/05/vnpay-logo-vinadesign-25-12-59-16.jpg" alt="vnpay" className="h-8 object-contain rounded-lg" />
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'vnpay' ? 'border-blue-600' : 'border-slate-300'}`}>
                                        {paymentMethod === 'vnpay' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-scale"></div>}
                                    </div>
                                </div>
                                <div>
                                    <p className={`font-black uppercase tracking-widest text-sm ${paymentMethod === 'vnpay' ? 'text-blue-900' : 'text-slate-900'}`}>Thanh toán qua VNPAY</p>
                                    <p className="text-[10px] mt-1 font-bold text-slate-400">Thanh toán bằng thẻ ATM, QR Code hoặc Ví điện tử</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <button type="submit" disabled={isSubmitting} className="group relative w-full bg-black text-white py-6 rounded-2rem font-black uppercase tracking-[0.3em] text-sm overflow-hidden transition-all hover:bg-indigo-600 active:scale-95 shadow-2xl">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? 'Đang xử lý...' : (paymentMethod === 'cod' ? 'Hoàn tất đặt hàng' : 'Thanh toán ngay')}
                        </span>
                    </button>
                </form>

                {/* TÓM TẮT ĐƠN HÀNG */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-50 p-10 rounded-[3rem] sticky top-24 border border-white shadow-sm">
                        <div className="flex items-center gap-2 mb-8">
                            <ShieldCheck size={20} className="text-green-500" />
                            <h2 className="text-lg font-black uppercase italic tracking-tight">Chi tiết đơn hàng</h2>
                        </div>
                        
                        <div className="max-h-[35vh] overflow-y-auto mb-8 space-y-6 pr-2 scrollbar-hide">
                            {cart?.items.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                                        <img src={item.variant?.product?.image?.startsWith('http') ? item.variant.product.image : `${BASE_URL}/${item.variant?.product?.image}`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className="font-black text-sm truncate uppercase tracking-tight text-slate-900">{item.variant.product.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Size: {item.variant.size} | SL: {item.quantity}</p>
                                        <p className="font-black text-sm text-indigo-600 mt-1">{formatPrice(item.variant.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 border-t border-slate-200 pt-8">
                            <div className="flex justify-between items-center text-slate-500">
                                <span className="text-[10px] font-black uppercase tracking-widest">Tạm tính</span>
                                <span className="font-bold text-sm">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-500">
                                <span className="text-[10px] font-black uppercase tracking-widest">Phí giao hàng</span>
                                <span className="text-green-600 font-black text-[10px] uppercase tracking-widest">Miễn phí</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-dashed border-slate-200">
                                <span className="font-black uppercase tracking-tighter text-slate-900">Tổng cộng</span>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-indigo-600 tracking-tighter leading-none block">{formatPrice(subtotal)}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Đã bao gồm VAT</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-indigo-50/50 p-4 rounded-2xl flex gap-3 items-start border border-indigo-100">
                            <Info size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold text-indigo-900/70 leading-relaxed uppercase tracking-wider">
                                Bằng cách đặt hàng, bạn đồng ý với điều khoản dịch vụ của cửa hàng chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;