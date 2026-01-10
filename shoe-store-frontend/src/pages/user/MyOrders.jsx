/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight, ShoppingBag, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    
    // Sử dụng biến môi trường
    const API_URL = import.meta.env.VITE_API_URL;
    const BASE_URL = API_URL.replace('/api', '');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/orders/my-orders`, {
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
            case 'pending': 
                return { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700', icon: <Clock size={14} /> };
            case 'processing': 
                return { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700', icon: <Package size={14} /> };
            case 'shipping': 
                return { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-700', icon: <Truck size={14} /> };
            case 'completed': 
                return { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={14} /> };
            case 'cancelled': 
                return { label: 'Đã hủy', color: 'bg-rose-100 text-rose-700', icon: <XCircle size={14} /> };
            default: 
                return { label: status, color: 'bg-slate-100 text-slate-700', icon: <Package size={14} /> };
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1000);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Đang tải lịch sử đơn hàng...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 text-white p-4 rounded-1.5rem shadow-xl shadow-slate-200">
                        <ShoppingBag size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Đơn hàng</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Theo dõi hành trình đơn hàng của bạn</p>
                    </div>
                </div>
                <Link to="/products" className="text-xs font-black uppercase tracking-widest px-6 py-3 bg-slate-100 rounded-xl hover:bg-black hover:text-white transition-all">
                    Tiếp tục mua sắm
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={32} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 mb-8 font-bold uppercase tracking-widest text-sm">Bạn chưa có đơn hàng nào.</p>
                    <Link to="/products" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-blue-100">
                        Khám phá sản phẩm ngay
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => {
                        const status = getStatusStyle(order.status);
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <div key={order.id} className={`group bg-white border-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden ${isExpanded ? 'border-slate-900 shadow-2xl' : 'border-slate-50 hover:border-slate-200 hover:shadow-xl'}`}>
                                {/* Header đơn hàng */}
                                <div className="p-8 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mã định danh</span>
                                            <h3 className="font-black text-xl tracking-tighter uppercase italic">#ORD-{order.id.toString().padStart(5, '0')}</h3>
                                        </div>
                                        <div className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${status.color}`}>
                                            {status.icon} {status.label}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày mua</p>
                                            <p className="text-sm font-bold text-slate-900 italic">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thanh toán</p>
                                            <div className="flex items-center gap-1.5">
                                                <CreditCard size={12} className="text-slate-400" />
                                                <p className="text-[10px] font-black uppercase text-slate-900">{order.payment_method === 'cod' ? 'Khi nhận hàng' : 'VNPAY Online'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng cộng</p>
                                            <p className="text-xl font-black text-blue-600 tracking-tighter leading-none">{formatPrice(order.total_price)}</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center transition-transform duration-500 ${isExpanded ? 'rotate-90 bg-slate-900 text-white' : 'group-hover:bg-blue-600 group-hover:text-white'}`}>
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PHẦN CHI TIẾT SẢN PHẨM */}
                                {isExpanded && (
                                    <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="pt-8 border-t border-dashed border-slate-200">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                                <Package size={14} /> Danh sách sản phẩm ({order.items?.length})
                                            </h4>
                                            <div className="space-y-3">
                                                {order.items?.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 p-4 rounded-3xl transition-colors border border-transparent hover:border-slate-100">
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden border border-slate-100 p-1">
                                                                <img 
                                                                    src={item.variant?.product?.image?.startsWith('http') ? item.variant.product.image : `${BASE_URL}/${item.variant?.product?.image}`} 
                                                                    alt="" 
                                                                    className="w-full h-full object-cover rounded-xl"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight mb-1">{item.variant?.product?.name}</p>
                                                                <div className="flex gap-3">
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Size: {item.variant?.size}</span>
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Qty: {item.quantity}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-black text-slate-900 italic tracking-tighter">{formatPrice(item.price)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Địa chỉ giao hàng tóm tắt trong chi tiết */}
                                            <div className="mt-8 p-6 bg-blue-50/50 rounded-2rem border border-blue-100 flex flex-col md:flex-row gap-6 justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest mb-2">Địa chỉ nhận hàng</p>
                                                    <p className="text-xs font-bold text-blue-900 leading-relaxed max-w-md">
                                                        {order.customer_name} • {order.phone_number} <br />
                                                        {order.address}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col justify-end">
                                                    {order.status === 'pending' && (
                                                        <button className="text-[10px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 transition-colors">
                                                            Yêu cầu hủy đơn
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
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