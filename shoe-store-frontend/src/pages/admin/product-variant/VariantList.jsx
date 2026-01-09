import React from 'react';
import AdminListItem from '../../../components/layouts/admin/AdminListItem';

const Skeleton = ({ viewMode }) => (
    <>
        {[...Array(6)].map((_, i) => (
            viewMode === 'list' ? (
                <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6">
                        <div className="h-10 bg-gray-100 rounded-2xl w-full"></div>
                    </td>
                </tr>
            ) : (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 animate-pulse">
                    <div className="aspect-4/3 rounded-3xl bg-gray-100 mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded-lg w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-50 rounded-lg w-1/3"></div>
                </div>
            )
        ))}
    </>
);

const VariantList = ({
    variants = [],
    onEdit,
    onDelete,
    onView,
    isLoading,
    viewMode,
    currentPage = 1,
    itemsPerPage = 6
}) => {
    if (isLoading) {
        return (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : ""}>
                {viewMode === 'list' ? (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <tbody className="divide-y divide-gray-50"><Skeleton viewMode="list" /></tbody>
                        </table>
                    </div>
                ) : (
                    <Skeleton viewMode="grid" />
                )}
            </div>
        );
    }

    return (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : ""}>
            {viewMode === 'list' ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-50">
                            <tr>
                                <th className="px-8 py-6 w-20 text-center">No.</th>
                                <th className="px-6 py-6">Sản phẩm chủ</th>
                                <th className="px-6 py-6 text-center">Size & Color</th>
                                <th className="px-6 py-6 text-center">Giá & Kho</th>
                                <th className="px-8 py-6 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {variants.map((v, index) => {
                                const displayIndex = (Number(currentPage) - 1) * Number(itemsPerPage) + index + 1;
                                return (
                                    <AdminListItem key={v.id} viewMode="list"
                                        onEdit={() => onEdit(v)} onDelete={() => onDelete(v.id)} onView={() => onView(v)}
                                    >
                                        <td className="px-8 py-5 text-center font-black text-gray-300 text-[11px]">
                                            {displayIndex.toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-5 font-black text-gray-800 text-sm uppercase">{v.product?.name}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-3 font-black">
                                                <span className="text-gray-400 text-[11px] uppercase">Size</span>
                                                <span className="px-2 py-0.5 bg-gray-900 text-white rounded text-[10px]">{v.size}</span>
                                                <div className="w-4 h-4 rounded-full border border-white ring-2 ring-gray-100 shadow-sm" style={{ backgroundColor: v.color }}></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="text-sm font-black text-orange-600">${v.price}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Số lượng: {v.stock}</div>
                                        </td>
                                    </AdminListItem>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                variants.map((v, index) => {
                    const displayIndex = (Number(currentPage) - 1) * Number(itemsPerPage) + index + 1;
                    return (
                        <AdminListItem key={v.id} viewMode="grid"
                            onEdit={() => onEdit(v)} onDelete={() => onDelete(v.id)} onView={() => onView(v)}
                        >
                            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/50 transition-all group relative overflow-hidden">
                                {/* Decor Background */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-indigo-50 transition-colors duration-500"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#{displayIndex.toString().padStart(2, '0')}</span>
                                        <div className="w-8 h-8 rounded-full border-4 border-white shadow-lg ring-1 ring-gray-100" style={{ backgroundColor: v.color }}></div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center py-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Kích thước</h4>
                                        <div className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase group-hover:scale-110 transition-transform duration-500">
                                            {v.size}
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-50">
                                        <h3 className="font-black text-gray-800 uppercase text-[10px] line-clamp-1 mb-2">{v.product?.name}</h3>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">Giá niêm yết</p>
                                                <p className="text-lg font-black text-orange-600 tracking-tighter">${v.price}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">Tồn kho</p>
                                                <p className={`text-xs font-black ${v.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{v.stock} SP</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AdminListItem>
                    );
                })
            )}
        </div>
    );
};

export default VariantList;