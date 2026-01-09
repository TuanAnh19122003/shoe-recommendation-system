import React from 'react';
import { Eye, Edit3, User } from 'lucide-react';

const Skeleton = ({ viewMode }) => (
    <>
        {[...Array(6)].map((_, i) => (
            viewMode === 'list' ? (
                <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6">
                        <div className="h-10 bg-gray-100 rounded-2xl w-full"></div>
                    </td>
                </tr>
            ) : (
                <div key={i} className="bg-white p-6 rounded-[3rem] border border-gray-100 animate-pulse">
                    <div className="h-40 bg-gray-50 rounded-2rem mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
            )
        ))}
    </>
);

const OrderList = ({ 
    orders = [], 
    onEdit, 
    onView, 
    isLoading, 
    viewMode, 
    currentPage = 1, // Sẽ được dùng ở đây
    itemsPerPage = 6  // Sẽ được dùng ở đây
}) => {
    const STATUS_MAP = {
        pending: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-600', dot: 'bg-amber-500' },
        confirmed: { label: 'Xác nhận', color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-500' },
        shipped: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-600', dot: 'bg-indigo-500' },
        delivered: { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-600', dot: 'bg-emerald-500' },
        cancelled: { label: 'Đã hủy', color: 'bg-rose-100 text-rose-600', dot: 'bg-rose-500' },
    };

    if (isLoading) {
        return (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}>
                {viewMode === 'list' ? (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full"><tbody className="divide-y divide-gray-50"><Skeleton viewMode="list" /></tbody></table>
                    </div>
                ) : <Skeleton viewMode="grid" />}
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Chưa có đơn hàng nào</p>
            </div>
        );
    }

    return (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}>
            {viewMode === 'list' ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-gray-50">
                            <tr>
                                <th className="px-8 py-6 w-20 text-center">STT</th>
                                <th className="px-6 py-6">Mã đơn</th>
                                <th className="px-6 py-6">Khách hàng</th>
                                <th className="px-6 py-6 text-center">Trạng thái</th>
                                <th className="px-6 py-6 text-right">Tổng tiền</th>
                                <th className="px-8 py-6 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order, index) => {
                                // SỬ DỤNG currentPage và itemsPerPage ĐỂ TÍNH STT (Fix lỗi ESLint)
                                const displayIndex = (Number(currentPage) - 1) * Number(itemsPerPage) + index + 1;
                                const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
                                
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5 text-center font-black text-gray-300 text-[11px]">
                                            {displayIndex.toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-5 font-bold text-gray-400 text-[11px] font-mono">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
                                                    <User size={14} />
                                                </div>
                                                <p className="font-black text-gray-800 text-xs uppercase">{order.customer_name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${s.color}`}>
                                                    <span className={`w-1 h-1 rounded-full ${s.dot}`}></span>
                                                    {s.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-gray-900 text-sm">
                                            {Number(order.total_price).toLocaleString()}đ
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => onView(order)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"><Eye size={16}/></button>
                                                <button onClick={() => onEdit(order)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white rounded-xl transition-all"><Edit3 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Grid View (Tương tự, có thể dùng displayIndex nếu cần hiện số # trên Card) */
                orders.map((order, index) => {
                    const displayIndex = (Number(currentPage) - 1) * Number(itemsPerPage) + index + 1;
                    const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
                    return (
                        <div key={order.id} className="bg-white border border-gray-100 rounded-[3rem] p-7 group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-black text-gray-200">#{displayIndex.toString().padStart(2, '0')}</span>
                                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${s.color}`}>{s.label}</span>
                            </div>
                            {/* ... phần còn lại của Grid giữ nguyên ... */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white"><User size={20}/></div>
                                <h4 className="font-black text-gray-800 uppercase text-xs">{order.customer_name}</h4>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl mt-auto">
                                <p className="text-lg font-black">{Number(order.total_price).toLocaleString()}đ</p>
                                <div className="flex gap-2">
                                    <button onClick={() => onView(order)} className="p-2 bg-white rounded-lg"><Eye size={16}/></button>
                                    <button onClick={() => onEdit(order)} className="p-2 bg-white rounded-lg"><Edit3 size={16}/></button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default OrderList;