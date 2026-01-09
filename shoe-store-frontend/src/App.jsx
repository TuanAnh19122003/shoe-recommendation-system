import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from './components/layouts/user/userLayout';
import AdminLayout from './components/layouts/admin/adminLayout';

import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import Home from './pages/user/Home';
import ProfilePage from './pages/user/Profile';
import Product from './pages/user/Product';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';

import Dashboard from './pages/admin/Dashboard';
import RolePage from './pages/admin/role/RolePage';
import UserPage from './pages/admin/user/UserPage';
import ProductPage from './pages/admin/product/ProductPage';
import VariantPage from './pages/admin/product-variant/VariantPage';
import OrderPage from './pages/admin/order/OrderPage';

// Component bảo vệ Route Admin
const AdminRoute = ({ children }) => {
  const userData = localStorage.getItem('user');
  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (e) {
    user = null;
    console.log(e);

  }

  if (!user || user.role?.code !== 'admin') {
    // Nếu không phải admin hoặc chưa đăng nhập, đá về trang login
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROUTES USER: Công khai */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path='profile' element={< ProfilePage />} />
          <Route path='products' element={< Product />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path='cart' element={< Cart />} />
        </Route>

        {/* ROUTES ADMIN: Cần bảo vệ */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="roles" element={<RolePage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="variants" element={<VariantPage />} />
          <Route path='orders' element={< OrderPage />} />
        </Route>

        {/* AUTH & OTHERS */}
        <Route path="/auth/login" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;