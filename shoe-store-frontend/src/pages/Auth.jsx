import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import trực tiếp axios
import {
    Mail, Lock, ArrowRight, Loader2,
    Eye, EyeOff, Footprints, UserPlus,
    LogIn, CheckCircle2
} from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Cấu hình Base URL của bạn ở đây
    const BASE_URL = 'http://localhost:5000/api';

    const [rememberMe, setRememberMe] = useState(() => {
        return !!localStorage.getItem('rememberedEmail');
    });

    const [formData, setFormData] = useState(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        return {
            first_name: '',
            last_name: '',
            email: savedEmail || '',
            password: ''
        };
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
        const payload = mode === 'login'
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            const res = await axios.post(`${BASE_URL}${endpoint}`, payload);

            // Lấy token và thông tin user từ cấu trúc JSON bạn gửi
            const { success, token, user } = res.data;

            if (success && token) {
                // 1. Lưu Token vào LocalStorage
                localStorage.setItem('token', token);

                // 2. Lưu thông tin User (để hiển thị tên, email ở các trang khác)
                localStorage.setItem('user', JSON.stringify(user));

                if (mode === 'login' && rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email);
                }

                setIsSuccess(true);

                setTimeout(() => {
                    // Gọi callback nếu có (để cập nhật state global ở App.js)
                    if (onLoginSuccess) onLoginSuccess(user);

                    // 3. LOGIC PHÂN QUYỀN ĐIỀU HƯỚNG TẠI ĐÂY
                    if (user.role && user.role.code === 'admin') {
                        navigate('/admin'); // Chuyển đến trang quản trị
                    } else {
                        navigate('/'); // Chuyển đến trang mua sắm cho user thường
                    }
                }, 1500);
            } else if (mode === 'register') {
                setMode('login');
                setError('Đăng ký thành công! Mời bạn đăng nhập.');
                setLoading(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white text-gray-900 overflow-hidden font-sans">
            {/* PANEL TRÁI: Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-orange-600 via-rose-600 to-amber-500 p-12 flex-col justify-between relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>

                <div className="relative z-10 flex items-center gap-2 font-black text-2xl tracking-tighter">
                    <div className="bg-white p-2 rounded-xl shadow-lg">
                        <Footprints className="text-orange-600" size={24} />
                    </div>
                    ShoeVibe
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold border border-white/20">
                        Version 2026 ✨
                    </div>
                    <h1 className="text-6xl font-black leading-tight tracking-tighter">
                        {mode === 'login' ? 'Đón đầu xu hướng giày.' : 'Gia nhập thế giới Sneaker.'}
                    </h1>
                    <p className="text-orange-100 text-xl max-w-md font-medium leading-relaxed opacity-90">
                        {mode === 'login'
                            ? 'Khám phá những mẫu giày mới nhất được cá nhân hóa theo phong cách của bạn.'
                            : 'Tạo tài khoản ngay để nhận ưu đãi và gợi ý giày độc quyền từ hệ thống AI.'}
                    </p>
                </div>

                <div className="relative z-10 text-orange-100/60 text-sm font-medium">
                    <span>© 2026 ShoeVibe Store.</span>
                </div>
            </div>

            {/* PANEL PHẢI: Form xử lý */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gray-50/50 relative">

                {isSuccess && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in zoom-in">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 text-center">Xác thực thành công!</h3>
                        <p className="text-gray-500 font-bold mt-2">Đang đưa bạn đến cửa hàng...</p>
                    </div>
                )}

                <div className={`max-w-md w-full transition-all duration-500 ${isSuccess ? 'scale-90 opacity-0 blur-xl' : 'opacity-100'}`}>

                    {/* Switch Mode Tab */}
                    <div className="flex bg-gray-200/60 p-1.5 rounded-2xl mb-10 shadow-inner">
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 font-black rounded-xl transition-all ${mode === 'login' ? 'bg-white shadow-md text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <LogIn size={20} /> Đăng nhập
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('register'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 font-black rounded-xl transition-all ${mode === 'register' ? 'bg-white shadow-md text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <UserPlus size={20} /> Đăng ký
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 text-center">
                            {mode === 'login' ? 'Chào mừng trở lại!' : 'Bắt đầu ngay hôm nay'}
                        </h2>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-orange-50 text-orange-600 text-sm rounded-2xl border border-orange-100 font-bold flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-600 shrink-0"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ</label>
                                    <input name="first_name" onChange={handleChange} required className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold" placeholder="Nguyễn" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên</label>
                                    <input name="last_name" onChange={handleChange} required className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold" placeholder="Hào" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold shadow-sm" placeholder="name@email.com" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold shadow-sm" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {mode === 'login' && (
                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-gray-200 text-orange-600 focus:ring-orange-500 cursor-pointer transition-all" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                    <span className="text-sm text-gray-500 font-black group-hover:text-gray-700">Lưu thông tin</span>
                                </label>
                                <button type="button" className="text-sm font-black text-orange-600 hover:underline">Quên mật khẩu?</button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || isSuccess}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4.5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-2xl shadow-orange-100 disabled:opacity-70 mt-6"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? "Đăng nhập ngay" : "Tạo tài khoản")}
                            {!loading && <ArrowRight size={22} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}