import React from 'react';
import { X, User, MapPin, Phone, Mail, Package, CreditCard, Calendar } from 'lucide-react';

const OrderDetail = ({ order, onClose }) => {
    if (!order) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-100 text-amber-600',
            confirmed: 'bg-blue-100 text-blue-600',
            shipping: 'bg-purple-100 text-purple-600',
            delivered: 'bg-emerald-100 text-emerald-600',
            cancelled: 'bg-red-100 text-red-600',
        };
        return colors[status] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Chi tiết đơn hàng</h2>
                        <p className="text-blue-600 font-mono text-sm mt-1">#{order.id.toString().padStart(6, '0')}</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-400 hover:text-red-500">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    
                    {/* Thông tin khách hàng & Trạng thái */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                <User size={14} /> Khách hàng
                            </h3>
                            <div className="bg-gray-50 p-5 rounded-4xl space-y-3">
                                <p className="font-bold text-gray-800">{order.customer_name}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Phone size={14} /> {order.phone_number}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <MapPin size={14} /> {order.address}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                <Package size={14} /> Trạng thái & Thanh toán
                            </h3>
                            <div className="bg-gray-50 p-5 rounded-4xl space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Trạng thái:</span>
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Phương thức:</span>
                                    <span className="text-sm font-bold text-gray-700">{order.payment_method}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Ngày đặt:</span>
                                    <span className="text-sm text-gray-700 font-medium">{formatDate(order.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sản phẩm đã mua</h3>
                        <div className="border border-gray-100 rounded-[2.5rem] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">Sản phẩm</th>
                                        <th className="px-6 py-4 text-center">SL</th>
                                        <th className="px-6 py-4 text-right">Đơn giá</th>
                                        <th className="px-6 py-4 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-800 text-sm">{item.variant?.product?.name || 'Sản phẩm không xác định'}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">
                                                    Size: {item.variant?.size} | Màu: {item.variant?.color}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-bold text-gray-600">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {Number(item.price).toLocaleString()}đ
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-black text-gray-800">
                                                {(item.quantity * item.price).toLocaleString()}đ
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer Tổng tiền */}
                <div className="p-8 bg-gray-900 flex justify-between items-center rounded-t-[3rem]">
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Tổng thanh toán</span>
                    <span className="text-2xl font-black text-white italic tracking-tight">
                        {Number(order.total_price).toLocaleString()} VNĐ
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;