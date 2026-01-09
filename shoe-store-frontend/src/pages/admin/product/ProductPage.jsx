import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, RefreshCw, LayoutGrid, List, X, Tag, DollarSign, Box, Calendar, Clock, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ProductList from './ProductList'; // Bạn nhớ tạo component này tương tự UserList
import Pagination from '../../../components/Pagination';
import ProductForm from './ProductForm';

const API_URL = import.meta.env.VITE_API_URL;

const ProductPage = () => {
    // --- STATES DỮ LIỆU ---
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // Sản phẩm thường xem dạng Grid đẹp hơn

    // --- STATES ĐIỀU KHIỂN MODAL ---
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProductDetail, setSelectedProductDetail] = useState(null);

    // --- PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    // --- LOGIC FETCH DATA ---
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/products`);
            if (res.data.success) {
                setProducts(res.data.data);
            }
        } catch (err) {
            toast.error("Không thể lấy danh sách sản phẩm!");
            console.log(err);

        } finally {
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    // --- XỬ LÝ XÓA ---
    const handleDelete = async (id) => {
        if (window.confirm("Xóa sản phẩm này? Dữ liệu sẽ không thể khôi phục.")) {
            const loadingToast = toast.loading('Đang xóa...');
            try {
                await axios.delete(`${API_URL}/products/${id}`);
                toast.success('Đã xóa sản phẩm thành công!', { id: loadingToast });
                fetchProducts();
            } catch (err) {
                toast.error('Lỗi khi xóa sản phẩm!', { id: loadingToast });
                console.log(err);

            }
        }
    };

    // --- PHÂN TRANG LOGIC ---
    const totalPages = Math.ceil(products.length / pageSize);
    const currentData = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Toaster position="top-right" />

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                        <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
                            <Package className="text-white" size={24} />
                        </div>
                        Kho sản phẩm
                    </h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 ml-1">
                        Hiện có: <span className="text-orange-600">{products.length}</span> mặt hàng
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode */}
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-orange-600' : 'text-gray-400'}`}>
                            <List size={20} />
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-orange-600' : 'text-gray-400'}`}>
                            <LayoutGrid size={20} />
                        </button>
                    </div>

                    {/* Refresh */}
                    <button onClick={fetchProducts} className="p-3.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all">
                        <RefreshCw size={20} className={`${isLoading ? 'animate-spin text-orange-600' : 'text-gray-400'}`} />
                    </button>

                    {/* Add New */}
                    <button
                        onClick={() => { setEditingProduct(null); setShowForm(true); }}
                        className="bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-black shadow-xl active:scale-95 transition-all"
                    >
                        <Plus size={18} strokeWidth={3} /> Thêm sản phẩm
                    </button>
                </div>
            </div>

            {/* MAIN LIST SECTION */}
            <div className="min-h-100">
                <ProductList
                    products={currentData}
                    isLoading={isLoading}
                    viewMode={viewMode}
                    onEdit={(p) => { setEditingProduct(p); setShowForm(true); }}
                    onDelete={handleDelete}
                    onView={(p) => setSelectedProductDetail(p)}
                    currentPage={currentPage}   // Đảm bảo có dòng này
                    itemsPerPage={pageSize}
                />
            </div>

            {/* PAGINATION */}
            {!isLoading && products.length > pageSize && (
                <div className="flex justify-center pt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* MODAL CHI TIẾT SẢN PHẨM */}
            {selectedProductDetail && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setSelectedProductDetail(null)}></div>

                    <div className="bg-white rounded-[3rem] w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Product Image Header */}
                        <div className="h-64 bg-gray-100 relative">
                            {selectedProductDetail.image ? (
                                <img src={`http://localhost:5000/${selectedProductDetail.image}`} alt="Product" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"><Package size={60} className="text-gray-200" /></div>
                            )}
                            <button onClick={() => setSelectedProductDetail(null)} className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors">
                                <X size={20} />
                            </button>

                        </div>

                        {/* Product Info */}
                        <div className="p-8 space-y-6">
                            {/* Tên sản phẩm & Slug chính */}
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-gray-800 leading-tight">
                                    {selectedProductDetail.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black italic uppercase border border-orange-100">
                                        {selectedProductDetail.slug}
                                    </span>
                                </div>
                            </div>

                            {/* Grid thông tin bổ sung */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Clock size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Cập nhật lúc</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">
                                        {selectedProductDetail.updatedAt
                                            ? new Date(selectedProductDetail.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                                            : '--:--'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Calendar size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Ngày hệ thống</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">
                                        {selectedProductDetail.updatedAt
                                            ? new Date(selectedProductDetail.updatedAt).toLocaleDateString('vi-VN')
                                            : '---'}
                                    </p>
                                </div>
                            </div>

                            {/* Định danh chi tiết (Slug Identifier) */}
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Định danh sản phẩm (Slug)</span>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-xs font-mono font-bold text-gray-500 break-all leading-relaxed">
                                        {window.location.origin}/products/{selectedProductDetail.slug}
                                    </p>
                                </div>
                            </div>

                            {/* Nút đóng */}
                            <button
                                onClick={() => setSelectedProductDetail(null)}
                                className="w-full py-4 bg-gray-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
                            >
                                ĐÓNG CỬA SỔ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FORM MODAL */}
            {showForm && (
                <ProductForm
                    initialData={editingProduct}
                    onClose={() => { setShowForm(false); setEditingProduct(null); }}
                    onSuccess={() => { setShowForm(false); fetchProducts(); }}
                />
            )}
        </div>
    );
};

export default ProductPage;