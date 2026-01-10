import React, { useState } from 'react';
import { User, Mail, Camera, Lock, Save, Edit3, X, ShieldCheck, KeyRound, Phone, CheckCircle2, ChevronRight } from 'lucide-react';
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
        phone: user.phone || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSave = async () => {
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            return alert("Mật khẩu mới không khớp nhau!");
        }

        setLoading(true);
        const data = new FormData();
        data.append('firstname', formData.firstname);
        data.append('lastname', formData.lastname);
        data.append('phone', formData.phone);
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
                alert("Cập nhật thành công ✨");
                setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
                window.location.reload();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi cập nhật");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] py-16 px-4 flex justify-center items-start font-sans antialiased text-slate-900">
            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-white/20">

                {/* Visual Header */}
                <div className="relative h-48 bg-slate-900 overflow-visible"> {/* Đổi overflow-hidden thành visible */}
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,#3b82f6,transparent)] overflow-hidden"></div>

                    {/* Container chứa Avatar và Tên - Đẩy z-index lên cao */}
                    <div className="absolute -bottom-16 left-10 flex items-end gap-6 z-50">
                        <div className="relative group">
                            <div className="w-36 h-36 rounded-3xl border-[6px] border-white shadow-2xl overflow-hidden bg-white transition-transform duration-500 group-hover:scale-[1.02]">
                                <img
                                    // Sửa logic src: Nếu có preview thì dùng preview, nếu user.image là link http thì dùng luôn, không thì cộng chuỗi localhost
                                    src={preview || (user.image?.startsWith('http') ? user.image : `http://localhost:5000/${user.image}`) || 'https://i.pravatar.cc/150'}
                                    className="w-full h-full object-cover"
                                    alt="Avatar"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }} // Phòng hờ ảnh lỗi
                                />
                            </div>
                            {isEditing && (
                                <label className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl cursor-pointer hover:bg-indigo-700 transition-all shadow-lg hover:rotate-12 z-50">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>
                        <div className="mb-20 text-white">
                            <h2 className="text-3xl font-bold tracking-tight uppercase italic drop-shadow-md">
                                {user.lastname} {user.firstname}
                            </h2>
                            <p className="text-slate-300 text-sm font-medium flex items-center gap-2">
                                <ShieldCheck size={14} className="text-indigo-400" />
                                {user.role?.name || 'Thành viên'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="pt-24 px-10 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Information Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={14} /> Thông tin cá nhân
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 ml-1">Họ</label>
                                        <input
                                            disabled={!isEditing}
                                            className={`w-full px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${isEditing ? 'bg-slate-50 border-2 border-indigo-100 focus:border-indigo-500 outline-none ring-4 ring-indigo-50' : 'bg-transparent border-2 border-transparent text-slate-700'}`}
                                            value={formData.lastname}
                                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 ml-1">Tên</label>
                                        <input
                                            disabled={!isEditing}
                                            className={`w-full px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${isEditing ? 'bg-slate-50 border-2 border-indigo-100 focus:border-indigo-500 outline-none ring-4 ring-indigo-50' : 'bg-transparent border-2 border-transparent text-slate-700'}`}
                                            value={formData.firstname}
                                            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 ml-1">Số điện thoại</label>
                                    <div className="relative">
                                        <input
                                            disabled={!isEditing}
                                            className={`w-full px-11 py-3.5 rounded-2xl text-sm font-medium transition-all ${isEditing ? 'bg-slate-50 border-2 border-indigo-100 focus:border-indigo-500 outline-none ring-4 ring-indigo-50' : 'bg-transparent border-2 border-transparent text-slate-700'}`}
                                            value={formData.phone}
                                            placeholder="Cập nhật số điện thoại..."
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 opacity-70">
                                    <label className="text-xs font-semibold text-slate-500 ml-1">Email (Cố định)</label>
                                    <div className="relative flex items-center">
                                        <input disabled className="w-full px-11 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium text-slate-500 cursor-not-allowed" value={user.email} />
                                        <Mail size={16} className="absolute left-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Lock size={14} /> Bảo mật tài khoản
                            </h3>

                            {isEditing ? (
                                <div className="p-6 bg-slate-900 rounded-2rem space-y-4 shadow-inner">
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu hiện tại"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-indigo-500"
                                        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu mới"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-indigo-500"
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Xác nhận mật khẩu"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-indigo-500"
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <div className="bg-slate-50 p-6 rounded-2rem border border-slate-100 flex flex-col items-center justify-center text-center space-y-3">
                                    <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-500">
                                        <KeyRound size={24} />
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium px-4">Nhấn chỉnh sửa để thay đổi mật khẩu định kỳ giúp bảo mật tài khoản.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
                        <p className="text-xs text-slate-400 font-medium italic">Cập nhật lần cuối: 2 phút trước</p>

                        <div className="flex gap-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center gap-2"
                                >
                                    <Edit3 size={16} /> Chỉnh sửa hồ sơ
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-2xl transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center gap-2"
                                    >
                                        {loading ? "Đang xử lý..." : <><Save size={16} /> Lưu thay đổi</>}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;