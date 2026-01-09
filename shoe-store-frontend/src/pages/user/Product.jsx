/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, PackageOpen, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom'; // Thêm Link để điều hướng
import Pagination from '../../components/Pagination';

// --- COMPONENT CON: PRODUCT CARD ---
const ProductCard = ({ product }) => {
    // Hàm định dạng tiền tệ Việt Nam
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price * 1000); 
    };

    const hasMultiplePrices = product.minPrice !== product.maxPrice;

    return (
        // Sử dụng Link và trỏ đến slug của sản phẩm
        <Link 
            to={`/product/${product.slug}`} 
            className="group bg-white rounded-4xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 flex flex-col h-full"
        >
            {/* Khung ảnh */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={product.image?.startsWith('http') ? product.image : `http://localhost:5000/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Badge trạng thái */}
                {product.totalStock === 0 ? (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-10">
                        HẾT HÀNG
                    </div>
                ) : (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        MỚI VỀ
                    </div>
                )}

                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <div className="bg-white text-black p-4 rounded-2xl shadow-xl translate-y-10 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 font-bold text-sm">
                        <Eye size={18} />
                        Xem chi tiết
                    </div>
                </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="p-6 flex flex-col grow">
                <h3 className="font-bold text-gray-800 line-clamp-1 text-sm uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>

                {/* Hiển thị danh sách màu sắc */}
                <div className="flex gap-1.5 mb-4">
                    {product.colors && product.colors.length > 0 ? (
                        product.colors.map((color, index) => (
                            <div
                                key={index}
                                className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-inner"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))
                    ) : (
                        <span className="text-[10px] text-gray-400 italic">Liên hệ màu sắc</span>
                    )}
                </div>

                {/* Giá tiền */}
                <div className="mt-auto">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Giá bán lẻ</p>
                    <div className="text-blue-600 font-black text-lg flex items-baseline gap-1">
                        {product.minPrice === 0 ? (
                            "Liên hệ"
                        ) : hasMultiplePrices ? (
                            <>
                                <span className="text-sm text-gray-400 font-medium lowercase">từ</span>
                                {formatPrice(product.minPrice)}
                            </>
                        ) : (
                            formatPrice(product.minPrice)
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- COMPONENT CHÍNH: PRODUCT PAGE ---
const Product = () => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 8;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Đổi endpoint thành /home để lấy data đã xử lý slug và min/max price
            const response = await axios.get(`http://localhost:5000/api/products/variants`, {
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
        fetchProducts();
    }, [currentPage, searchTerm]);

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20">
            {/* Header & Bộ lọc */}
            <div className="max-w-7xl mx-auto px-6 pt-12 mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
                            The Shop <span className="text-blue-600">.</span>
                        </h1>
                        <p className="text-gray-400 font-medium tracking-tight">
                            Hiện có <span className="text-gray-900 font-bold">{total}</span> mẫu giày sẵn sàng cho bạn
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        <input
                            type="text"
                            placeholder="Bạn đang tìm mẫu nào?..."
                            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none text-sm font-medium"
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Grid Sản phẩm */}
            <div className="max-w-7xl mx-auto px-6">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-200/50 animate-pulse rounded-4xl" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Phân trang */}
                        <div className="flex justify-center mt-20">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(total / pageSize) || 1}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-300">
                        <PackageOpen size={80} strokeWidth={1} className="mb-4 opacity-20" />
                        <p className="font-medium">Rất tiếc, chúng tôi không tìm thấy mẫu này...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;