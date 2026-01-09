import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ChevronRight, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import RecommendationList from '../../components/RecommendationList';

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { updateCartCount } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [currentVariant, setCurrentVariant] = useState(null);

    // 1. Lấy chi tiết sản phẩm & Ghi nhận hành vi VIEW
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/detail/${slug}`);
                const data = response.data.data;
                setProduct(data);

                if (data.variants && data.variants.length > 0) {
                    setSelectedColor(data.variants[0].color);

                    // Tự động track 'view' cho biến thể đầu tiên khi vừa vào trang
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
    }, [slug]);

    // 2. Tìm biến thể (Variant) khớp với Màu và Size
    useEffect(() => {
        if (currentVariant?.id) {
            trackUserAction(currentVariant.id, 'view');
        }
    }, [currentVariant?.id]);

    // 2. Tìm biến thể (Variant) khớp với Màu và Size
    useEffect(() => {
        if (product && selectedColor && selectedSize) {
            const variant = product.variants.find(
                v => v.color === selectedColor && v.size === selectedSize
            );
            // SỬA LỖI TẠI ĐÂY: Sử dụng hàm đã khai báo
            setCurrentVariant(variant);
        } else {
            // Nếu chưa chọn đủ hoặc không tìm thấy, reset về null
            setCurrentVariant(null);
        }
    }, [selectedColor, selectedSize, product]);

    // Hàm trackUserAction (Đã tối ưu lấy userId)
    const trackUserAction = async (variant_id, action) => {
        try {
            const userStorage = localStorage.getItem('user');
            let userId = null;
            if (userStorage) {
                const userData = JSON.parse(userStorage);
                userId = userData.id;
            }

            await axios.post('http://localhost:5000/api/behavior/track', {
                variant_id,
                action,
                userId
            });
        } catch (err) {
            console.warn("Tracking error:", err.message);
        }
    };

    // 3. Logic Thêm vào giỏ hàng & Ghi nhận hành vi ADD_TO_CART
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
                'http://localhost:5000/api/cart/add',
                { variant_id: currentVariant.id, quantity: quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                toast.success("Đã thêm vào giỏ hàng thành công!");
                updateCartCount();

                // Ghi nhận hành vi add_to_cart vào hệ thống recommendation
                trackUserAction(currentVariant.id, 'add_to_cart');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center italic text-gray-400">Đang tải siêu phẩm...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center font-bold">Không tìm thấy sản phẩm.</div>;

    const colors = [...new Set(product.variants.map(v => v.color))];
    const sizesForColor = product.variants
        .filter(v => v.color === selectedColor)
        .map(v => ({ size: v.size, stock: v.stock }));

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1000);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
                <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                <ChevronRight size={14} className="text-gray-300" />
                <Link to="/products" className="hover:text-blue-600 transition-colors">Sản phẩm</Link>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="text-gray-900 font-bold truncate">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Ảnh sản phẩm */}
                <div className="aspect-square rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                    <img
                        src={product.image?.startsWith('http') ? product.image : `http://localhost:5000/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Thông tin chi tiết */}
                <div className="flex flex-col">
                    <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
                        {product.name}
                    </h1>

                    <div className="mb-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                        <p className="text-blue-600 font-black text-3xl">
                            {currentVariant ? formatPrice(currentVariant.price) : "Chọn size để xem giá"}
                        </p>
                    </div>

                    {/* Chọn Màu */}
                    <div className="mb-6">
                        <p className="text-sm font-bold uppercase mb-3 tracking-widest text-gray-400">Màu sắc: <span className="text-gray-900">{selectedColor}</span></p>
                        <div className="flex gap-3">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => { setSelectedColor(color); setSelectedSize(null); }}
                                    className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${selectedColor === color ? 'border-blue-600 scale-110 shadow-lg' : 'border-transparent'}`}
                                >
                                    <div className="w-full h-full rounded-full border border-gray-100" style={{ backgroundColor: color }} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chọn Size */}
                    <div className="mb-8">
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

                    {/* Chọn Số lượng */}
                    <div className="mb-10">
                        <p className="text-sm font-bold uppercase mb-3 tracking-widest text-gray-400">Số lượng</p>
                        <div className="flex items-center gap-4 bg-gray-50 w-fit p-1 rounded-2xl border">
                            <button
                                type="button"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all shadow-sm"
                            >
                                <Minus size={16} />
                            </button>

                            <span className="w-8 text-center font-bold text-lg">{quantity}</span>

                            <button
                                type="button"
                                onClick={() => setQuantity(prev => Math.min(currentVariant?.stock || 99, prev + 1))}
                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all shadow-sm"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Nút Thêm vào giỏ */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!currentVariant || currentVariant.stock === 0 || isSubmitting}
                        className="w-full bg-black text-white py-5 rounded-2rem font-black uppercase text-sm tracking-widest hover:bg-gray-800 transition-all disabled:bg-gray-200 flex items-center justify-center gap-3 shadow-xl"
                    >
                        {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ShoppingCart size={20} /> Thêm vào giỏ hàng</>}
                    </button>

                    {/* Chính sách */}
                    <div className="grid grid-cols-1 gap-4 pt-8 mt-10 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <Truck size={20} className="text-blue-600" /> Miễn phí vận chuyển cho đơn trên 1 triệu
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <ShieldCheck size={20} className="text-blue-600" /> Hàng chính hãng 100%
                        </div>
                    </div>
                </div>
            </div>

            {/* Mô tả & HỆ THỐNG GỢI Ý */}
            <div className="mt-24">
                <div className="max-w-3xl mb-20">
                    <h2 className="text-2xl font-black uppercase italic mb-6">Mô tả sản phẩm</h2>
                    <div className="text-gray-500 leading-relaxed whitespace-pre-line bg-gray-50 p-8 rounded-2rem">
                        {product.description}
                    </div>
                </div>

                {/* RENDER RECOMMENDATIONS */}
                <RecommendationList
                    currentVariantId={currentVariant?.id || product.variants[0]?.id}
                />
            </div>
        </div>
    );
};

export default ProductDetail;