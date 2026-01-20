import axios from 'axios';

// Tạo một bản instance của axios
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * INTERCEPTOR CHO REQUEST: 
 * Tự động đính kèm Token vào Header mỗi khi gửi API
 */
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * INTERCEPTOR CHO RESPONSE:
 * Kiểm tra mã lỗi từ Server trả về. 
 * Nếu là 401 (Unauthorized) nghĩa là Token đã hết hạn hoặc không hợp lệ.
 */
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Kiểm tra lỗi 401
        if (error.response && error.response.status === 401) {
            console.error("Token hết hạn hoặc không hợp lệ. Đang đăng xuất...");

            // 1. Xóa sạch dấu vết trong LocalStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // 2. Ép trình duyệt chuyển hướng về trang Auth/Login
            // Dùng window.location để đảm bảo app được reload hoàn toàn trạng thái sạch
            window.location.href = '/auth';
        }

        return Promise.reject(error);
    }
);

export default axiosClient;