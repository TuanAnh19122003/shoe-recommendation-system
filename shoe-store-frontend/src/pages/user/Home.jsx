/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, ShoppingCart, Heart, Zap, ShieldCheck, Truck } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy URL từ biến môi trường
    const API_URL = import.meta.env.VITE_API_URL;
    const BASE_URL = API_URL.replace('/api', '');

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                // Gọi API lấy sản phẩm
                const response = await axios.get(`${API_URL}/products`);
                // Lấy 8 sản phẩm mới nhất
                setProducts(response.data.data.slice(0, 8)); 
            } catch (error) {
                console.error("Lỗi lấy dữ liệu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopProducts();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(price * 1000);
    };

    return (
        <div className="bg-white">
            {/* HERO SECTION */}
            <section className="relative bg-[#0a0a0a] overflow-hidden min-h-[80vh] flex items-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 mb-6">
                            <Zap size={14} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Collection 2026</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
                            Bứt phá <br /> 
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-400">
                                Mọi giới hạn
                            </span>
                        </h1>
                        <p className="text-slate-400 mt-8 text-lg max-w-lg font-medium leading-relaxed">
                            Khám phá những mẫu giày Sneaker với công nghệ tối tân nhất, định hình phong cách đường phố tương lai.
                        </p>
                        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                            <Link to="/products" className="group px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-3">
                                Mua ngay <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-blue-600/30 blur-[150px] rounded-full animate-pulse"></div>
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"
                            alt="Hero Shoe"
                            className="relative z-10 w-full h-auto object-contain rotate-[-15deg] drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-all duration-700 hover:rotate-0"
                        />
                    </div>
                </div>
            </section>

            {/* TRUST INDICATORS */}
            <section className="border-y border-slate-100 py-10 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-4 justify-center">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600"><Truck size={24} /></div>
                        <div>
                            <p className="font-black uppercase text-[10px] tracking-widest">Giao hàng hỏa tốc</p>
                            <p className="text-xs text-slate-500 font-bold">Miễn phí cho đơn từ 2tr</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600"><ShieldCheck size={24} /></div>
                        <div>
                            <p className="font-black uppercase text-[10px] tracking-widest">Bảo hành 12 tháng</p>
                            <p className="text-xs text-slate-500 font-bold">Cam kết chính hãng 100%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600"><Star size={24} /></div>
                        <div>
                            <p className="font-black uppercase text-[10px] tracking-widest">Hỗ trợ 24/7</p>
                            <p className="text-xs text-slate-500 font-bold">Tư vấn size tận tình</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCT GRID */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                <div className="flex items-end justify-between mb-16">
                    <div>
                        <p className="text-blue-600 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Trendings</p>
                        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Sản phẩm nổi bật</h2>
                    </div>
                    <Link to="/products" className="group flex items-center gap-3 text-slate-900 font-black uppercase text-xs tracking-widest hover:text-blue-600 transition-colors">
                        Xem tất cả <div className="p-2 bg-slate-100 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all"><ArrowRight size={14} /></div>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse bg-slate-100 rounded-2rem aspect-3/4"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => {
                            const price = product.variants?.[0]?.price || 0;
                            const imgUrl = product.image?.startsWith('http') 
                                ? product.image 
                                : `${BASE_URL}/${product.image}`;

                            return (
                                <div key={product.id} className="group relative">
                                    <Link to={`/product/${product.slug}`} className="block">
                                        <div className="relative aspect-4/5 bg-slate-100 rounded-2rem overflow-hidden mb-6">
                                            <img
                                                src={imgUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                                <button className="p-4 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl text-slate-900 hover:bg-black hover:text-white transition-all">
                                                    <Heart size={18} />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                    <Star size={10} fill="#facc15" className="text-yellow-400" />
                                                    <span className="text-[10px] font-black">4.9</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {product.category || 'Lifestyle'}
                                            </p>
                                            <h3 className="font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors truncate">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-black text-slate-900 italic tracking-tighter">
                                                    {formatPrice(price)}
                                                </span>
                                                <div className="p-3 rounded-2xl bg-slate-900 text-white group-hover:bg-blue-600 transition-colors">
                                                    <ShoppingCart size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;