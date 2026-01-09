/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Save, Package, DollarSign, Tag, FileText, Camera, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const ProductForm = ({ initialData, onClose, onSuccess }) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category_id: '',
        stock: 0,
        image: null
    });

    useEffect(() => {

        if (initialData) {
            setFormData({
                ...initialData,
                image: null // Reset file để không bị lỗi nếu không đổi ảnh
            });
            if (initialData.image) {
                // Nếu là edit, hiển thị ảnh cũ từ server
                setPreview(`http://localhost:5000/${initialData.image}`);
            }
        }
    }, [initialData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const load = toast.loading("Đang lưu sản phẩm...");
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('category_id', formData.category_id);
            data.append('stock', formData.stock);

            // Chỉ append ảnh nếu người dùng chọn file mới
            if (formData.image instanceof File) {
                data.append('image', formData.image);
            }

            if (initialData) {
                await axios.put(`${API_URL}/products/${initialData.id}`, data);
            } else {
                await axios.post(`${API_URL}/products`, data);
            }

            toast.success("Đã cập nhật sản phẩm!", { id: load });
            onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi hệ thống", { id: load });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[95vh] overflow-y-auto">
                
                {/* Header */}
                <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-gray-800">
                            {initialData ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">SKU: {initialData?.id || 'TỰ ĐỘNG'}</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white hover:text-red-500 rounded-2xl transition-all"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    
                    {/* Upload Ảnh Sản Phẩm */}
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="relative w-full h-48 bg-gray-50 rounded-4xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center group">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-contain" alt="product" />
                            ) : (
                                <Package size={48} className="text-gray-200" />
                            )}
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current.click()} 
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all gap-2"
                            >
                                <Camera size={32} />
                                <span className="text-xs font-black uppercase">Thay đổi hình ảnh</span>
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
                    </div>

                    {/* Tên sản phẩm */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2">
                            <Package size={12} /> Tên sản phẩm
                        </label>
                        <input 
                            required 
                            value={formData.name} 
                            onChange={e => setFormData({ ...formData, name: e.target.value })} 
                            className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500/20 text-sm font-bold" 
                            placeholder="Nhập tên sản phẩm..."
                        />
                    </div>

            

                    {/* Mô tả */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2">
                            <FileText size={12} /> Mô tả sản phẩm
                        </label>
                        <textarea 
                            rows="3"
                            value={formData.description} 
                            onChange={e => setFormData({ ...formData, description: e.target.value })} 
                            className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500/20 text-sm font-medium"
                            placeholder="Thông tin chi tiết về sản phẩm..."
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                        <button type="button" onClick={onClose} className="px-8 py-3.5 rounded-2xl font-bold text-gray-400 hover:bg-gray-100 transition-all">
                            HỦY BỎ
                        </button>
                        <button type="submit" className="bg-gray-900 text-white px-10 py-3.5 rounded-2xl font-black shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all flex items-center gap-2">
                            <Save size={18} /> LƯU SẢN PHẨM
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;