import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, RefreshCw, LayoutGrid, List, Calendar, Clock, X, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import UserList from './UserList';
import Pagination from '../../../components/Pagination';
import UserForm from './UserForm';

const API_URL = import.meta.env.VITE_API_URL;

const UserPage = () => {
    // --- STATES DỮ LIỆU ---
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list');

    // --- STATES ĐIỀU KHIỂN MODAL ---
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUserDetail, setSelectedUserDetail] = useState(null);

    // --- PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    // --- LOGIC FETCH DATA ---
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/users`);
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (err) {
            toast.error("Không thể kết nối đến máy chủ!");
            console.error(err);
        } finally {
            // Tạo hiệu ứng loading mượt mà
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // --- XỬ LÝ XÓA ---
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này? Hành động này không thể hoàn tác.")) {
            const loadingToast = toast.loading('Đang xử lý...');
            try {
                await axios.delete(`${API_URL}/users/${id}`);
                toast.success('Đã xóa thành viên thành công!', { id: loadingToast });
                fetchUsers();
            } catch (err) {
                toast.error('Lỗi khi xóa dữ liệu!', { id: loadingToast });
                console.log(err);
            }
        }
    };

    // --- PHÂN TRANG LOGIC ---
    const totalPages = Math.ceil(users.length / pageSize);
    const currentData = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // --- HELPER ĐỊNH DẠNG ---
    const formatFullDateTime = (dateString) => {
        if (!dateString) return 'Chưa có dữ liệu';
        return new Date(dateString).toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Toaster position="top-right" reverseOrder={false} />

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                            <Users className="text-white" size={24} />
                        </div>
                        Quản lý người dùng
                    </h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 ml-1">
                        Tổng số: <span className="text-blue-600">{users.length}</span> thành viên
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Chế độ xem */}
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                        <button 
                            onClick={() => setViewMode('list')} 
                            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <List size={20} />
                        </button>
                        <button 
                            onClick={() => setViewMode('grid')} 
                            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>

                    {/* Refresh */}
                    <button 
                        onClick={fetchUsers} 
                        disabled={isLoading} 
                        className="p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <RefreshCw size={20} className={`${isLoading ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
                    </button>

                    {/* Thêm mới */}
                    <button
                        onClick={() => { setEditingUser(null); setShowForm(true); }}
                        className="bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-black shadow-xl active:scale-95 transition-all"
                    >
                        <Plus size={18} strokeWidth={3} /> Thêm mới
                    </button>
                </div>
            </div>

            {/* MAIN LIST SECTION */}
            <div className="min-h-100">
                <UserList
                    users={currentData}
                    isLoading={isLoading}
                    viewMode={viewMode}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onEdit={(user) => {
                        setEditingUser(user);
                        setShowForm(true);
                    }}
                    onDelete={handleDelete}
                    onViewDetail={(user) => setSelectedUserDetail(user)}
                />
            </div>

            {/* PAGINATION */}
            {!isLoading && users.length > pageSize && (
                <div className="flex justify-center pt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* MODAL CHI TIẾT (CON MẮT) */}
            {selectedUserDetail && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" 
                        onClick={() => setSelectedUserDetail(null)}
                    ></div>
                    
                    <div className="bg-white rounded-[3rem] w-full max-w-sm relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Avatar Header */}
                        <div className="bg-linear-to-br from-blue-700 to-indigo-600 p-10 text-white text-center relative">
                            <button 
                                onClick={() => setSelectedUserDetail(null)} 
                                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="w-24 h-24 bg-white p-1 rounded-4xl shadow-2xl mx-auto mb-4">
                                <div className="w-full h-full bg-blue-50 rounded-[1.8rem] flex items-center justify-center overflow-hidden">
                                    {selectedUserDetail.image ? (
                                        <img src={`http://localhost:5000/${selectedUserDetail.image}`} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-blue-300" />
                                    )}
                                </div>
                            </div>
                            
                            <h2 className="text-xl font-black uppercase tracking-tight leading-tight">
                                {selectedUserDetail.last_name} {selectedUserDetail.first_name}
                            </h2>
                            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full mt-2 backdrop-blur-sm">
                                <ShieldCheck size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{selectedUserDetail.role?.name || 'Thành viên'}</span>
                            </div>
                        </div>
                        
                        {/* Info Body */}
                        <div className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                                        <Calendar size={16} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Ngày tạo</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-700">{formatFullDateTime(selectedUserDetail.createdAt).split(' ')[1]}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                        <Clock size={16} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Cập nhật</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-700">{formatFullDateTime(selectedUserDetail.updatedAt).split(' ')[1]}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <Mail className="text-blue-500" size={18} />
                                    <span className="text-xs font-bold text-gray-600 truncate">{selectedUserDetail.email}</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                    <Phone className="text-indigo-500" size={18} />
                                    <span className="text-xs font-bold text-gray-600">{selectedUserDetail.phone || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedUserDetail(null)}
                                className="w-full py-4 bg-gray-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all active:scale-95 mt-2"
                            >
                                Xác nhận đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FORM MODAL (THÊM/SỬA) */}
            {showForm && (
                <UserForm
                    initialData={editingUser}
                    onClose={() => {
                        setShowForm(false);
                        setEditingUser(null);
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        fetchUsers();
                    }}
                />
            )}
        </div>
    );
};

export default UserPage;