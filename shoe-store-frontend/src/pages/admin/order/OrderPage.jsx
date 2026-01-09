import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, RefreshCw, LayoutGrid, List, X, Calendar, Clock, ShoppingBag, MapPin, Phone, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import OrderList from './OrderList';
import Pagination from '../../../components/Pagination';
import OrderForm from './OrderForm';
import OrderDetail from './OrderDetail';

const API_URL = import.meta.env.VITE_API_URL;

const OrderPage = () => {
    // --- STATES DỮ LIỆU ---
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // Đơn hàng thường xem dạng List dễ bao quát hơn
    const [statusFilter, setStatusFilter] = useState('all');

    // --- STATES ĐIỀU KHIỂN MODAL ---
    const [editingOrder, setEditingOrder] = useState(null); // Để cập nhật trạng thái
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null); // Xem chi tiết

    // --- PHÂN TRANG (Server-side) ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 6;

    // --- LOGIC FETCH DATA ---
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/orders`, {
                params: {
                    page: currentPage,
                    pageSize: pageSize,
                    status: statusFilter === 'all' ? undefined : statusFilter
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setOrders(res.data.data); // data từ controller của bạn là result.rows
                setTotalItems(res.data.total); // total từ controller là result.count
            }
        } catch (err) {
            toast.error("Không thể lấy danh sách đơn hàng!");
            console.error(err);
        } finally {
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    // Tự động fetch khi đổi trang hoặc đổi bộ lọc
    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, statusFilter]);

    // Tính tổng số trang dựa trên totalItems từ server
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    const handleFilterChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(1); // Reset về trang 1 khi đổi bộ lọc
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Toaster position="top-right" />

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3 italic">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                            <ShoppingBag className="text-white" size={24} />
                        </div>
                        Quản lý đơn hàng
                    </h1>
                    <div className="flex gap-4 mt-2 ml-1">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            Tổng bản ghi: <span className="text-blue-600">{totalItems}</span>
                        </p>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            Trang: <span className="text-blue-600">{currentPage} / {totalPages}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode */}
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400'}`}>
                            <List size={20} />
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400'}`}>
                            <LayoutGrid size={20} />
                        </button>
                    </div>

                    {/* Refresh */}
                    <button onClick={fetchOrders} className="p-3.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all active:scale-95">
                        <RefreshCw size={20} className={`${isLoading ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
                    </button>
                </div>
            </div>

            {/* FILTER TABS */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <button
                        key={s}
                        onClick={() => handleFilterChange(s)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 shrink-0 ${statusFilter === s
                                ? 'bg-gray-900 text-white border-gray-900 shadow-xl scale-105'
                                : 'bg-white text-gray-400 border-gray-50 hover:border-gray-200'
                            }`}
                    >
                        {s === 'all' ? 'Tất cả đơn' : s}
                    </button>
                ))}
            </div>

            {/* MAIN LIST SECTION */}
            <div className="min-h-100">
                <OrderList
                    orders={orders}
                    isLoading={isLoading}
                    viewMode={viewMode}
                    onEdit={(o) => setEditingOrder(o)}
                    onView={(o) => setSelectedOrderDetail(o)}
                    currentPage={currentPage}
                    itemsPerPage={pageSize}
                />
            </div>

            {/* PAGINATION */}
            {!isLoading && (
                <div className="flex justify-center pt-8 pb-12">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* MODAL CHI TIẾT ĐƠN HÀNG (OrderDetail) */}
            {selectedOrderDetail && (
                <OrderDetail
                    order={selectedOrderDetail}
                    onClose={() => setSelectedOrderDetail(null)}
                />
            )}

            {/* FORM MODAL CẬP NHẬT TRẠNG THÁI (OrderForm) */}
            {editingOrder && (
                <OrderForm
                    initialData={editingOrder}
                    onClose={() => setEditingOrder(null)}
                    onSuccess={() => {
                        setEditingOrder(null);
                        fetchOrders();
                    }}
                />
            )}
        </div>
    );
};

export default OrderPage;