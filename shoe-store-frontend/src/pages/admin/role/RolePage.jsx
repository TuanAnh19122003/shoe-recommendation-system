/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ShieldCheck, RefreshCw, LayoutGrid, List } from 'lucide-react'; // Thêm icon ở đây
import toast, { Toaster } from 'react-hot-toast';
import RoleList from './RoleList';
import RoleForm from './RoleForm';

const API_URL = import.meta.env.VITE_API_URL;

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    
    // 1. THÊM STATE ĐỂ QUẢN LÝ DẠNG HIỂN THỊ
    const [viewMode, setViewMode] = useState('list'); 

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
            const errorMsg = err.response?.data?.message || "Không thể tải danh sách quyền!";
            toast.error(errorMsg);
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
                toast.success('Cập nhật quyền thành công!', { id: loadingToast });
            } else {
                await axios.post(`${API_URL}/roles`, formData);
                toast.success('Thêm quyền mới thành công!', { id: loadingToast });
            }
            fetchRoles();
            setShowForm(false);
            setEditingRole(null);
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Lỗi xử lý dữ liệu!";
            toast.error(errorMsg, { id: loadingToast });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa quyền này?")) {
            const loadingToast = toast.loading('Đang xóa...');
            try {
                await axios.delete(`${API_URL}/roles/${id}`);
                toast.success('Đã xóa quyền thành công!', { id: loadingToast });
                fetchRoles();
            } catch (err) {
                const errorMsg = err.response?.data?.message || "Lỗi khi xóa dữ liệu!";
                toast.error(errorMsg, { id: loadingToast });
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                        <ShieldCheck className="text-blue-600" size={28} /> Quản lý phân quyền
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    {/* 2. CỤM NÚT CHUYỂN ĐỔI DẠNG LIST/GRID */}
                    <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 mr-2">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Dạng danh sách"
                        >
                            <List size={20} />
                        </button>
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Dạng lưới"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>

                    <button
                        onClick={fetchRoles}
                        disabled={isLoading}
                        className={`p-3 bg-white border border-gray-100 rounded-xl transition-all shadow-sm
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-90 text-gray-400'}`}
                    >
                        <RefreshCw
                            size={20}
                            className={isLoading ? 'animate-spin text-blue-600' : ''}
                        />
                    </button>
                    
                    <button
                        onClick={() => { setEditingRole(null); setShowForm(true); }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        <Plus size={20} /> Thêm Role
                    </button>
                </div>
            </div>

            {/* 3. TRUYỀN THÊM viewMode VÀO ROLELIST */}
            <RoleList
                roles={roles}
                isLoading={isLoading}
                viewMode={viewMode}
                onEdit={(role) => { setEditingRole(role); setShowForm(true); }}
                onDelete={handleDelete}
            />

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