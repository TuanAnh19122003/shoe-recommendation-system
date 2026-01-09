/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ShieldCheck, RefreshCw, LayoutGrid, List, X, Calendar, Fingerprint, Activity, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import RoleList from './RoleList';
import RoleForm from './RoleForm';

const API_URL = import.meta.env.VITE_API_URL;

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [viewMode, setViewMode] = useState('list');

    // State mới cho Modal chi tiết
    const [selectedRole, setSelectedRole] = useState(null);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const [res] = await Promise.all([
                axios.get(`${API_URL}/roles`),
                sleep(800)
            ]);
            if (res.data.success) {
                setRoles(res.data.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Không thể tải danh sách quyền!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchRoles(); }, []);

    const handleCreateOrUpdate = async (formData) => {
        const loadingToast = toast.loading(editingRole ? 'Đang cập nhật...' : 'Đang tạo mới...');
        try {
            if (editingRole) {
                await axios.put(`${API_URL}/roles/${editingRole.id}`, formData);
                toast.success('Cập nhật thành công!', { id: loadingToast });
            } else {
                await axios.post(`${API_URL}/roles`, formData);
                toast.success('Thêm mới thành công!', { id: loadingToast });
            }
            fetchRoles();
            setShowForm(false);
            setEditingRole(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi xử lý!", { id: loadingToast });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa quyền này?")) {
            const loadingToast = toast.loading('Đang xóa...');
            try {
                await axios.delete(`${API_URL}/roles/${id}`);
                toast.success('Đã xóa thành công!', { id: loadingToast });
                fetchRoles();
            } catch (err) {
                toast.error(err.response?.data?.message || "Lỗi khi xóa!", { id: loadingToast });
            }
        }
    };

    const formatFullDateTime = (dateString) => {
        if (!dateString) return '---';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Không xác định';
        return date.toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).replace(',', ' -');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Toaster position="top-right" reverseOrder={false} />

            {/* HEADER SECTION */}
            <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 p-6 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <div className="p-4 bg-blue-600 rounded-[1.8rem] shadow-xl shadow-blue-200/50 group-hover:rotate-6 transition-transform duration-500">
                                <ShieldCheck className="text-white" size={26} strokeWidth={2.5} />
                            </div>
                            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-4 ring-white shadow-lg">
                                {roles.length}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Quản lý vai trò</h1>
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Hệ thống đang trực tuyến
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input giả cho UI chuyên nghiệp */}
                        <div className="hidden sm:flex items-center bg-gray-100/80 px-4 py-2.5 rounded-2xl border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all w-48 lg:w-64">
                            <input type="text" placeholder="Tìm nhanh..." className="bg-transparent border-none text-xs font-bold w-full focus:outline-none" />
                        </div>

                        <div className="flex bg-gray-100/50 p-1 rounded-[1.25rem] border border-gray-100">
                            {['list', 'grid'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`p-2.5 rounded-xl transition-all duration-500 ${viewMode === mode ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {mode === 'list' ? <List size={18} strokeWidth={2.5} /> : <LayoutGrid size={18} strokeWidth={2.5} />}
                                </button>
                            ))}
                        </div>

                        <button onClick={fetchRoles} className="p-3.5 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-blue-600 active:scale-90 transition-all shadow-sm">
                            <RefreshCw size={18} strokeWidth={2.5} className={isLoading ? 'animate-spin' : ''} />
                        </button>

                        <button onClick={() => { setEditingRole(null); setShowForm(true); }} className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-all">
                            <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                            Thêm Mới
                        </button>
                    </div>
                </div>
            </div>

            <RoleList
                roles={roles}
                isLoading={isLoading}
                viewMode={viewMode}
                onEdit={(role) => { setEditingRole(role); setShowForm(true); }}
                onDelete={handleDelete}
                onView={(role) => setSelectedRole(role)}
            />

            {/* MODAL CHI TIẾT (VIEW DETAIL) */}
            {/* MODAL CHI TIẾT ROLE (CON MẮT) */}
            {selectedRole && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Lớp nền mờ */}
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setSelectedRole(null)}
                    ></div>

                    {/* Nội dung Modal */}
                    <div className="bg-white rounded-[3rem] w-full max-w-sm relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                        {/* Header: Tên Role & Icon */}
                        <div className="bg-linear-to-br from-blue-700 to-indigo-600 p-10 text-white text-center relative">
                            <button
                                onClick={() => setSelectedRole(null)}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all active:scale-90"
                            >
                                <X size={20} />
                            </button>

                            <div className="w-24 h-24 bg-white p-1 rounded-4xl shadow-2xl mx-auto mb-4 group">
                                <div className="w-full h-full bg-blue-50 rounded-[1.8rem] flex items-center justify-center overflow-hidden transition-transform group-hover:rotate-12">
                                    <ShieldCheck size={40} className="text-blue-600" />
                                </div>
                            </div>

                            <h2 className="text-xl font-black uppercase tracking-tight leading-tight">
                                {selectedRole.name}
                            </h2>
                            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full mt-2 backdrop-blur-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest">Hệ thống phân quyền</span>
                            </div>
                        </div>

                        {/* Body: Thông tin ngày tháng */}
                        <div className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 transition-hover hover:bg-white hover:shadow-md">
                                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                                        <Calendar size={16} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Ngày tạo</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-700 leading-tight">
                                        {formatFullDateTime(selectedRole.createdAt)}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 transition-hover hover:bg-white hover:shadow-md">
                                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                        <Clock size={16} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Cập nhật</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-700 leading-tight">
                                        {formatFullDateTime(selectedRole.updatedAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Ghi chú thêm nếu cần */}
                            <div className="p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50">
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Mô tả vai trò</p>
                                <p className="text-xs text-gray-500 font-medium italic leading-relaxed">
                                    {selectedRole.description || "Không có mô tả cho vai trò này."}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedRole(null)}
                                className="w-full py-4 bg-gray-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
                            >
                                Xác nhận đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showForm && (
                <RoleForm
                    initialData={editingRole}
                    onSubmit={handleCreateOrUpdate}
                    onCancel={() => { setShowForm(false); setEditingRole(null); }}
                />
            )}
        </div>
    );
};

export default RolePage;