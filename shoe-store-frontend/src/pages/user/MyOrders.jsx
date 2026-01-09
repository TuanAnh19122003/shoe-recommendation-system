/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data.data);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={14} /> };
            case 'completed': return { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={14} /> };
            case 'cancelled': return { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: <XCircle size={14} /> };
            default: return { label: status, color: 'bg-gray-100 text-gray-700', icon: <Package size={14} /> };
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1000);

    if (loading) return <div className="text-center py-20 italic">Đang tải đơn hàng...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-black text-white p-2 rounded-xl">
                    <ShoppingBag size={24} />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Đơn hàng của tôi</h1>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2rem border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-6 font-medium">Bạn chưa có đơn hàng nào.</p>
                    <Link to="/products" className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-sm hover:bg-blue-600 transition-all">
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const status = getStatusStyle(order.status);
                        const isExpanded = expandedOrder === order.id; // Kiểm tra xem đơn hàng này có đang mở không

                        return (
                            <div key={order.id} className="group bg-white border border-gray-100 rounded-2rem p-6 hover:shadow-xl transition-all duration-300">
                                {/* Header đơn hàng */}
                                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mã đơn hàng</p>
                                        <h3 className="font-mono font-bold text-lg">#ORD-{order.id.toString().padStart(5, '0')}</h3>
                                    </div>
                                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${status.color}`}>
                                        {status.icon} {status.label}
                                    </div>
                                </div>

                                {/* Thông tin tóm tắt */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-50 pt-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Ngày đặt</p>
                                        <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div className="text-right md:text-left">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Tổng thanh toán</p>
                                        <p className="text-xl font-black text-blue-600 tracking-tighter">{formatPrice(order.total_price)}</p>
                                    </div>
                                    <div className="flex justify-end items-end">
                                        <button
                                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            {isExpanded ? 'Đóng chi tiết' : 'Xem chi tiết'}
                                            <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* PHẦN CHI TIẾT SẢN PHẨM (Hiện ra khi bấm nút) */}
                                {isExpanded && (
                                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Sản phẩm đã mua</h4>
                                        <div className="space-y-4">
                                            {order.items?.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border text-[10px] font-bold">
                                                            IMG
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{item.variant?.product?.name}</p>
                                                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                                                Size: {item.variant?.size} | Màu: {item.variant?.color} | SL: x{item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrders;