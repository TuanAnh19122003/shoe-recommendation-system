/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Save, Phone, Mail, User, Lock, Camera, Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const UserForm = ({ initialData, onClose, onSuccess }) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role_id: 2,
        is_active: true,
        password: '',
        image: null
    });

    useEffect(() => {
        // Lấy danh sách Role từ API
        const fetchRoles = async () => {
            try {
                const res = await axios.get(`${API_URL}/roles`);
                if (res.data.success) setRoles(res.data.data);
            } catch (err) {
                toast.error(err);
            }
        };
        fetchRoles();

        if (initialData) {
            setFormData({
                ...initialData,
                password: '',
                image: null
            });
            if (initialData.image) setPreview(initialData.image);
        }
    }, [initialData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const load = toast.loading("Đang lưu dữ liệu...");
        try {
            const data = new FormData();
            // Append các trường dữ liệu
            data.append('first_name', formData.first_name);
            data.append('last_name', formData.last_name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('role_id', formData.role_id);
            data.append('is_active', formData.is_active);

            if (formData.password) data.append('password', formData.password);
            if (formData.image instanceof File) data.append('image', formData.image);

            if (initialData) {
                await axios.put(`${API_URL}/users/${initialData.id}`, data);
            } else {
                await axios.post(`${API_URL}/users`, data);
            }

            toast.success("Cập nhật thành công!", { id: load });
            onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi hệ thống", { id: load });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-gray-800">
                            {initialData ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">ID: {initialData?.id || 'TỰ ĐỘNG'}</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white hover:text-red-500 rounded-2xl transition-all"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {/* Upload Ảnh */}
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="relative w-full h-48 bg-gray-50 rounded-4xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center group">
                            {preview ? (
                                <img src={`${preview}`} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                                <User size={40} className="text-gray-200" />
                            )}
                            <button type="button" onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all gap-2">
                                <Camera size={24} />
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ảnh đại diện</span>
                    </div>

                    {/* Họ và Tên */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2"><User size={12} /> Họ và đệm</label>
                            <input required value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500/20 text-sm font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Tên</label>
                            <input required value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500/20 text-sm font-bold" />
                        </div>
                    </div>

                    {/* Liên hệ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2"><Mail size={12} /> Email</label>
                            <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500/20 text-sm font-medium" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2"><Phone size={12} /> Số điện thoại</label>
                            <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500/20 text-sm font-medium" />
                        </div>
                    </div>

                    {/* Mật khẩu & Phân quyền */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2"><Lock size={12} /> Mật khẩu</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={initialData ? "Để trống nếu không đổi" : "••••••••"}
                                    required={!initialData}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500/20 text-sm"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2"><Shield size={12} /> Phân quyền</label>
                            <select
                                value={formData.role_id}
                                onChange={e => setFormData({ ...formData, role_id: Number(e.target.value) })}
                                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500/20 text-sm font-bold appearance-none cursor-pointer"
                            >
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Trạng thái */}
                    <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${formData.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                            <span className="text-sm font-bold text-gray-700">Trạng thái tài khoản</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                        <button type="button" onClick={onClose} className="px-8 py-3.5 rounded-2xl font-bold text-gray-400 hover:bg-gray-100 transition-all">
                            HỦY BỎ
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                            <Save size={18} /> LƯU THAY ĐỔI
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;