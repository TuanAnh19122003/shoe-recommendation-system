import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Box, Ruler, Palette, DollarSign, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const VariantForm = ({ initialData, onClose, onSuccess }) => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        product_id: '',
        size: '',
        color: '#000000',
        price: '',
        stock: 0
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/products`);
                if (res.data.success) setProducts(res.data.data);
            } catch (err) {
                toast.error("Lỗi tải danh mục"); console.log(err);
            }
        };
        fetchProducts();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (initialData) setFormData({ ...initialData });
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const load = toast.loading("Đang lưu...");
        try {
            if (initialData) await axios.put(`${API_URL}/product-variants/${initialData.id}`, formData);
            else await axios.post(`${API_URL}/product-variants`, formData);
            toast.success("Thành công!", { id: load });
            onSuccess();
        } catch (err) {
            toast.error("Lỗi xử lý", { id: load }); console.log(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-black uppercase text-gray-800 tracking-tighter">Biến thể cấu hình</h2>
                    <button onClick={onClose} className="p-3 hover:bg-white hover:text-red-500 rounded-2xl transition-all"><X /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><Box size={12} /> Sản phẩm chủ</label>
                        <select required className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold"
                            value={formData.product_id} onChange={e => setFormData({ ...formData, product_id: e.target.value })}
                        >
                            <option value="">Chọn sản phẩm gốc...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><Ruler size={12} /> Kích thước</label>
                            <input required className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold"
                                value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} placeholder="S, M, 42..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><Palette size={12} /> Mã màu</label>
                            <input type="color" className="w-full h-48px p-1 bg-gray-50 border-none rounded-2xl cursor-pointer"
                                value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><DollarSign size={12} /> Giá bán ($)</label>
                            <input type="number" step="0.01" required className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold"
                                value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><Database size={12} /> Tồn kho</label>
                            <input type="number" required className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold"
                                value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6">
                        <button type="button" onClick={onClose} className="px-8 py-3.5 rounded-2xl font-bold text-gray-400 hover:bg-gray-100 transition-all uppercase text-xs">Hủy</button>
                        <button type="submit" className="bg-gray-900 text-white px-10 py-3.5 rounded-2xl font-black shadow-lg hover:bg-black transition-all flex items-center gap-2 uppercase text-xs tracking-widest">
                            <Save size={16} /> Lưu dữ liệu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VariantForm;