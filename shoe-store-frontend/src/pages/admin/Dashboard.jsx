import React from 'react';
import { Users, Package, DollarSign, TrendingUp, MoreVertical } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, colorClass }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${colorClass} text-white`}>
                {icon}
            </div>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
        </div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <span className="text-xs font-bold text-green-500">{trend}</span>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Trung tâm quản trị</h1>
                    <p className="text-gray-500 text-sm">Cập nhật dữ liệu hệ thống thời gian thực.</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                    Xuất báo cáo (CSV)
                </button>
            </div>

            {/* Stats - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Doanh thu" value="$42,850" icon={<DollarSign size={22} />} trend="+12%" colorClass="bg-blue-600" />
                <StatCard title="Đơn hàng" value="1,240" icon={<Package size={22} />} trend="+5%" colorClass="bg-orange-500" />
                <StatCard title="Khách hàng" value="850" icon={<Users size={22} />} trend="+18%" colorClass="bg-purple-600" />
                <StatCard title="Tỷ lệ click" value="24.5%" icon={<TrendingUp size={22} />} trend="+2%" colorClass="bg-green-600" />
            </div>

            {/* Recent Orders - Tối ưu Responsive Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-lg">Đơn hàng gần đây</h3>
                    <button className="text-blue-600 text-sm font-bold">Xem tất cả</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Mã đơn</th>
                                <th className="px-6 py-4">Sản phẩm</th>
                                <th className="px-6 py-4">Khách hàng</th>
                                <th className="px-6 py-4">Giá trị</th>
                                <th className="px-6 py-4">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {[1, 2, 3].map((order) => (
                                <tr key={order} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-blue-600">#ORD-902{order}</td>
                                    <td className="px-6 py-4 font-medium text-gray-700">Nike Jordan 1...</td>
                                    <td className="px-6 py-4 text-gray-500">Lê Thế Vinh</td>
                                    <td className="px-6 py-4 font-black">$210.00</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase">Thành công</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;