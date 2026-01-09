import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecommendationList = ({ currentVariantId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRecs = async () => {
            if (!currentVariantId || currentVariantId === 'undefined') return;

            try {
                setLoading(true);
                // Gọi API lấy gợi ý
                const res = await axios.get(`http://localhost:5000/api/behavior/recommendations/${currentVariantId}`);
                setRecommendations(res.data.data);
            } catch (err) {
                console.error("Lỗi API Recommendation:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRecs();
    }, [currentVariantId]);

    if (loading) return <div className="py-10 text-center italic text-gray-400">Đang tìm sản phẩm bạn có thể thích...</div>;
    if (recommendations.length === 0) return null;

    return (
        <div className="mt-20">
            <h2 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Có thể bạn cũng thích</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recommendations.map((item) => {
                    const variant = item.variant;
                    const prod = variant?.product;

                    // Xử lý logic ảnh: ưu tiên ảnh từ variant hoặc ảnh chính của product
                    const rawImg = prod?.image;
                    const imgUrl = rawImg
                        ? (rawImg.startsWith('http') ? rawImg : `http://localhost:5000/${rawImg}`)
                        : 'https://via.placeholder.com/300';

                    return (
                        <Link
                            to={`/product/${prod?.slug}`}
                            key={item.variant_id}
                            className="group bg-white p-4 rounded-2rem border border-gray-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500"
                        >
                            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
                                <img
                                    src={imgUrl}
                                    alt={prod?.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="font-bold text-gray-900 line-clamp-1">{prod?.name}</h3>
                            <p className="text-blue-600 font-black mt-1">
                                {((variant?.price || 0) * 1000).toLocaleString('vi-VN')} ₫
                            </p>
                            <div className="mt-2 text-[10px] text-gray-300 uppercase font-bold tracking-widest">
                                Gợi ý dựa trên sở thích
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default RecommendationList;