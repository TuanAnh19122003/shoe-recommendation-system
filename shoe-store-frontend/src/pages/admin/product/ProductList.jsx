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
                /* Skeleton cho Card (Grid) */
                <div key={i} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 animate-pulse">
                    <div className="aspect-square rounded-4xl bg-gray-100 mb-4"></div>
                    <div className="space-y-3 px-2">
                        <div className="h-4 bg-gray-100 rounded-lg w-3/4"></div>
                        <div className="h-3 bg-gray-50 rounded-lg w-1/2"></div>
                    </div>
                </div>
            )
        ))}
    </>
);

const ProductList = ({ 
    products = [], 
    onEdit, 
    onDelete, 
    onView, 
    isLoading, 
    viewMode, 
    currentPage = 1, 
    itemsPerPage = 6 
}) => {
    // Nếu đang load, hiển thị Skeleton cho cả 2 chế độ
    if (isLoading) {
        return (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}>
                {viewMode === 'list' ? (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <tbody className="divide-y divide-gray-50">
                                <Skeleton viewMode="list" />
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Skeleton viewMode="grid" />
                )}
            </div>
        );
    }

    // Nếu không có dữ liệu
    if (!products.length) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Kho hàng trống</p>
            </div>
        );
    }

    return (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}>
            {viewMode === 'list' ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-50">
                            <tr>
                                <th className="px-8 py-6 w-20 text-center">No.</th>
                                <th className="px-6 py-6">Sản phẩm</th>
                                <th className="px-6 py-6">Slug identifier</th>
                                <th className="px-6 py-6">Ngày cập nhật</th>
                                <th className="px-8 py-6 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product, index) => {
                                const displayIndex = (Number(currentPage) - 1) * Number(itemsPerPage) + index + 1;
                                return (
                                    <AdminListItem
                                        key={product.id}
                                        viewMode="list"
                                        onEdit={() => onEdit(product)}
                                        onDelete={() => onDelete(product.id)}
                                        onView={() => onView(product)}
                                    >
                                        <td className="px-8 py-5 text-center font-black text-gray-300 text-[11px]">
                                            {displayIndex.toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-5 font-black text-gray-800 text-sm">{product.name}</td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black italic uppercase">
                                                {product.slug}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                                            {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                                        </td>
                                    </AdminListItem>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Grid View thật */
                products.map((product, index) => {
                    const displayIndex = (Number(currentPage) - 1) * Number(itemsPerPage) + index + 1;
                    return (
                        <AdminListItem
                            key={product.id}
                            viewMode="grid"
                            onEdit={() => onEdit(product)}
                            onDelete={() => onDelete(product.id)}
                            onView={() => onView(product)}
                        >
                            <div className="space-y-4 relative group">
                                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm shadow-sm rounded-xl px-2.5 py-1 text-[10px] font-black text-gray-400 border border-gray-50">
                                    #{displayIndex.toString().padStart(2, '0')}
                                </div>
                                <div className="aspect-square rounded-2rem overflow-hidden bg-gray-50 border border-gray-100">
                                    <img 
                                        src={`http://localhost:5000/${product.image}`} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        alt={product.name}
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                                    />
                                </div>
                                <div className="px-1">
                                    <h3 className="font-black text-gray-800 uppercase text-xs line-clamp-1">{product.name}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 italic">/{product.slug}</p>
                                </div>
                            </div>
                        </AdminListItem>
                    );
                })
            )}
        </div>
    );
};

export default ProductList;