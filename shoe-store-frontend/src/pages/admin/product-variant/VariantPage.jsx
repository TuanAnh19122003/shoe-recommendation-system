import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Plus, RefreshCw, LayoutGrid, List } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import VariantList from './VariantList';
import VariantForm from './VariantForm';
import Pagination from '../../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL;

const VariantPage = () => {
    const [variants, setVariants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [editingVariant, setEditingVariant] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = viewMode === 'grid' ? 8 : 6;

    const fetchVariants = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/product-variants`);
            if (res.data.success) setVariants(res.data.data);
        } catch (err) {
            toast.error("Lỗi kết nối Server"); console.log(err);
        }
        finally { setTimeout(() => setIsLoading(false), 800); }
    };

    useEffect(() => { fetchVariants(); }, []);

    const totalPages = Math.ceil(variants.length / pageSize);
    const currentData = variants.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <Toaster position="top-right" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg"><Layers className="text-white" size={24} /></div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Biến thể</h1>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Quản lý mẫu mã & kho</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl mr-2">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}><List size={18} /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}><LayoutGrid size={18} /></button>
                    </div>
                    <button onClick={fetchVariants} className="p-3.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all">
                        <RefreshCw size={18} className={isLoading ? 'animate-spin text-indigo-600' : 'text-gray-400'} />
                    </button>
                    <button onClick={() => { setEditingVariant(null); setShowForm(true); }}
                        className="bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-black shadow-xl"
                    >
                        <Plus size={18} /> Thêm biến thể
                    </button>
                </div>
            </div>

            <VariantList
                variants={currentData} isLoading={isLoading} viewMode={viewMode}
                currentPage={currentPage} itemsPerPage={pageSize}
                onEdit={(v) => { setEditingVariant(v); setShowForm(true); }}
                onDelete={async (id) => { if (window.confirm("Xóa?")) { await axios.delete(`${API_URL}/product-variants/${id}`); fetchVariants(); } }}
                onView={(v) => toast.success(`Mẫu: ${v.size}`)}
            />

            {!isLoading && variants.length > pageSize && (
                <div className="flex justify-center pt-4">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            )}

            {showForm && <VariantForm initialData={editingVariant} onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); fetchVariants(); }} />}
        </div>
    );
};

export default VariantPage;