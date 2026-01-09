import React, { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, User, CreditCard, Plus, Minus } from 'lucide-react';

function App() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sử dụng useEffect để đồng bộ dữ liệu từ hệ thống bên ngoài (API)
  useEffect(() => {
    // Định nghĩa hàm fetch bên trong Effect để tránh lỗi phụ thuộc
    const fetchCartData = async () => {
      try {
        setLoading(true);
        
        // MÔ PHỎNG: Giả lập gọi API (Sau này thay bằng axios.get)
        const mockData = {
          id: 1,
          user: { first_name: "Thế", last_name: "Vinh" },
          items: [
            {
              id: 101,
              quantity: 1,
              variant: {
                size: "42",
                color: "#000000",
                price: 150.00,
                product: { name: "Nike Air Jordan 1", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop" }
              }
            }
          ]
        };

        // Giả lập delay mạng 500ms
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCart(mockData);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []); 
  
  // --- Logic hiển thị ---
  if (loading) return (
    <div className="flex h-screen items-center justify-center space-x-2">
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );

  if (!cart) return <div className="p-10 text-center">Không có dữ liệu.</div>;

  const totalPrice = cart.items.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* UI phần Header và Content giữ nguyên như code trước của bạn */}
        <header className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <ShoppingBag className="text-blue-600" /> Giỏ hàng
            </h1>
            <p className="font-medium text-gray-600 italic">User: {cart.user.first_name}</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                {cart.items.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                        <img src={item.variant.product.image} className="w-20 h-20 object-cover rounded-lg" alt="" />
                        <div className="flex-1">
                            <p className="font-bold">{item.variant.product.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.variant.color}}></div>
                                <span>Size: {item.variant.size}</span>
                            </div>
                        </div>
                        <div className="font-bold text-blue-600">${item.variant.price}</div>
                    </div>
                ))}
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
                <p className="text-gray-500">Tổng cộng:</p>
                <p className="text-3xl font-black text-gray-900">${totalPrice.toFixed(2)}</p>
                <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    Thanh toán
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;