import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * @param {Element} children - Component muốn bảo vệ
 * @param {Array} allowedRoles
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();

    // 1. Lấy dữ liệu từ LocalStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // 2. Nếu chưa đăng nhập -> Đẩy về trang Login
    if (!token || !user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // 3. Nếu có yêu cầu về quyền (Roles) nhưng user không đủ quyền
    if (allowedRoles && !allowedRoles.includes(user.role?.code)) {
        // Đẩy về trang chủ hoặc trang thông báo từ chối truy cập
        return <Navigate to="/" replace />;
    }

    // 4. Nếu mọi thứ hợp lệ -> Cho phép truy cập
    return children;
};

export default ProtectedRoute;