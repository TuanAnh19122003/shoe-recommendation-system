/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const { updateCartCount } = useCart();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sử dụng biến môi trường từ .env
    const API_URL = import.meta.env.VITE_API_URL;
    const BASE_URL = API_URL.replace('/api', ''); // Lấy URL gốc (http://localhost:5000) để hiện ảnh
    const token = localStorage.getItem('token');

    // 1. Lấy dữ liệu giỏ hàng
    const fetchCart = async () => {
        try {
            const response = await axios.get(`${API_URL}/cart/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartData(response.data.data);
        } catch (error) {
            console.error("Lỗi lấy giỏ hàng:", error);
            toast.error("Không thể tải giỏ hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // 2. Cập nhật số lượng
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.put(`${API_URL}/cart/item/${itemId}`,
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCartData(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            }));
            updateCartCount();
        } catch (error) {
            toast.error("Lỗi cập nhật số lượng");
            console.log(error);

        }
    };

    // 3. Xóa sản phẩm
    const removeItem = async (itemId) => {
        toast((t) => (
            <span className="flex items-center gap-3 font-medium">
                Xóa sản phẩm này?
                <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs"
                    onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                            await axios.delete(`${API_URL}/cart/item/${itemId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            setCartData(prev => ({
                                ...prev,
                                items: prev.items.filter(i => i.id !== itemId)
                            }));
                            updateCartCount();
                            toast.success("Đã xóa khỏi giỏ hàng");
                        } catch (err) {
                            toast.error("Lỗi xóa sản phẩm"); console.log(err);
                        }
                    }}
                >Xóa</button>
            </span>
        ));
    };

    // 4. Xóa sạch giỏ hàng
    const clearCart = async () => {
        if (!window.confirm("Bạn muốn làm trống giỏ hàng?")) return;
        try {
            await axios.delete(`${API_URL}/cart/clear`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartData({ items: [] });
            updateCartCount();
            toast.success("Giỏ hàng đã trống");
        } catch (error) {
            toast.error("Lỗi xóa giỏ hàng"); console.log(error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1000);
    };

    const subtotal = cartData?.items?.reduce((sum, item) =>
        sum + (parseFloat(item.variant?.price || 0) * item.quantity), 0) || 0;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
    );

    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 bg-white">
                <div className="relative">
                    <div className="bg-slate-50 p-12 rounded-[3rem] animate-pulse">
                        <ShoppingBag size={80} className="text-slate-200" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-red-500 w-8 h-8 rounded-full border-4 border-white"></div>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Giỏ hàng đang trống</h2>
                    <p className="text-slate-400 font-medium">Có vẻ như bạn chưa chọn được đôi giày nào 👟</p>
                </div>
                <Link to="/products" className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl active:scale-95">
                    Khám phá ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-16 bg-white min-h-screen">
            <Toaster position="bottom-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                    <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-black font-bold text-xs uppercase tracking-widest transition-all">
                        <ArrowLeft size={16} /> Quay lại cửa hàng
                    </Link>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Giỏ hàng <span className="text-indigo-600">.</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest">{cartData.items.length} Items</span>
                    <button onClick={clearCart} className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest underline decoration-2 underline-offset-4 transition-all">Xóa tất cả</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Danh sách sản phẩm */}
                <div className="lg:col-span-8 space-y-8">
                    {cartData.items.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-slate-50 group">
                            {/* Ảnh sản phẩm */}
                            <div className="w-full sm:w-44 h-44 rounded-2rem overflow-hidden bg-slate-50 relative shrink-0">
                                <img
                                    src={item.variant?.product?.image?.startsWith('http') ? item.variant.product.image : `${BASE_URL}/${item.variant?.product?.image}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Product"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x300?text=Sneaker'}
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all"></div>
                            </div>

                            {/* Chi tiết */}
                            <div className="flex-1 flex flex-col py-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-black text-2xl text-slate-900 uppercase italic tracking-tighter mb-2 leading-tight">
                                            {item.variant?.product?.name}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">Size: {item.variant?.size}</span>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
                                                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: item.variant?.color }}></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.variant?.color}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                        <Trash2 size={22} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end mt-auto pt-6">
                                    {/* Bộ tăng giảm số lượng */}
                                    <div className="flex items-center gap-6 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-400 hover:text-black transition-colors"><Minus size={16} /></button>
                                        <span className="text-lg font-black w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-400 hover:text-black transition-colors"><Plus size={16} /></button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Thành tiền</p>
                                        <p className="font-black text-2xl text-indigo-600 tracking-tighter">{formatPrice(item.variant?.price * item.quantity)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="lg:col-span-4">
                    <div className="bg-slate-900 text-white p-10 rounded-[3rem] sticky top-32 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-10 flex items-center gap-3">
                            <CreditCard className="text-indigo-400" /> Thanh toán
                        </h2>

                        <div className="space-y-6 mb-10 border-b border-slate-800 pb-10">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Tạm tính</span>
                                <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Vận chuyển</span>
                                <span className="text-green-400 font-black uppercase text-[10px] tracking-[0.2em]">Miễn phí ✨</span>
                            </div>
                        </div>

                        <div className="mb-10 text-center">
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-2">Tổng cộng thanh toán</p>
                            <p className="text-5xl font-black tracking-tighter text-white italic">{formatPrice(subtotal)}</p>
                        </div>

                        <Link to="/checkout" className="group relative block w-full bg-indigo-600 hover:bg-white text-white hover:text-black py-6 rounded-2rem font-black uppercase text-sm tracking-[0.2em] transition-all duration-500 overflow-hidden text-center shadow-xl active:scale-95">
                            <span className="relative z-10">Thanh toán ngay</span>
                        </Link>

                        <div className="mt-8 flex justify-center gap-4 opacity-30 grayscale">
                            {/* Thêm các icon thanh toán nếu muốn */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;