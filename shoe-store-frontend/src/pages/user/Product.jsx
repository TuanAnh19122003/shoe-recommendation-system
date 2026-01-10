/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, PackageOpen, Eye, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';

// --- COMPONENT CON: PRODUCT CARD ---
const ProductCard = ({ product, baseUrl }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price * 1000); 
    };

    const hasMultiplePrices = product.minPrice !== product.maxPrice;
    const imgUrl = product.image?.startsWith('http') 
        ? product.image 
        : `${baseUrl}/${product.image}`;

    return (
        <Link 
            to={`/product/${product.slug}`} 
            className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full"
        >
            {/* Khung ảnh */}
            <div className="relative aspect-4/5 overflow-hidden bg-slate-50">
                <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x800?text=Sneaker'; }}
                />

                {/* Badge trạng thái */}
                <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                    {product.totalStock === 0 ? (
                        <span className="bg-rose-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                            Hết hàng
                        </span>
                    ) : (
                        <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-slate-100">
                            New Arrival
                        </span>
                    )}
                </div>

                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white text-slate-900 px-6 py-3 rounded-2xl shadow-2xl translate-y-10 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                        <Eye size={16} /> Chi tiết
                    </div>
                </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-3">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                        {product.category || 'Lifestyle'}
                    </p>
                    <div className="flex -space-x-1">
                        {product.colors?.slice(0, 3).map((color, index) => (
                            <div
                                key={index}
                                className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        {product.colors?.length > 3 && (
                            <span className="text-[9px] font-bold text-slate-400 pl-1">+{product.colors.length - 3}</span>
                        )}
                    </div>
                </div>

                <h3 className="font-black text-slate-800 line-clamp-2 text-sm uppercase italic tracking-tighter mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {product.name}
                </h3>

                <div className="mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-blue-600 font-black text-xl italic tracking-tighter">
                            {product.minPrice === 0 ? "Liên hệ" : formatPrice(product.minPrice)}
                        </span>
                        {hasMultiplePrices && (
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                                Trở lên
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- COMPONENT CHÍNH ---
const Product = () => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 8;

    const API_URL = import.meta.env.VITE_API_URL;
    const BASE_URL = API_URL.replace('/api', '');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/products/variants`, {
                params: {
                    page: currentPage,
                    pageSize: pageSize,
                    search: searchTerm
                }
            });
            setProducts(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search để tránh spam API
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, searchTerm]);

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-24">
            {/* Hero Header Section */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <Filter size={12} /> Bộ sưu tập mới nhất
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                All Products<span className="text-blue-600">.</span>
                            </h1>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                                Khám phá <span className="text-slate-900">{total}</span> tuyệt phẩm sneaker
                            </p>
                        </div>

                        <div className="relative w-full md:w-400px">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên sản phẩm..."
                                className="w-full pl-14 pr-8 py-5 bg-slate-50 border-none rounded-2rem focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner"
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Sản phẩm */}
            <div className="max-w-7xl mx-auto px-6 mt-16">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse flex flex-col space-y-4">
                                <div className="aspect-4/5 bg-slate-100 rounded-[2.5rem]" />
                                <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                                <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} baseUrl={BASE_URL} />
                            ))}
                        </div>

                        {/* Phân trang */}
                        <div className="mt-20 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(total / pageSize) || 1}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 text-slate-200">
                        <div className="p-8 bg-slate-50 rounded-full mb-6">
                            <PackageOpen size={60} strokeWidth={1} />
                        </div>
                        <p className="font-black uppercase tracking-widest text-sm text-slate-400">Không tìm thấy sản phẩm phù hợp</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;