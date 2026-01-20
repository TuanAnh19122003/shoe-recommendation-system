import React, { useState, useEffect } from 'react';
import { ArrowRight, Layers, Star, Zap, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Collections = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/categories`);
                setCategories(response.data.data);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
                // Dữ liệu fallback chất lượng cao
                setCategories([
                    { id: 1, name: 'Performance Running', slug: 'running', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200', count: 42, desc: 'Tối ưu tốc độ và sự bền bỉ cho mỗi sải bước.' },
                    { id: 2, name: 'Heritage Basketball', slug: 'basketball', image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1200', count: 28, desc: 'Lấy cảm hứng từ những huyền thoại trên sân đấu.' },
                    { id: 3, name: 'Streetwear Essentials', slug: 'lifestyle', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1200', count: 156, desc: 'Phong cách định hình bản sắc cá nhân hàng ngày.' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [API_URL]);

    return (
        <div className="min-h-screen bg-[#fcfcfc]">
            {/* 1. HERO SECTION & BREADCRUMB */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white shadow-2xl">
                            <Zap size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">The 2026 Universe</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.8]">
                            World Of<br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">Series.</span>
                        </h1>
                        <p className="max-w-xl text-slate-500 font-medium text-lg leading-relaxed">
                            Từ những đường chạy chuyên nghiệp đến phong cách đường phố bụi bặm, khám phá thế giới Sneaker đa tầng của chúng tôi.
                        </p>
                    </div>
                </div>
                {/* Trang trí nền */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-1/2 z-0" />
            </section>

            {/* 2. STATS BAR */}
            <section className="max-w-7xl mx-auto px-6 mb-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                    {[
                        { label: 'Sản phẩm', value: '2,500+' },
                        { label: 'Cộng tác', value: '40+ Brands' },
                        { label: 'Khách hàng', value: '150k' },
                        { label: 'Đánh giá', value: '4.9/5' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl font-black text-slate-900 italic tracking-tighter">{stat.value}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. MAIN GRID */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="flex items-end justify-between mb-12">
                    <div className="space-y-2">
                        <p className="text-blue-600 font-black uppercase text-xs tracking-widest">Phân loại</p>
                        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Chọn hành trình của bạn</h2>
                    </div>
                    <div className="hidden md:block h-px flex-1 mx-12 bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {loading ? (
                        [1, 2, 3].map((n) => (
                            <div key={n} className="md:col-span-4 h-600px bg-slate-100 rounded-[3.5rem] animate-pulse" />
                        ))
                    ) : (
                        categories.map((category, index) => (
                            <div 
                                key={category.id} 
                                className={`${index === 0 ? 'md:col-span-8' : 'md:col-span-4'} group relative h-600px overflow-hidden rounded-[3.5rem] bg-slate-900`}
                            >
                                <img 
                                    src={category.image} 
                                    alt={category.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                                />
                                
                                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                                
                                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-px w-8 bg-blue-500" />
                                        <p className="text-blue-400 font-black text-xs uppercase tracking-widest">
                                            {category.count} Mẫu mã
                                        </p>
                                    </div>
                                    
                                    <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4 group-hover:-translate-y-2 transition-transform duration-500">
                                        {category.name}
                                    </h3>
                                    
                                    <p className="text-slate-300 font-medium max-w-sm mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                        {category.desc || 'Khám phá những công nghệ mới nhất trong dòng sản phẩm này.'}
                                    </p>

                                    <Link 
                                        to={`/products?category=${category.slug}`}
                                        className="inline-flex items-center gap-3 w-fit bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-colors group-hover:shadow-2xl shadow-white/10"
                                    >
                                        Xem chi tiết <MoveRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* 4. NEWSLETTER SECTION */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="bg-blue-600 rounded-[4rem] p-12 md:p-24 relative overflow-hidden text-center md:text-left">
                    <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
                                Đừng bỏ lỡ <br />Những đợt Drop tiếp theo
                            </h2>
                            <p className="text-blue-100 font-medium italic">Nhận thông báo sớm nhất về các dòng Limited Edition.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input 
                                type="email" 
                                placeholder="Email của bạn..."
                                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-8 py-5 text-white placeholder:text-blue-200 outline-none focus:bg-white/20 transition-all"
                            />
                            <button className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl">
                                Đăng ký
                            </button>
                        </div>
                    </div>
                    {/* Background Icon trang trí */}
                    <Layers className="absolute -bottom-10 -right-10 w-80 h-80 text-white/5 -rotate-12" />
                </div>
            </section>
        </div>
    );
};

export default Collections;