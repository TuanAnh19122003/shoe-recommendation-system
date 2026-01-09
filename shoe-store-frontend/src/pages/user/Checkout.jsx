/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, CreditCard, ChevronLeft, PackageCheck, Wallet } from 'lucide-react'; // Thêm icon Wallet
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { updateCartCount } = useCart();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // State mới để chọn phương thức thanh toán
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
                const fName = userData.first_name || userData.firstname || '';
                const lName = userData.last_name || userData.lastname || '';
                const phone = userData.phone_number || userData.phone || '';
                const fullName = `${lName} ${fName}`.trim();

                setShippingData(prev => ({
                    ...prev,
                    customer_name: fullName,
                    phone_number: phone
                }));
            } catch (error) {
                console.error("Lỗi đọc dữ liệu user:", error);
            }
        }
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/cart/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(res.data.data);
            if (res.data.data.items.length === 0) {
                navigate('/cart');
            }
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
        
        // Chặn nếu chọn VNPay vì chưa phát triển
        if (paymentMethod === 'vnpay') {
            toast.error("Phương thức thanh toán VNPay đang được bảo trì. Vui lòng chọn COD!");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/orders/checkout-cod',
                shippingData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Đặt hàng thành công!");
            updateCartCount();
            setTimeout(() => navigate('/my-orders'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi đặt hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0) || 0;
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1000);

    if (loading) return <div className="text-center py-20 italic">Đang tải thông tin thanh toán...</div>;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <Toaster />
            <div className="flex items-center gap-4 mb-8">
                <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-all">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Thanh toán</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* THÔNG TIN GIAO HÀNG */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-blue-600">
                            <MapPin size={20} />
                            <h2 className="font-bold uppercase tracking-wide">Thông tin giao hàng</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                required
                                name="customer_name"
                                value={shippingData.customer_name}
                                placeholder="Họ và tên người nhận"
                                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none"
                                onChange={handleInputChange}
                            />
                            <input
                                required
                                name="phone_number"
                                value={shippingData.phone_number}
                                placeholder="Số điện thoại"
                                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none"
                                onChange={handleInputChange}
                            />
                            <textarea
                                required
                                name="address"
                                placeholder="Địa chỉ chi tiết (Số nhà, đường, phường/xã...)"
                                rows="3"
                                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                onChange={handleInputChange}
                            ></textarea>
                            <input
                                name="note"
                                placeholder="Ghi chú thêm (ví dụ: giao giờ hành chính)"
                                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                onChange={handleInputChange}
                            />
                        </div>
                    </section>

                    {/* PHƯƠNG THỨC THANH TOÁN */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-blue-600">
                            <CreditCard size={20} />
                            <h2 className="font-bold uppercase tracking-wide">Phương thức thanh toán</h2>
                        </div>
                        
                        <div className="space-y-3">
                            {/* Lựa chọn COD */}
                            <div 
                                onClick={() => setPaymentMethod('cod')}
                                className={`p-4 border-2 cursor-pointer rounded-2xl flex items-center justify-between transition-all ${
                                    paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <PackageCheck className={paymentMethod === 'cod' ? 'text-green-600' : 'text-gray-400'} />
                                    <span className={`font-bold text-sm ${paymentMethod === 'cod' ? 'text-black' : 'text-gray-500'}`}>
                                        Thanh toán khi nhận hàng (COD)
                                    </span>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-black' : 'border-gray-300'}`}>
                                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-black rounded-full"></div>}
                                </div>
                            </div>

                            {/* Lựa chọn VNPay (Chỉ hiện UI) */}
                            <div 
                                onClick={() => setPaymentMethod('vnpay')}
                                className={`p-4 border-2 cursor-pointer rounded-2xl flex items-center justify-between transition-all ${
                                    paymentMethod === 'vnpay' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 shrink-0">
                                        <img src="https://vinadesign.vn/uploads/thumbnails/800/2023/05/vnpay-logo-vinadesign-25-12-59-16.jpg" alt="vnpay" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-bold text-sm ${paymentMethod === 'vnpay' ? 'text-blue-700' : 'text-gray-500'}`}>
                                            Thanh toán qua VNPay
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium italic">Sắp ra mắt</span>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'vnpay' ? 'border-blue-500' : 'border-gray-300'}`}>
                                    {paymentMethod === 'vnpay' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                                </div>
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-5 rounded-2rem font-black uppercase tracking-widest transition-all shadow-xl ${
                            isSubmitting ? 'bg-gray-400' : 'bg-black text-white hover:bg-blue-600'
                        }`}
                    >
                        {isSubmitting ? 'Đang xử lý...' : (paymentMethod === 'cod' ? 'Xác nhận đặt hàng' : 'Thanh toán ngay')}
                    </button>
                </form>

                {/* TÓM TẮT ĐƠN HÀNG (GIỮ NGUYÊN) */}
                <div className="bg-gray-50 p-8 rounded-[2.5rem] h-fit sticky top-24">
                    <h2 className="text-xl font-bold mb-6 uppercase">Tóm tắt đơn hàng</h2>
                    <div className="max-h-[40vh] overflow-y-auto mb-6 space-y-4 pr-2">
                        {cart?.items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                    <img src={`http://localhost:5000/${item.variant.product.image}`} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate uppercase">{item.variant.product.name}</h4>
                                    <p className="text-xs text-gray-400">Size: {item.variant.size} | SL: {item.quantity}</p>
                                </div>
                                <span className="font-bold text-sm">{formatPrice(item.variant.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 border-t border-gray-200 pt-6">
                        <div className="flex justify-between text-gray-500 font-medium">
                            <span>Tạm tính</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 font-medium">
                            <span>Phí vận chuyển</span>
                            <span className="text-green-600 font-bold">Miễn phí</span>
                        </div>
                        <div className="flex justify-between items-end pt-4">
                            <span className="font-black uppercase tracking-tighter text-lg">Tổng thanh toán</span>
                            <span className="text-2xl font-black text-blue-600 tracking-tighter">{formatPrice(subtotal)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;