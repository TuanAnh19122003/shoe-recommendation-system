import React from 'react';
import { ArrowRight, Star, ShoppingCart, Heart } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section - Responsive: Chuyển từ 1 cột (mobile) sang 2 cột (desktop) */}
            <section className="relative bg-gray-900 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left z-10">
                        <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">Bộ sưu tập 2026</span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mt-4 leading-tight">
                            BƯỚC ĐI CÙNG <br /> <span className="text-blue-600">SỰ KHÁC BIỆT</span>
                        </h1>
                        <p className="text-gray-400 mt-6 text-lg max-w-lg mx-auto md:mx-0">
                            Trải nghiệm công nghệ đệm khí tiên tiến và thiết kế thời thượng nhất hiện nay.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
                                Mua sắm ngay
                            </button>
                            <button className="px-8 py-4 bg-white/10 text-white rounded-full font-bold border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                                Xem bộ sưu tập
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full"></div>
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"
                            alt="Hero Shoe"
                            className="relative z-10 w-full h-auto object-contain rotate-[-15deg] hover:rotate-0 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* Product Grid - Responsive: 1 cột (mobile) -> 2 cột (tablet) -> 3 cột (laptop) -> 4 cột (desktop) */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase">Sản phẩm bán chạy</h2>
                        <div className="h-1 w-20 bg-blue-600 mt-2"></div>
                    </div>
                    <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        Xem tất cả <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((id) => (
                        <div key={id} className="group relative bg-white rounded-3xl p-4 border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300">
                            {/* Action Buttons */}
                            <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <button className="p-3 bg-white shadow-md rounded-full text-gray-400 hover:text-red-500 transition-colors"><Heart size={18} /></button>
                            </div>

                            <div className="aspect-square bg-gray-50 rounded-2xl mb-6 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070"
                                    alt="Product"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            <div className="px-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Lifestyle</p>
                                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Jordan Retro High</h3>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-600 text-xs font-bold">
                                        <Star size={12} fill="currentColor" /> 4.9
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <span className="text-2xl font-black text-gray-900">$210.00</span>
                                    <button className="p-3 bg-gray-900 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-90">
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;