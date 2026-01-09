import React, { useState } from 'react';
import axios from 'axios';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const OrderForm = ({ initialData, onClose, onSuccess }) => {
    const [status, setStatus] = useState(initialData?.status || 'pending');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { id: 'pending', label: 'Chờ xử lý', desc: 'Đơn hàng mới chờ xác nhận', color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 'confirmed', label: 'Xác nhận', desc: 'Đã kiểm tra thông tin', color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'shipped', label: 'Giao hàng', desc: 'Đã bàn giao cho vận chuyển', color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { id: 'delivered', label: 'Hoàn thành', desc: 'Khách đã nhận hàng', color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'cancelled', label: 'Hủy đơn', desc: 'Lý do khách quan/chủ quan', color: 'text-rose-500', bg: 'bg-rose-50' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/orders/status/${initialData.id}`, 
                { status },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            toast.success("Đã cập nhật trạng thái!");
            onSuccess(); // Load lại data
            onClose();   // ĐÓNG FORM NGAY LẬP TỨC
        } catch (err) {
            toast.error("Không thể cập nhật!");
            console.log(err);
            
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
                <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">Trạng thái đơn hàng</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20}/></button>
                </div>

                <div className="p-6 space-y-3">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => setStatus(opt.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${
                                status === opt.id 
                                ? 'border-slate-800 bg-slate-50' 
                                : 'border-transparent hover:bg-slate-50'
                            }`}
                        >
                            <div className={`p-2 rounded-xl ${opt.bg} ${opt.color}`}>
                                {status === opt.id ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
                            </div>
                            <div className="text-left">
                                <p className={`font-bold text-sm ${status === opt.id ? 'text-slate-900' : 'text-slate-600'}`}>{opt.label}</p>
                                <p className="text-[11px] text-slate-400 leading-none">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-6 bg-slate-50/50 flex gap-3">
                    <button disabled={isSubmitting} onClick={handleSubmit} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : "Xác nhận thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;