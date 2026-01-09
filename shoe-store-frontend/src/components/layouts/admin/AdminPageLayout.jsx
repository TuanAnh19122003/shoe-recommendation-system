import React from 'react';
import { Plus, RefreshCw, LayoutGrid, List } from 'lucide-react';

const AdminPageLayout = ({ title, icon: Icon, onAdd, onRefresh, isLoading, viewMode, setViewMode, children }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                    {Icon && <Icon className="text-blue-600" size={28} />} {title}
                </h1>
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 mr-2">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><List size={20} /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><LayoutGrid size={20} /></button>
                    </div>
                    <button onClick={onRefresh} disabled={isLoading} className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                        <RefreshCw size={20} className={isLoading ? 'animate-spin text-blue-600' : 'text-gray-400'} />
                    </button>
                    <button onClick={onAdd} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                        <Plus size={20} /> Thêm mới
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
};

export default AdminPageLayout;