import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = async () => {
        const token = localStorage.getItem('token');

        // Nếu không có token, reset về 0 và dừng luôn
        if (!token) {
            setCartCount(0);
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/cart/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const items = response.data.data?.items || [];
            const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(totalQuantity);

        } catch (error) {
            console.error("Lỗi cập nhật số lượng giỏ hàng:", error);
            setCartCount(0);
        }
    };

    // Lấy số lượng lần đầu khi load app
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateCartCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);