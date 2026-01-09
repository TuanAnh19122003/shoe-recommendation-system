import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, ShoppingCart, Heart } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Lấy dữ liệu sản phẩm từ API khi trang load
    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                // Thay URL này bằng API lấy danh sách sản phẩm của bạn
                const response = await axios.get('http://localhost:5000/api/products');
                // Lấy 8 sản phẩm mới nhất hoặc bán chạy
                setProducts(response.data.data.slice(0, 8)); 
            } catch (error) {
                console.error("Lỗi lấy dữ liệu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopProducts();
    }, []);

    // Hàm helper định dạng giá tiền (Giống ProductDetail)
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(price * 1000);
    };

    return (
        <div className="bg-white">
            {/* Hero Section - Giữ nguyên giao diện đẹp của bạn */}
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
                            <Link to="/products" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all text-center">
                                Mua sắm ngay
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full"></div>
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"
                            alt="Hero Shoe"
                            className="relative z-10 w-full h-auto object-contain rotate-[-15deg]"
                        />
                    </div>
                </div>
            </section>

            {/* Product Grid - DỮ LIỆU ĐỘNG TẠI ĐÂY */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase">Sản phẩm nổi bật</h2>
                        <div className="h-1 w-20 bg-blue-600 mt-2"></div>
                    </div>
                    <Link to="/products" className="text-blue-600 font-bold flex items-center gap-2">
                        Xem tất cả <ArrowRight size={18} />
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 italic text-gray-400">Đang tải sản phẩm...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => {
                            // Lấy giá từ biến thể đầu tiên
                            const firstVariant = product.variants?.[0];
                            const price = firstVariant ? firstVariant.price : 0;
                            
                            // Xử lý ảnh
                            const imgUrl = product.image?.startsWith('http') 
                                ? product.image 
                                : `http://localhost:5000/${product.image}`;

                            return (
                                <div key={product.id} className="group relative bg-white rounded-3xl p-4 border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300">
                                    <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-3 bg-white shadow-md rounded-full text-gray-400 hover:text-red-500"><Heart size={18} /></button>
                                    </div>

                                    {/* Link dẫn tới trang chi tiết dựa vào slug */}
                                    <Link to={`/product/${product.slug}`}>
                                        <div className="aspect-square bg-gray-50 rounded-2xl mb-6 overflow-hidden">
                                            <img
                                                src={imgUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="px-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                                        {product.category || 'Mới nhất'}
                                                    </p>
                                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                        {product.name}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-600 text-xs font-bold">
                                                    <Star size={12} fill="currentColor" /> 5.0
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-between">
                                                <span className="text-xl font-black text-gray-900">
                                                    {formatPrice(price)}
                                                </span>
                                                <div className="p-3 bg-gray-900 text-white rounded-xl group-hover:bg-blue-600 transition-all">
                                                    <ShoppingCart size={18} />
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