/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Package, DollarSign, TrendingUp, MoreVertical, Loader2, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Hàm hỗ trợ định dạng trạng thái
const getStatusDetails = (status) => {
    switch (status) {
        case 'pending':
            return { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-600 border-amber-200' };
        case 'confirmed':
            return { label: 'Xác nhận', color: 'bg-blue-100 text-blue-600 border-blue-200' };
        case 'shipped':
            return { label: 'Đang giao', color: 'bg-purple-100 text-purple-600 border-purple-200' };
        case 'delivered':
            return { label: 'Thành công', color: 'bg-green-100 text-green-600 border-green-200' };
        case 'cancelled':
            return { label: 'Đã hủy', color: 'bg-red-100 text-red-600 border-red-200' };
        default:
            return { label: status, color: 'bg-gray-100 text-gray-600 border-gray-200' };
    }
};

const StatCard = ({ title, value, icon, colorClass, trend }) => (
    <div className="bg-white p-6 rounded-2rem shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl ${colorClass} text-white shadow-lg`}>
                {icon}
            </div>
            {trend && (
                <span className="flex items-center text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} /> {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-extrabold">{title}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1 tracking-tighter">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const fetchDashboardData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders/dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data.data);
        } catch (error) {
            toast.error("Không thể tải dữ liệu thống kê");
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price) * 1000);

    if (loading) return (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-gray-500 font-medium animate-pulse">Đang đồng bộ dữ liệu...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Thống kê hệ thống</h1>
                    <p className="text-gray-500 text-sm">Dữ liệu cập nhật thời gian thực.</p>
                </div>
                <button onClick={fetchDashboardData} className="bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-all">
                    Làm mới dữ liệu
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Doanh thu thực" value={formatPrice(stats?.revenue)} icon={<DollarSign size={24} />} colorClass="bg-gradient-to-br from-blue-500 to-blue-700" trend="+12.5%" />
                <StatCard title="Tổng đơn hàng" value={stats?.orders} icon={<Package size={24} />} colorClass="bg-gradient-to-br from-orange-400 to-orange-600" />
                <StatCard title="Khách hàng" value={stats?.customers} icon={<Users size={24} />} colorClass="bg-gradient-to-br from-purple-500 to-purple-700" />
                <StatCard title="Đơn chờ duyệt" value={stats?.recentOrders?.filter(o => o.status === 'pending').length} icon={<TrendingUp size={24} />} colorClass="bg-gradient-to-br from-rose-500 to-rose-700" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="font-black text-gray-900 text-xl uppercase tracking-tight">Giao dịch gần đây</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="text-gray-400 text-[10px] uppercase font-bold tracking-widest bg-white">
                            <tr>
                                <th className="px-8 py-5">Mã đơn</th>
                                <th className="px-8 py-5">Khách hàng</th>
                                <th className="px-8 py-5">Giá trị</th>
                                <th className="px-8 py-5 text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats?.recentOrders?.map((order) => {
                                const statusInfo = getStatusDetails(order.status);
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-8 py-5 font-bold text-blue-600 text-sm italic">#ORD-{order.id}</td>
                                        <td className="px-8 py-5 font-bold text-gray-800 text-sm">
                                            {order.user?.last_name} {order.user?.first_name}
                                        </td>
                                        <td className="px-8 py-5 font-black text-gray-900 text-sm">{formatPrice(Number(order.total_price))}</td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;