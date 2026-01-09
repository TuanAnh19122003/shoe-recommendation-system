import React, { useState } from 'react';
import { User, Mail, Camera, Lock, Save, Edit3, X, ShieldCheck, KeyRound } from 'lucide-react';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [isEditing, setIsEditing] = useState(false);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        oldPassword: '',
        newPassword: '',
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const data = new FormData();
        data.append('firstname', formData.firstname);
        data.append('lastname', formData.lastname);
        if (file) data.append('image', file);
        if (formData.newPassword) {
            data.append('oldPassword', formData.oldPassword);
            data.append('newPassword', formData.newPassword);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/api/auth/profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                setIsEditing(false);
                alert("Cập nhật thành công!");
                window.location.reload();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi cập nhật");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] py-12 px-4 flex justify-center items-start">
            <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-white">
                
                {/* Header Profile - Tối giản khoảng trắng */}
                <div className="relative h-32 bg-linear-to-r from-blue-600 to-indigo-700">
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-3xl border-4 border-white overflow-hidden bg-gray-100 shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                <img
                                    src={preview || (user.image ? `http://localhost:5000/${user.image}` : 'https://i.pravatar.cc/150')}
                                    className="w-full h-full object-cover"
                                    alt="Avatar"
                                />
                            </div>
                            {isEditing && (
                                <label className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors shadow-lg border border-gray-100">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nội dung chính */}
                <div className="pt-16 px-8 pb-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                            {user.lastname} {user.firstname}
                        </h2>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase mt-2">
                            <ShieldCheck size={12} /> {user.role?.name || 'Thành viên'}
                        </div>
                    </div>

                    <div className="space-y-5">
                        {/* Hàng: Họ & Tên */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative group">
                                <label className="text-[10px] font-bold text-gray-400 uppercase absolute left-4 top-2 z-10">Họ</label>
                                <input
                                    disabled={!isEditing}
                                    type="text"
                                    className={`w-full pt-6 pb-2 px-4 border rounded-2xl outline-none transition-all ${isEditing ? 'bg-white border-blue-200 ring-4 ring-blue-50' : 'bg-gray-50 border-transparent text-gray-700 font-semibold'}`}
                                    value={formData.lastname}
                                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                />
                            </div>
                            <div className="relative group">
                                <label className="text-[10px] font-bold text-gray-400 uppercase absolute left-4 top-2 z-10">Tên</label>
                                <input
                                    disabled={!isEditing}
                                    type="text"
                                    className={`w-full pt-6 pb-2 px-4 border rounded-2xl outline-none transition-all ${isEditing ? 'bg-white border-blue-200 ring-4 ring-blue-50' : 'bg-gray-50 border-transparent text-gray-700 font-semibold'}`}
                                    value={formData.firstname}
                                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Hàng: Email */}
                        <div className="relative">
                            <label className="text-[10px] font-bold text-gray-400 uppercase absolute left-4 top-2 z-10">Email Đăng nhập</label>
                            <div className="w-full pt-6 pb-2 px-4 bg-gray-50 border border-transparent rounded-2xl text-gray-500 flex items-center gap-2">
                                <Mail size={14} /> {user.email}
                            </div>
                        </div>

                        {/* Phân đoạn Mật khẩu */}
                        {isEditing ? (
                            <div className="p-5 bg-blue-50/50 rounded-2rem space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-widest">
                                    <KeyRound size={16} /> Thay đổi bảo mật
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu hiện tại"
                                        className="w-full p-3 bg-white border border-blue-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 text-sm"
                                        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu mới"
                                        className="w-full p-3 bg-white border border-blue-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 text-sm"
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : null}

                        {/* Nút thao tác */}
                        <div className="pt-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                                >
                                    <Edit3 size={18} /> Chỉnh sửa hồ sơ
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200"
                                    >
                                        {loading ? "Đang lưu..." : <><Save size={18} /> Lưu thay đổi</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;