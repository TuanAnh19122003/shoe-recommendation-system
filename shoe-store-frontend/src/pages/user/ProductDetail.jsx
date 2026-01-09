import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Thêm Link để điều hướng
import { ShoppingCart, ChevronRight, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // State cho việc chọn biến thể
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [currentVariant, setCurrentVariant] = useState(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/detail/${slug}`);
                const data = response.data.data;
                setProduct(data);

                // Mặc định chọn màu đầu tiên nếu có
                if (data.variants.length > 0) {
                    setSelectedColor(data.variants[0].color);
                }
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [slug]);

    // Cập nhật biến thể hiện tại khi Color hoặc Size thay đổi
    useEffect(() => {
        if (product && selectedColor && selectedSize) {
            const variant = product.variants.find(
                v => v.color === selectedColor && v.size === selectedSize
            );
            setCurrentVariant(variant);
        } else {
            setCurrentVariant(null);
        }
    }, [selectedColor, selectedSize, product]);

    if (loading) return <div className="min-h-screen flex items-center justify-center italic text-gray-400">Đang tải siêu phẩm...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center font-bold">Không tìm thấy sản phẩm.</div>;

    // Lấy danh sách màu sắc duy nhất
    const colors = [...new Set(product.variants.map(v => v.color))];

    // Lấy danh sách size duy nhất dựa trên màu đã chọn
    const sizesForColor = product.variants
        .filter(v => v.color === selectedColor)
        .map(v => ({ size: v.size, stock: v.stock }));

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1000);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
                {/* Trang chủ */}
                <Link
                    to="/"
                    className="hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                    Trang chủ
                </Link>

                <ChevronRight size={14} className="text-gray-300" />

                {/* Danh mục Sản phẩm */}
                <Link
                    to="/products"
                    className="hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                    Sản phẩm
                </Link>

                <ChevronRight size={14} className="text-gray-300" />

                {/* Tên sản phẩm hiện tại */}
                <span className="text-gray-900 font-bold truncate max-w-50 md:max-w-none">
                    {product.name}
                </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* 1. Bên trái: Hình ảnh */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                        <img
                            src={product.image?.startsWith('http') ? product.image : `http://localhost:5000/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* 2. Bên phải: Thông tin & Chọn biến thể */}
                <div className="flex flex-col">
                    <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
                        {product.name}
                    </h1>

                    {/* Hiển thị Giá dựa trên biến thể được chọn */}
                    <div className="mb-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                        <p className="text-blue-600 font-black text-3xl">
                            {currentVariant ? formatPrice(currentVariant.price) : "Chọn size & màu để xem giá"}
                        </p>
                        {currentVariant && (
                            <p className="text-xs text-blue-400 mt-2 font-bold uppercase tracking-widest">
                                {currentVariant.stock > 0 ? `Còn hàng (${currentVariant.stock} sản phẩm)` : "Hết hàng"}
                            </p>
                        )}
                    </div>

                    {/* Chọn Màu Sắc */}
                    <div className="mb-6">
                        <p className="text-sm font-bold uppercase mb-3 tracking-widest text-gray-400">Màu sắc: <span className="text-gray-900">{selectedColor}</span></p>
                        <div className="flex gap-3">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => { setSelectedColor(color); setSelectedSize(null); }}
                                    className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${selectedColor === color ? 'border-blue-600 scale-110 shadow-lg' : 'border-transparent'}`}
                                >
                                    <div className="w-full h-full rounded-full border border-gray-100 shadow-inner" style={{ backgroundColor: color }} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chọn Kích Thước */}
                    <div className="mb-10">
                        <p className="text-sm font-bold uppercase mb-3 tracking-widest text-gray-400">Kích cỡ (Size)</p>
                        <div className="grid grid-cols-4 gap-2">
                            {sizesForColor.map(({ size, stock }) => (
                                <button
                                    key={size}
                                    disabled={stock === 0}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-3 rounded-2xl text-sm font-bold transition-all border-2 
                                        ${stock === 0 ? 'bg-gray-50 border-gray-50 text-gray-200 cursor-not-allowed' :
                                            selectedSize === size ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-gray-100 text-gray-800 hover:border-blue-200'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Nút Hành Động */}
                    <div className="flex gap-4 mb-10">
                        <button
                            disabled={!currentVariant || currentVariant.stock === 0}
                            className="flex-1 bg-black text-white py-5 rounded-2rem font-black uppercase text-sm tracking-widest hover:bg-gray-800 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            <ShoppingCart size={20} />
                            Thêm vào giỏ hàng
                        </button>
                    </div>

                    {/* Chính sách đi kèm */}
                    <div className="grid grid-cols-1 gap-4 pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <Truck size={20} className="text-blue-600" /> Miễn phí vận chuyển cho đơn trên 1 triệu
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <ShieldCheck size={20} className="text-blue-600" /> Hàng chính hãng 100%
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <RefreshCcw size={20} className="text-blue-600" /> Đổi trả trong 7 ngày nếu lỗi
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần Mô Tả */}
            <div className="mt-24 max-w-3xl">
                <h2 className="text-2xl font-black uppercase italic mb-6">Mô tả sản phẩm</h2>
                <div className="text-gray-500 leading-relaxed space-y-4">
                    {product.description}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;