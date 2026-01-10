import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const { updateCartCount } = useCart();
    const [cartData, setCartData] = useState(null); // Lưu toàn bộ object 'data' từ API
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    // 1. Lấy dữ liệu giỏ hàng
    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/cart/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // API trả về { success: true, data: { items: [...] } }
            setCartData(response.data.data);
            console.log(response.data.data);
            
        } catch (error) {
            console.error("Lỗi lấy giỏ hàng:", error);
            toast.error("Không thể tải giỏ hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Cập nhật số lượng (PUT)
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.put(`http://localhost:5000/api/cart/item/${itemId}`,
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Cập nhật state cục bộ dựa trên mảng 'items'
            setCartData(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            }));
            updateCartCount(); 
        } catch (error) {
            toast.error("Không thể cập nhật số lượng");
            console.log(error);
        }
    };

    // 3. Xóa sản phẩm (DELETE)
    const removeItem = async (itemId) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/cart/item/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setCartData(prev => ({
                ...prev,
                items: prev.items.filter(item => item.id !== itemId)
            }));
            
            toast.success("Đã xóa sản phẩm");
            updateCartCount();
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm");
            console.log(error);
        }
    };

    // 4. Xóa sạch giỏ hàng
    const clearCart = async () => {
        if (!window.confirm("Bạn muốn xóa toàn bộ giỏ hàng?")) return;
        try {
            await axios.delete('http://localhost:5000/api/cart/clear', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartData({ items: [] });
            toast.success("Giỏ hàng đã trống");
            updateCartCount();
        } catch (error) {
            toast.error("Lỗi khi xóa giỏ hàng");
            console.log(error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1000);
    };

    // Tính tổng tiền dựa trên 'variant' (viết thường theo API)
    const subtotal = cartData?.items?.reduce((sum, item) => 
        sum + (parseFloat(item.variant?.price || 0) * item.quantity), 0) || 0;

    if (loading) return <div className="min-h-screen flex items-center justify-center italic text-gray-400">Đang kiểm tra giỏ hàng...</div>;

    // Kiểm tra mảng 'items'
    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="bg-gray-50 p-8 rounded-full">
                    <ShoppingBag size={60} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h2>
                <Link to="/products" className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-sm tracking-widest hover:bg-gray-800 transition-all">
                    Mua sắm ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <Toaster />
            <div className="flex items-center gap-4 mb-10">
                <Link to="/products" className="p-2 hover:bg-gray-100 rounded-full transition-all">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">Giỏ hàng của bạn</h1>
                <span className="text-gray-400 font-medium">({cartData.items.length} sản phẩm)</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {cartData.items.map((item) => (
                        <div key={item.id} className="flex gap-6 p-6 border border-gray-100 rounded-2rem hover:shadow-xl hover:shadow-gray-100 transition-all group">
                            {/* Lưu ý: Bạn cần kiểm tra field ảnh trong variant.product ở API thật */}
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                                <img
                                    src={`http://localhost:5000/${item.variant?.product?.image || ''}`}
                                    className="w-full h-full object-cover"
                                    alt="Product"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors uppercase">
                                            {item.variant?.product?.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 font-medium">
                                            Màu: <span style={{ color: item.variant?.color }}>●</span> {item.variant?.color} | Size: {item.variant?.size}
                                        </p>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded-lg transition-all shadow-sm"><Minus size={14} /></button>
                                        <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded-lg transition-all shadow-sm"><Plus size={14} /></button>
                                    </div>
                                    <p className="font-black text-blue-600">{formatPrice(item.variant?.price * item.quantity)}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button onClick={clearCart} className="text-sm text-red-500 font-bold hover:underline flex items-center gap-2 px-4">
                        <Trash2 size={16} /> Xóa sạch giỏ hàng
                    </button>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 rounded-[2.5rem] sticky top-24">
                        <h2 className="text-xl font-bold mb-6 uppercase tracking-tighter">Tổng đơn hàng</h2>
                        <div className="space-y-4 border-b border-gray-200 pb-6 mb-6 font-medium">
                            <div className="flex justify-between text-gray-500">
                                <span>Tạm tính</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-600">Miễn phí</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end mb-8">
                            <span className="font-bold text-gray-900">Tổng cộng</span>
                            <div className="text-right">
                                <p className="text-2xl font-black text-blue-600 tracking-tighter">{formatPrice(subtotal)}</p>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Đã bao gồm VAT</p>
                            </div>
                        </div>
                        <Link to="/checkout" className="block w-full bg-black text-white text-center py-5 rounded-2rem font-black uppercase text-sm tracking-widest hover:bg-blue-600 hover:scale-[1.02] transition-all shadow-xl shadow-gray-200">
                            Thanh toán ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;