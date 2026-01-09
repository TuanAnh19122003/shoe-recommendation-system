import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const RoleForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({ code: '', name: '' });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (initialData) setFormData(initialData);
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-black text-gray-800 uppercase tracking-tight">
                        {initialData ? 'Chỉnh sửa quyền' : 'Thêm quyền mới'}
                    </h3>
                    <button onClick={onCancel} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Mã Code (vd: admin)</label>
                        <input
                            required
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                            placeholder="Nhập mã code..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Tên hiển thị (vd: Quản trị viên)</label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                            placeholder="Nhập tên hiển thị..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> {initialData ? 'Cập nhật' : 'Lưu lại'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoleForm;