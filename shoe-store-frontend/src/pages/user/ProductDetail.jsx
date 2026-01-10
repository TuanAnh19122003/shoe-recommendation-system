/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ChevronRight, ShieldCheck, Truck, Plus, Minus, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import RecommendationList from '../../components/RecommendationList';

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { updateCartCount } = useCart();

    // Biến môi trường
    const API_URL = import.meta.env.VITE_API_URL;
    const BASE_URL = API_URL.replace('/api', '');

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [currentVariant, setCurrentVariant] = useState(null);

    // 1. Lấy chi tiết sản phẩm
    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/products/detail/${slug}`);
                const data = response.data.data;
                setProduct(data);

                if (data.variants && data.variants.length > 0) {
                    // Chọn màu đầu tiên mặc định
                    setSelectedColor(data.variants[0].color);
                    // Track view cho sản phẩm tổng quát hoặc biến thể đầu
                    trackUserAction(data.variants[0].id, 'view');
                }
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
                toast.error("Không thể tải thông tin sản phẩm");
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi đổi slug
    }, [slug]);

    // 2. Tìm biến thể khớp với Màu và Size
    useEffect(() => {
        if (product && selectedColor && selectedSize) {
            const variant = product.variants.find(
                v => v.color === selectedColor && v.size === selectedSize
            );
            setCurrentVariant(variant);
            
            // Nếu tìm thấy biến thể cụ thể, track view cho biến thể đó
            if (variant) {
                trackUserAction(variant.id, 'view');
            }
        } else {
            setCurrentVariant(null);
        }
    }, [selectedColor, selectedSize, product]);

    // Hàm trackUserAction (Gửi dữ liệu về AI Recommendation)
    const trackUserAction = async (variant_id, action) => {
        try {
            const userStorage = localStorage.getItem('user');
            let userId = null;
            if (userStorage) {
                const userData = JSON.parse(userStorage);
                userId = userData.id;
            }

            await axios.post(`${API_URL}/behavior/track`, {
                variant_id,
                action,
                userId
            });
        } catch (err) {
            console.warn("Tracking hint:", action, err.message);
        }
    };

    const handleAddToCart = async () => {
        if (!currentVariant) {
            toast.error("Vui lòng chọn Kích cỡ!");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Vui lòng đăng nhập để mua hàng!");
            navigate('/auth/login');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.post(
                `${API_URL}/cart/add`,
                { variant_id: currentVariant.id, quantity: quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                toast.success("Đã thêm vào giỏ hàng!");
                updateCartCount();
                trackUserAction(currentVariant.id, 'add_to_cart');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Loading Sneaker...</p>
        </div>
    );

    if (!product) return <div className="min-h-screen flex items-center justify-center font-bold">Không tìm thấy sản phẩm.</div>;

    const colors = [...new Set(product.variants.map(v => v.color))];
    const sizesForColor = product.variants
        .filter(v => v.color === selectedColor)
        .map(v => ({ size: v.size, stock: v.stock }));

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1000);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
            <Toaster position="bottom-right" reverseOrder={false} />

            {/* Breadcrumb - Minimalist style */}
            <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-12">
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <ChevronRight size={10} />
                <Link to="/products" className="hover:text-blue-600 transition-colors">Shop</Link>
                <ChevronRight size={10} />
                <span className="text-slate-900 truncate">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                {/* Ảnh sản phẩm - Sticky on Desktop */}
                <div className="lg:sticky lg:top-32 aspect-square rounded-[3.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl shadow-slate-200/50 group">
                    <img
                        src={product.image?.startsWith('http') ? product.image : `${BASE_URL}/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                        onError={(e) => { e.target.src = 'https://placehold.co/800x800?text=Product'; }}
                    />
                </div>

                {/* Thông tin chi tiết */}
                <div className="flex flex-col">
                    <div className="mb-10">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Chính hãng 100%
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.9] mb-6">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <p className="text-4xl font-black text-blue-600 tracking-tighter italic">
                                {currentVariant ? formatPrice(currentVariant.price) : formatPrice(product.variants[0].price)}
                            </p>
                            {!currentVariant && (
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-bounce">
                                    ← Chọn size để cập nhật giá
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Chọn Màu */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Màu sắc: <span className="text-slate-900 ml-2">{selectedColor}</span></p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => { setSelectedColor(color); setSelectedSize(null); }}
                                    className={`w-12 h-12 rounded-2xl border-2 transition-all p-1 group ${selectedColor === color ? 'border-slate-900 scale-110 shadow-xl' : 'border-transparent hover:border-slate-200'}`}
                                >
                                    <div className="w-full h-full rounded-xl border border-slate-100 shadow-inner" style={{ backgroundColor: color }} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chọn Size */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Kích cỡ US/EU</p>
                            <button className="text-[10px] font-bold text-blue-600 underline flex items-center gap-1">
                                <Info size={12} /> Bảng size
                            </button>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                            {sizesForColor.map(({ size, stock }) => (
                                <button
                                    key={size}
                                    disabled={stock === 0}
                                    onClick={() => setSelectedSize(size)}
                                    className={`h-14 rounded-2xl text-xs font-black transition-all border-2 flex flex-col items-center justify-center
                                        ${stock === 0 ? 'bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed grayscale' :
                                            selectedSize === size ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-400' : 'bg-white border-slate-100 text-slate-800 hover:border-slate-900'}`}
                                >
                                    {size}
                                    {stock < 5 && stock > 0 && <span className="text-[8px] font-normal opacity-70">Sắp hết</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Số lượng & Nút Add */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <div className="flex items-center justify-between bg-slate-100 p-2 rounded-1.5rem border-2 border-slate-100 w-full sm:w-40">
                            <button
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:scale-95 transition-transform"
                            >
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="font-black text-lg italic">{quantity}</span>
                            <button
                                onClick={() => setQuantity(prev => Math.min(currentVariant?.stock || 99, prev + 1))}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:scale-95 transition-transform"
                            >
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!currentVariant || currentVariant.stock === 0 || isSubmitting}
                            className="flex-1 bg-blue-600 text-white py-5 rounded-1.5rem font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:shadow-none group"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <><ShoppingCart size={18} className="group-hover:-translate-y-1 transition-transform" /> {currentVariant?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}</>
                            )}
                        </button>
                    </div>

                    {/* Chính sách - Card style */}
                    <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 rounded-2rem border border-slate-100">
                        <div className="flex flex-col gap-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                                <Truck size={16} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Miễn phí giao hàng</p>
                            <p className="text-[10px] text-slate-400 font-medium">Cho hóa đơn từ 1.000.000đ</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                                <ShieldCheck size={16} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Bảo hành 12 tháng</p>
                            <p className="text-[10px] text-slate-400 font-medium">Cam kết hàng Auth 100%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs/Description */}
            <div className="mt-32">
                <div className="flex gap-12 border-b border-slate-100 mb-12">
                    <button className="pb-6 border-b-2 border-slate-900 text-[11px] font-black uppercase tracking-[0.3em]">Mô tả chi tiết</button>
                    <button className="pb-6 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">Đánh giá (0)</button>
                </div>
                <div className="max-w-4xl">
                    <div className="text-slate-500 leading-loose text-sm font-medium whitespace-pre-line bg-white rounded-2rem">
                        {product.description}
                    </div>
                </div>

                {/* HỆ THỐNG GỢI Ý - Truyền variant ID hiện tại */}
                <div className="mt-32">
                    <RecommendationList
                        currentVariantId={currentVariant?.id || product.variants[0]?.id}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;